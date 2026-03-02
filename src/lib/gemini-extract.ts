import { GoogleGenAI } from '@google/genai';

export async function extractDocumentData(fileBuffer: Buffer, mimeType: string) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing GEMINI_API_KEY environment variable");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
    You are an expert Document Intelligence agent extracting data from Indian Government and standard Application Forms into a strict JSON schema.
    Your task is to accurately extract 16 specific fields from the provided image/document.

    If a field is completely missing, return null for its value.
    For boolean fields (photoPasted, isSigned, hasGovtSeal), return true only if clearly visible, otherwise false.
    For confidence scores, return a number between 0 and 100 based on the clarity and certainty of the extraction.

    Expected JSON Output Structure:
    {
      "applicationFormName": string | null,
      "applicationFormNameConf": number,
      "applicantName": string | null,
      "applicantNameConf": number,
      "parentName": string | null,
      "parentNameConf": number,
      "dobAndAge": string | null,
      "dobAndAgeConf": number,
      "gender": string | null,
      "genderConf": number,
      "photoPasted": boolean,
      "photoPastedConf": number,
      "phoneNumber": string | null,
      "phoneNumberConf": number,
      "address": string | null,
      "addressConf": number,
      "pin": string | null,
      "pinConf": number,
      "email": string | null,
      "emailConf": number,
      "isSigned": boolean,
      "isSignedConf": number,
      "hasGovtSeal": boolean,
      "hasGovtSealConf": number,
      "purpose": string | null,
      "purposeConf": number,
      "aadharNumber": string | null,
      "aadharNumberConf": number,
      "panNumber": string | null,
      "panNumberConf": number,
      "placeOfBirth": string | null,
      "placeOfBirthConf": number,
      "fraudFlags": string[], // List any anomalies like tampering, missing required seals
      "isFraud": boolean      // True if highly suspicious
    }
  `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            {
                role: 'user', parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            data: fileBuffer.toString("base64"),
                            mimeType: mimeType
                        }
                    }
                ]
            }
        ],
        config: {
            responseMimeType: "application/json",
            temperature: 0.1
        }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No text returned from Gemini extracted response");
    }
    return JSON.parse(text);
}
