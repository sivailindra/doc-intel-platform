import { NextResponse } from 'next/server';
import templateDB from '@/lib/templateDB.json';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Helper to generate some random plausible values for the mock
const generateMockValue = (type: string, key: string) => {
  if (type === 'date') return '15-08-1990';
  if (type === 'number') return Math.floor(Math.random() * 50) + 18;
  if (key.includes('name')) return 'Arjun Kumar';
  if (key.includes('gender')) return 'Male';
  if (key.includes('address')) return '123 Tech Park, Phase 1, Bengaluru, 560001';
  if (key.includes('state')) return 'Karnataka';
  if (key.includes('aadhaar')) return 'XXXX XXXX 1234';
  return `Sample ${key}`;
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Simulate network and AI processing delay for MVP
    await delay(3000); // 3 seconds simulating real-time center processing

    // Randomly pick a template to simulate classification based on the uploaded file
    // For a real app, this would be based on an ML Model's classification output.
    const fileLower = file.name.toLowerCase();
    
    let matchedTemplate = templateDB[0]; // Default Aadhaar
    if (fileLower.includes('pan')) matchedTemplate = templateDB[1];
    else if (fileLower.includes('dl') || fileLower.includes('driving')) matchedTemplate = templateDB[2];
    else if (fileLower.includes('voter')) matchedTemplate = templateDB[3];
    else {
      // Pick random if no keyword match
      matchedTemplate = templateDB[Math.floor(Math.random() * templateDB.length)];
    }

    // Simulate extraction and validation against the matched template
    const extractedData: Record<string, any> = {};
    const fieldScores: Record<string, number> = {};
    let isFraud = false;
    const fraudFlags: string[] = [];
    
    let overallConfidence = 0;

    matchedTemplate.required_fields.forEach(field => {
      extractedData[field.key] = generateMockValue(field.type, field.key);
      
      // Simulate confidence score between 80-99%
      const score = Math.floor(Math.random() * 20) + 80;
      fieldScores[field.key] = score;
      overallConfidence += score;
    });

    overallConfidence = Math.floor(overallConfidence / matchedTemplate.required_fields.length);

    // Simulate authenticity check (e.g. 10% chance to flag as fraud/tampered for MVP demo)
    const fraudChance = Math.random();
    if (fraudChance > 0.9) {
      isFraud = true;
      overallConfidence = Math.floor(Math.random() * 20) + 50; // Low confidence
      fraudFlags.push(`Missing authenticity marker: ${matchedTemplate.authenticity_markers[0]}`);
      fraudFlags.push(`Layout mismatch detected around ${matchedTemplate.required_fields[0].label}`);
    }

    return NextResponse.json({
      success: true,
      data: {
        filename: file.name,
        template_id: matchedTemplate.id,
        template_name: matchedTemplate.name,
        department: matchedTemplate.department,
        extracted_fields: extractedData,
        confidence_scores: fieldScores,
        overall_confidence: overallConfidence,
        authenticity_verified: !isFraud,
        flags: fraudFlags,
        status: isFraud ? 'flagged' : 'approved', // Pre-classification for Officer Queue
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
