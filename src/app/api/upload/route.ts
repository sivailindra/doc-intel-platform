import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { extractDocumentData } from '@/lib/gemini-extract';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Convert file type to something Gemini understands if needed
    let mimeType = file.type;
    if (!mimeType || mimeType === 'application/octet-stream') {
      if (file.name.endsWith('.pdf')) mimeType = 'application/pdf';
      else if (file.name.endsWith('.png')) mimeType = 'image/png';
      else if (file.name.match(/\.jpe?g$/)) mimeType = 'image/jpeg';
      else mimeType = 'image/jpeg'; // fallback
    }

    console.log(`Processing file: ${file.name} [${mimeType}]`);

    // 1. Call Gemini to extract the 16 fields and detect fraud
    let extractedData: Record<string, any>;
    try {
      // Timeout handle if Gemini takes too long
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Gemini API Timeout")), 30000));
      // Use standard Promise.race
      extractedData = (await Promise.race([
        extractDocumentData(buffer, mimeType),
        timeoutPromise
      ])) as Record<string, any>;
    } catch (apiError: unknown) {
      console.error("Gemini API Error:", apiError);
      return NextResponse.json({ error: 'AI Extraction Failed (Check API Keys or PDF Size)' }, { status: 500 });
    }

    // 2. Compute Overall Confidence
    // Pluck all the *Conf properties into an array, average them
    const confKeys = Object.keys(extractedData).filter(k => k.endsWith('Conf'));
    const totalConf = confKeys.reduce((acc, k) => acc + (Number(extractedData[k]) || 0), 0);
    const overallConfidence = confKeys.length > 0 ? Math.floor(totalConf / confKeys.length) : 0;

    // 3. Authenticity Logic
    const isFraud = extractedData.isFraud === true;
    const fraudFlags: string[] = Array.isArray(extractedData.fraudFlags) ? extractedData.fraudFlags : [];

    // 4. Save to Prisma Database

    // Find a template (using default for now)
    const template = await prisma.template.findFirst();

    // The fields mapped exactly as per schema.prisma
    const applicantRecord = await prisma.applicant.create({
      data: {
        templateId: template?.id,
        overallConfidence,
        authenticityVerified: !isFraud,
        fraudFlags: JSON.stringify(fraudFlags),
        status: isFraud ? 'flagged' : 'approved',

        applicationFormName: extractedData.applicationFormName,
        applicationFormNameConf: extractedData.applicationFormNameConf,

        applicantName: extractedData.applicantName,
        applicantNameConf: extractedData.applicantNameConf,

        parentName: extractedData.parentName,
        parentNameConf: extractedData.parentNameConf,

        dobAndAge: extractedData.dobAndAge,
        dobAndAgeConf: extractedData.dobAndAgeConf,

        gender: extractedData.gender,
        genderConf: extractedData.genderConf,

        photoPasted: extractedData.photoPasted,
        photoPastedConf: extractedData.photoPastedConf,

        phoneNumber: extractedData.phoneNumber,
        phoneNumberConf: extractedData.phoneNumberConf,

        address: extractedData.address,
        addressConf: extractedData.addressConf,

        pin: extractedData.pin,
        pinConf: extractedData.pinConf,

        email: extractedData.email,
        emailConf: extractedData.emailConf,

        isSigned: extractedData.isSigned,
        isSignedConf: extractedData.isSignedConf,

        hasGovtSeal: extractedData.hasGovtSeal,
        hasGovtSealConf: extractedData.hasGovtSealConf,

        purpose: extractedData.purpose,
        purposeConf: extractedData.purposeConf,

        aadharNumber: extractedData.aadharNumber,
        aadharNumberConf: extractedData.aadharNumberConf,

        panNumber: extractedData.panNumber,
        panNumberConf: extractedData.panNumberConf,

        placeOfBirth: extractedData.placeOfBirth,
        placeOfBirthConf: extractedData.placeOfBirthConf,
      }
    });

    // 5. Structure payload for the frontend UI
    return NextResponse.json({
      success: true,
      data: {
        id: applicantRecord.id,
        filename: file.name,
        template_name: template?.name || 'Unknown Template',
        department: template?.department || 'System',
        // Group the fields nicely
        extracted_fields: {
          "Form Name": applicantRecord.applicationFormName,
          "Applicant": applicantRecord.applicantName,
          "Parent/Guardian": applicantRecord.parentName,
          "DOB/Age": applicantRecord.dobAndAge,
          "Gender": applicantRecord.gender,
          "Photo Pasted": applicantRecord.photoPasted ? "Yes" : "No",
          "Phone": applicantRecord.phoneNumber,
          "Address": applicantRecord.address,
          "PIN": applicantRecord.pin,
          "Email": applicantRecord.email,
          "Signed": applicantRecord.isSigned ? "Yes" : "No",
          "Govt Seal": applicantRecord.hasGovtSeal ? "Yes" : "No",
          "Purpose": applicantRecord.purpose,
          "Aadhar": applicantRecord.aadharNumber,
          "PAN": applicantRecord.panNumber,
          "Place of Birth": applicantRecord.placeOfBirth
        },
        confidence_scores: {
          "Form Name": applicantRecord.applicationFormNameConf,
          "Applicant": applicantRecord.applicantNameConf,
          "Parent/Guardian": applicantRecord.parentNameConf,
          "DOB/Age": applicantRecord.dobAndAgeConf,
          "Gender": applicantRecord.genderConf,
          "Photo Pasted": applicantRecord.photoPastedConf,
          "Phone": applicantRecord.phoneNumberConf,
          "Address": applicantRecord.addressConf,
          "PIN": applicantRecord.pinConf,
          "Email": applicantRecord.emailConf,
          "Signed": applicantRecord.isSignedConf,
          "Govt Seal": applicantRecord.hasGovtSealConf,
          "Purpose": applicantRecord.purposeConf,
          "Aadhar": applicantRecord.aadharNumberConf,
          "PAN": applicantRecord.panNumberConf,
          "Place of Birth": applicantRecord.placeOfBirthConf
        },
        overall_confidence: overallConfidence,
        authenticity_verified: applicantRecord.authenticityVerified,
        flags: fraudFlags,
        status: applicantRecord.status,
      }
    });

  } catch (error) {
    console.error('API Final Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
