import { GoogleGenAI } from '@google/genai';
import templates from './templateDB.json';
import { getKnowledgeContext } from './knowledgeStore';

export interface ExtractionResult {
    templateId: string;
    templateName: string;
    department: string;
    extractedFields: Record<string, string | null>;
    confidenceScores: Record<string, number>;
    overallConfidence: number;
    isFraud: boolean;
    fraudFlags: string[];
}

export async function extractDocumentData(
    fileBuffer: Buffer,
    mimeType: string
): Promise<ExtractionResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not set');

    const ai = new GoogleGenAI({ apiKey });

    const templateSummary = templates
        .map(t => `• ${t.id} — "${t.name}" (${t.department})`)
        .join('\n');

    const historicalContext = await getKnowledgeContext();

    // Single-pass: classify + extract + authenticate in one call
    const prompt = `
You are an expert Document Intelligence AI for Indian government and official forms.

${historicalContext}

Analyse the provided document image and do THREE things in one response:

1. CLASSIFY: Which template does this match? Use its id from:
${templateSummary}
If it does not match any, use id "generic".

2. EXTRACT: Pull out every visible data field — names, dates, ID numbers, addresses, phone, email, gender, amounts, authorities, purposes etc. Use clear human-readable labels (e.g. "Full Name", "Date of Birth"). Extract ALL visible fields.

3. AUTHENTICATE: Check for tampering — mismatched fonts, cut-paste elements, missing official seals/stamps, signature anomalies, digital alterations, unusually low print quality, and structurally missing/added fields based on the Historical Knowledge Context.

Respond ONLY with a valid JSON object (no markdown fences, no extra text):
{
  "templateId": "<matched id or 'generic'>",
  "fields": { "<Human Readable Label>": "<extracted value or null>" },
  "confidence": { "<Human Readable Label>": <0-100> },
  "isFraud": <true|false>,
  "fraudFlags": ["<anomaly description>"]
}
`.trim();

    // Try models in order of quota efficiency; auto-fallback on 429
    const MODELS = ['gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-2.5-flash'];
    let raw: string | undefined;
    let lastErr: unknown;
    let allQuotaExhausted = true;

    for (const model of MODELS) {
        try {
            const response = await ai.models.generateContent({
                model,
                contents: [{
                    role: 'user',
                    parts: [
                        { text: prompt },
                        { inlineData: { data: fileBuffer.toString('base64'), mimeType } }
                    ]
                }],
                config: { responseMimeType: 'application/json', temperature: 0.1 }
            });
            raw = response.text ?? undefined;
            if (raw) {
                allQuotaExhausted = false;
                console.log(`[gemini] Extraction succeeded with model: ${model}`);
                break;
            }
        } catch (err: unknown) {
            lastErr = err;
            const errStr = JSON.stringify(err);
            const isRateLimit = errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED');
            if (!isRateLimit) {
                allQuotaExhausted = false;
                throw err;
            }
            console.warn(`[gemini] ${model} quota-limited, trying next model…`);
        }
    }

    if (!raw) {
        if (allQuotaExhausted) {
            throw new Error(
                'Daily Gemini API quota exhausted. Free tier resets after midnight Pacific Time. ' +
                'Options: (1) wait for daily reset, (2) upgrade at https://ai.google.dev, ' +
                'or (3) create a new API key at ai.google.dev for a fresh quota.'
            );
        }
        throw lastErr ?? new Error('All Gemini models returned empty response');
    }

    let parsed: any;
    try {
        const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
        parsed = JSON.parse(clean);
    } catch {
        throw new Error(`Gemini returned invalid JSON: ${raw.slice(0, 300)}`);
    }

    const matchedTemplate = templates.find(t => t.id === parsed.templateId);
    const fields: Record<string, string | null> = parsed.fields ?? {};
    const confidence: Record<string, number> = parsed.confidence ?? {};

    const scores = Object.values(confidence).filter((v): v is number => typeof v === 'number');
    const overallConfidence = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 70;

    return {
        templateId: parsed.templateId ?? 'generic',
        templateName: matchedTemplate?.name ?? 'General Document',
        department: matchedTemplate?.department ?? 'Document Intelligence',
        extractedFields: fields,
        confidenceScores: confidence,
        overallConfidence,
        isFraud: parsed.isFraud === true,
        fraudFlags: Array.isArray(parsed.fraudFlags) ? parsed.fraudFlags : [],
    };
}
