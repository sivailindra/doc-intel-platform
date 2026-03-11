import fs from 'fs/promises';
import path from 'path';

export interface DocumentKnowledge {
    templateId: string;
    fieldCount: number;
    fieldKeys: string[];
    avgConfidence: number;
    timestamp: string;
}

export interface KnowledgeStoreData {
    templates: Record<string, {
        documentCount: number;
        avgFieldCount: number;
        commonFields: string[];
        lastLearned: string;
    }>;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const STORE_PATH = path.join(DATA_DIR, 'knowledge.json');

async function ensureStoreDirs() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
    } catch {
        // Ignore if exists
    }
}

export async function getKnowledgeContext(): Promise<string> {
    try {
        await ensureStoreDirs();
        const data = await fs.readFile(STORE_PATH, 'utf-8');
        const store: KnowledgeStoreData = JSON.parse(data);

        if (Object.keys(store.templates).length === 0) return '';

        let context = '### HISTORICAL KNOWLEDGE CONTEXT ###\n';
        context += 'Use the following structural patterns learned from previously verified documents to detect ANY deviations. Deviations in these patterns often indicate tampering, fraud, or forgery.\n\n';

        for (const [tplId, tplData] of Object.entries(store.templates)) {
            if (tplId === 'generic' || tplData.documentCount < 1) continue;
            context += `- Template: "${tplId}"\n`;
            context += `  - Verified History: ${tplData.documentCount} documents\n`;
            context += `  - Expected Field Count: ~${Math.round(tplData.avgFieldCount)}\n`;
            context += `  - Core Expected Fields: ${tplData.commonFields.join(', ')}\n\n`;
        }

        context += 'If the currently uploaded document claims to be one of the templates above, but is missing core expected fields, has a significantly different field count, or exhibits font/layout anomalies compared to official structures, you MUST flag it as `isFraud: true` and detail the structural deviations in `fraudFlags`.\n';

        return context;
    } catch (err: any) {
        if (err.code !== 'ENOENT') {
            console.error('[KnowledgeStore] Error reading store', err);
        }
        return '';
    }
}

export async function learnFromDocument(
    templateId: string,
    extractedFields: Record<string, any>
) {
    if (!templateId || templateId === 'generic') return;

    try {
        await ensureStoreDirs();
        let store: KnowledgeStoreData = { templates: {} };

        try {
            const fileData = await fs.readFile(STORE_PATH, 'utf-8');
            store = JSON.parse(fileData);
        } catch (err: any) {
            if (err.code !== 'ENOENT') throw err;
            // File doesn't exist yet, which is fine
        }

        const keys = Object.keys(extractedFields).filter(k => extractedFields[k] !== null);
        const fieldCount = keys.length;

        if (!store.templates[templateId]) {
            store.templates[templateId] = {
                documentCount: 1,
                avgFieldCount: fieldCount,
                commonFields: keys,
                lastLearned: new Date().toISOString()
            };
        } else {
            const t = store.templates[templateId];

            // Rolling average of field count
            t.avgFieldCount = ((t.avgFieldCount * t.documentCount) + fieldCount) / (t.documentCount + 1);

            // Intersection of old common fields and new fields to find the truly "common/required" core fields over time
            // Or union if we just want to track seen fields, but intersection is better for strict structure matching
            t.commonFields = Array.from(new Set([...t.commonFields, ...keys]));

            t.documentCount += 1;
            t.lastLearned = new Date().toISOString();
        }

        await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
        console.log(`[KnowledgeStore] Learned structural schema for ${templateId}`);
    } catch (err) {
        console.error('[KnowledgeStore] Failed to update knowledge base', err);
    }
}
