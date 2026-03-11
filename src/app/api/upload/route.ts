import { NextResponse } from 'next/server';
import { extractDocumentData } from '@/lib/gemini-extract';
import { learnFromDocument } from '@/lib/knowledgeStore';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // ── Guard: require API key ──────────────────────────────────────────────
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY is not configured. Please add it to .env.local and restart the dev server.',
      }, { status: 503 });
    }

    // ── Resolve MIME type ───────────────────────────────────────────────────
    let mimeType = file.type;
    if (!mimeType || mimeType === 'application/octet-stream') {
      const name = file.name.toLowerCase();
      if (name.endsWith('.pdf')) mimeType = 'application/pdf';
      else if (name.endsWith('.png')) mimeType = 'image/png';
      else if (name.match(/\.jpe?g$/)) mimeType = 'image/jpeg';
      else if (name.endsWith('.webp')) mimeType = 'image/webp';
      else mimeType = 'image/jpeg';
    }

    console.log(`[upload] Processing "${file.name}" [${mimeType}]`);

    const buffer = Buffer.from(await file.arrayBuffer());

    // ── Extract with timeout ────────────────────────────────────────────────
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Extraction timed out after 45s')), 45_000)
    );

    const result = await Promise.race([
      extractDocumentData(buffer, mimeType),
      timeout,
    ]);

    console.log(`[upload] Done — template="${result.templateName}", confidence=${result.overallConfidence}%`);

    // ── Self-Learning Hook ──────────────────────────────────────────────────
    // If the document is authentic and has a high confidence score, learn its structure
    if (!result.isFraud && result.overallConfidence > 80 && result.templateId !== 'generic') {
      // Do this asynchronously so we don't block the response
      learnFromDocument(result.templateId, result.extractedFields).catch(err => {
        console.error('[upload] Background learning failed:', err);
      });
    }

    // ── Persist to officer queue key in response (no DB needed) ────────────
    return NextResponse.json({
      success: true,
      data: {
        id: `live-${Date.now()}`,
        filename: file.name,
        template_name: result.templateName,
        department: result.department,
        extracted_fields: result.extractedFields,
        confidence_scores: result.confidenceScores,
        overall_confidence: result.overallConfidence,
        authenticity_verified: !result.isFraud,
        flags: result.fraudFlags,
        status: result.isFraud ? 'flagged' : 'approved',
      }
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[upload] Error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
