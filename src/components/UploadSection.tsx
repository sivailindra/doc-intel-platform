'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    FileUp, ShieldCheck, XCircle, FileText, BrainCircuit,
    ScanLine, Cpu, CheckCircle2, FlaskConical, RefreshCw,
} from 'lucide-react';
import { sharedFileStore } from '@/lib/fileStore';

/* ── Processing steps config ── */
const STEPS = [
    {
        key: 'digitizing',
        label: 'Digitizing',
        detail: 'Converting document to machine-readable format via OCR',
        icon: ScanLine,
        durationMs: 1400,
    },
    {
        key: 'classifying',
        label: 'Classifying',
        detail: 'Detecting document type and structural template',
        icon: Cpu,
        durationMs: 1000,
    },
    {
        key: 'extracting',
        label: 'Extracting',
        detail: 'Running Gemini AI to isolate all data fields',
        icon: BrainCircuit,
        durationMs: 2200,
    },
    {
        key: 'extracting',
        label: 'Extracting',
        detail: 'Running Gemini AI to isolate all data fields',
        icon: BrainCircuit,
        durationMs: 2200,
    },
];

type StepStatus = 'pending' | 'active' | 'done';

interface StepState {
    status: StepStatus;
    progress: number; // 0-100
}

interface ExtractionResult {
    id: string;
    filename: string;
    template_name: string;
    department: string;
    extracted_fields: Record<string, string | null>;
    confidence_scores: Record<string, number>;
    overall_confidence: number;
    authenticity_verified: boolean;
    flags: string[];
    status: string;
}

function ConfidenceRing({ value }: { value: number }) {
    const r = 38;
    const circ = 2 * Math.PI * r;
    const filled = (value / 100) * circ;
    const color = value >= 85 ? '#16a34a' : value >= 70 ? '#d97706' : '#dc2626';
    return (
        <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto' }}>
            <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="8" />
                <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
                    strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.8s ease' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color, lineHeight: 1, fontFamily: 'var(--font-display)' }}>{value}%</span>
                <span style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>confidence</span>
            </div>
        </div>
    );
}

export function UploadSection() {
    const [isDragging, setIsDragging] = useState(false);
    const router = useRouter();

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragging(e.type === 'dragenter' || e.type === 'dragover');
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) {
            sharedFileStore.file = e.dataTransfer.files[0];
            router.push('/analyze');
        }
    }, [router]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            sharedFileStore.file = e.target.files[0];
            router.push('/analyze');
        }
    };

    return (
        <section className="section" id="upload" style={{ background: 'var(--color-base-alt)' }}>
            <div className="container">
                <div style={{ maxWidth: '860px', margin: '0 auto' }}>

                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <span className="label-tag" style={{ display: 'inline-flex', marginBottom: '1rem' }}>Live Demo</span>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', marginTop: '1rem' }}>
                            Try It Now —{' '}
                            <span className="text-gradient">Upload Any Document</span>
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.75rem' }}>
                            Drag and drop a PDF or image. Watch AI process it step-by-step in real time.
                        </p>
                    </div>

                    <div className="glass-panel" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', backdropFilter: 'none' }}>
                        <div
                            className={`upload-zone ${isDragging ? 'active' : ''}`}
                            onDragEnter={handleDrag} onDragLeave={handleDrag}
                            onDragOver={handleDrag} onDrop={handleDrop}
                            onClick={() => document.getElementById('file-upload')?.click()}
                        >
                            <input
                                id="file-upload" type="file" accept="image/*,application/pdf"
                                style={{ display: 'none' }}
                                onChange={handleFileSelect}
                            />
                            <div className="upload-icon-wrapper animate-float"><FileUp size={32} /></div>
                            <div>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.45rem' }}>
                                    Select or Drop Your Document
                                </h3>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                                    PDF, JPG, PNG — up to 20 MB
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
