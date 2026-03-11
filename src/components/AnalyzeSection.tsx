'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import {
    FileUp, ShieldCheck, XCircle, FileText, BrainCircuit,
    ScanLine, Cpu, CheckCircle2, FlaskConical, RefreshCw,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
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
        key: 'validating',
        label: 'Validating',
        detail: 'Cross-checking fields and scoring confidence',
        icon: FlaskConical,
        durationMs: 900,
    },
    {
        key: 'committing',
        label: 'Committing',
        detail: 'Writing to audit trail and officer queue',
        icon: CheckCircle2,
        durationMs: 600,
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

export function AnalyzeSection() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [stepStates, setStepStates] = useState<StepState[]>(
        STEPS.map(() => ({ status: 'pending', progress: 0 }))
    );
    const [result, setResult] = useState<ExtractionResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const abortRef = useRef(false);

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragging(e.type === 'dragenter' || e.type === 'dragover');
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
    }, []);

    /** Animate step i to completion over its durationMs then resolve */
    const animateStep = (index: number, durationMs: number): Promise<void> =>
        new Promise(resolve => {
            const start = performance.now();
            const tick = (now: number) => {
                if (abortRef.current) return resolve();
                const pct = Math.min(100, ((now - start) / durationMs) * 100);
                setStepStates(prev => prev.map((s, i) => i === index ? { status: 'active', progress: pct } : s));
                if (pct < 100) requestAnimationFrame(tick);
                else {
                    setStepStates(prev => prev.map((s, i) => i === index ? { status: 'done', progress: 100 } : s));
                    setTimeout(resolve, 120);
                }
            };
            requestAnimationFrame(tick);
        });

    const handleProcess = async (processFile?: File | React.MouseEvent) => {
        const targetFile = processFile instanceof File ? processFile : file;
        if (!targetFile) return;
        setIsProcessing(true);
        setResult(null);
        abortRef.current = false;
        setStepStates(STEPS.map(() => ({ status: 'pending', progress: 0 })));

        const formData = new FormData();
        formData.append('file', targetFile);
        formData.append('route', '/analyze'); // Optional tag for analytics

        // Kick off API call in parallel with animation
        const apiPromise = fetch('/api/upload', { method: 'POST', body: formData })
            .then(r => r.json()).catch(() => ({ success: false, error: 'Network error' }));

        // Run visual steps — first 4 animate during API call, last one after
        await animateStep(0, STEPS[0].durationMs);
        await animateStep(1, STEPS[1].durationMs);
        await animateStep(2, STEPS[2].durationMs);
        await animateStep(3, STEPS[3].durationMs);

        // Wait for API now (usually done by this point)
        const data = await apiPromise;

        await animateStep(4, STEPS[4].durationMs);

        setIsProcessing(false);

        if (data.success) {
            setResult(data.data);
            const q = JSON.parse(localStorage.getItem('officerQueue') || '[]');
            q.push({ id: data.data.id || Date.now().toString(), date: new Date().toISOString(), ...data.data });
            localStorage.setItem('officerQueue', JSON.stringify(q));
        } else {
            setError(data.error || 'Extraction failed. Please try again.');
        }
    };

    const reset = () => {
        abortRef.current = true;
        setFile(null);
        setResult(null);
        setError(null);
        setIsProcessing(false);
        setStepStates(STEPS.map(() => ({ status: 'pending', progress: 0 })));
    };

    useEffect(() => {
        if (sharedFileStore.file) {
            const f = sharedFileStore.file;
            setFile(f);
            sharedFileStore.file = null;
            setTimeout(() => handleProcess(f), 300);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section className="section" id="analyze" style={{ background: 'var(--color-base-alt)', minHeight: '80vh', paddingTop: '8rem' }}>
            <div className="container">
                <div style={{ maxWidth: result && !isProcessing ? '1060px' : '860px', margin: '0 auto', transition: 'max-width 0.4s ease' }}>

                    {/* ── Upload idle ── */}
                    {!isProcessing && !result && (
                        <>
                            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <Link href="/" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: 'none', background: 'var(--color-surface)', padding: '0.5rem 1rem' }}>
                                        <ArrowLeft size={16} /> Back to Home
                                    </Link>
                                </div>
                                <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '0', fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.02em' }}>
                                    Document <span className="text-gradient">Analysis</span>
                                </h1>
                                <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.75rem', fontSize: '1.1rem' }}>
                                    Upload a document to extract data, verify authenticity, and identify fraud.
                                </p>
                            </div>

                            {/* Inline error banner */}
                            {error && (
                                <div style={{
                                    marginBottom: '1.25rem', padding: '1rem 1.25rem',
                                    background: error.includes('GEMINI_API_KEY') ? 'rgba(99,102,241,0.05)' : 'rgba(220,38,38,0.05)',
                                    border: `1px solid ${error.includes('GEMINI_API_KEY') ? 'rgba(99,102,241,0.25)' : 'rgba(220,38,38,0.2)'}`,
                                    borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                                    animation: 'fadeInUp 0.25s ease',
                                }}>
                                    <XCircle size={18} color={error.includes('GEMINI_API_KEY') ? '#6366f1' : '#dc2626'} style={{ flexShrink: 0, marginTop: 1 }} />
                                    <div style={{ flex: 1 }}>
                                        {error.includes('GEMINI_API_KEY') ? (
                                            <>
                                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#4338ca', marginBottom: '0.35rem' }}>
                                                    🔑 Gemini API Key Required
                                                </div>
                                                <div style={{ fontSize: '0.82rem', color: '#4338ca', lineHeight: 1.6 }}>
                                                    1. Get a free key at{' '}
                                                    <a href="https://ai.google.dev" target="_blank" rel="noreferrer" style={{ fontWeight: 700, textDecoration: 'underline' }}>
                                                        ai.google.dev
                                                    </a><br />
                                                    2. Add <code style={{ background: 'rgba(99,102,241,0.1)', padding: '0 4px', borderRadius: 3 }}>GEMINI_API_KEY=your_key</code> to <code style={{ background: 'rgba(99,102,241,0.1)', padding: '0 4px', borderRadius: 3 }}>.env.local</code><br />
                                                    3. Restart the dev server (Ctrl+C then <code style={{ background: 'rgba(99,102,241,0.1)', padding: '0 4px', borderRadius: 3 }}>npm run dev</code>)
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#991b1b', marginBottom: '0.2rem' }}>Extraction failed</div>
                                                <div style={{ fontSize: '0.82rem', color: '#b91c1c' }}>{error}</div>
                                            </>
                                        )}
                                    </div>
                                    <button onClick={() => setError(null)} style={{ color: error.includes('GEMINI_API_KEY') ? '#6366f1' : '#dc2626', lineHeight: 1, flexShrink: 0 }}>✕</button>
                                </div>
                            )}

                            <div className="glass-panel" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', backdropFilter: 'none' }}>
                                <div
                                    className={`upload-zone ${isDragging ? 'active' : ''}`}
                                    onDragEnter={handleDrag} onDragLeave={handleDrag}
                                    onDragOver={handleDrag} onDrop={handleDrop}
                                    onClick={() => document.getElementById('analyze-file-upload')?.click()}
                                >
                                    <input
                                        id="analyze-file-upload" type="file" accept="image/*,application/pdf"
                                        style={{ display: 'none' }}
                                        onChange={e => { if (e.target.files?.[0]) { setFile(e.target.files[0]); setError(null); } }}
                                    />
                                    <div className="upload-icon-wrapper animate-float"><FileUp size={32} /></div>
                                    <div>
                                        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.45rem' }}>
                                            {file ? file.name : 'Select or Drop Your Document'}
                                        </h3>
                                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                                            {file
                                                ? `${(file.size / 1024 / 1024).toFixed(2)} MB · Ready to process`
                                                : 'PDF, JPG, PNG — up to 20 MB'}
                                        </p>
                                    </div>
                                    {file && (
                                        <button className="btn btn-primary btn-lg"
                                            onClick={e => { e.stopPropagation(); handleProcess(); }}>
                                            Analyze Document
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Processing with step progress ── */}
                    {isProcessing && (
                        <div className="glass-panel" style={{ animation: 'fadeInUp 0.4s ease', background: 'var(--color-surface)', border: '1px solid var(--color-border)', backdropFilter: 'none' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>

                                {/* Left: step list */}
                                <div>
                                    <h2 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>Processing Document</h2>
                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
                                        {file?.name}
                                    </p>

                                    <div className="process-step-list">
                                        {STEPS.map(({ key, label, detail, icon: Icon }, i) => {
                                            const { status, progress } = stepStates[i];
                                            return (
                                                <div key={key} className={`process-step ${status}`}>
                                                    <div className="process-step-icon">
                                                        {status === 'done'
                                                            ? <CheckCircle2 size={16} />
                                                            : status === 'active'
                                                                ? <Icon size={16} />
                                                                : <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>{String(i + 1).padStart(2, '0')}</span>
                                                        }
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{
                                                            display: 'flex', justifyContent: 'space-between',
                                                            alignItems: 'center', marginBottom: '0.25rem',
                                                        }}>
                                                            <span style={{
                                                                fontSize: '0.9rem', fontWeight: 700,
                                                                color: status === 'pending' ? 'var(--color-text-muted)'
                                                                    : status === 'active' ? 'var(--color-text-primary)'
                                                                        : '#86efac',
                                                            }}>{label}</span>
                                                            {status === 'active' && (
                                                                <span style={{ fontSize: '0.7rem', color: 'var(--color-brand-accent)', fontFamily: 'var(--font-mono)' }}>
                                                                    {Math.round(progress)}%
                                                                </span>
                                                            )}
                                                            {status === 'done' && (
                                                                <span style={{ fontSize: '0.7rem', color: '#86efac' }}>✓ Done</span>
                                                            )}
                                                        </div>
                                                        {status !== 'pending' && (
                                                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
                                                                {detail}
                                                            </p>
                                                        )}
                                                        {status === 'active' && (
                                                            <div className="process-step-bar">
                                                                <div className="process-step-bar-fill" style={{ width: `${progress}%` }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Right: animated illustration */}
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: 120, height: 120,
                                        borderRadius: '50%',
                                        background: 'rgba(224,79,42,0.08)',
                                        border: '2px solid rgba(224,79,42,0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 1.5rem',
                                        animation: 'pulseGlow 2s ease infinite',
                                        boxShadow: '0 0 0 0 rgba(224,79,42,0.4)',
                                    }}>
                                        <BrainCircuit size={52} color="var(--color-brand-accent)" style={{ animation: 'float 3s ease-in-out infinite' }} />
                                    </div>

                                    {/* Live step label */}
                                    {stepStates.map(({ status }, i) => status === 'active' && (
                                        <div key={i} style={{ animation: 'fadeInUp 0.3s ease' }}>
                                            <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                                                {STEPS[i].label}…
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                                {STEPS[i].detail}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Overall progress dots */}
                                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginTop: '2rem' }}>
                                        {STEPS.map(({ key }, i) => (
                                            <div key={key} style={{
                                                width: stepStates[i].status === 'active' ? 20 : 7,
                                                height: 7,
                                                borderRadius: 4,
                                                background: stepStates[i].status === 'done' ? 'var(--color-success)'
                                                    : stepStates[i].status === 'active' ? 'var(--color-brand-accent)'
                                                        : 'rgba(0,0,0,0.1)',
                                                transition: 'all 0.35s ease',
                                            }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Results ── */}
                    {result && !isProcessing && (
                        <div style={{ animation: 'fadeInUp 0.5s ease' }}>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem',
                            }}>
                                <button className="btn btn-secondary" onClick={reset}>← Upload Another</button>
                                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                                    <span className="badge badge-info"><FileText size={11} /> ID: {result.id.substring(0, 8)}…</span>
                                </div>
                            </div>

                            {/* Document header */}
                            <div style={{
                                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                                borderRadius: 16, padding: '1.5rem 2rem', marginBottom: '1.25rem',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap',
                                boxShadow: 'var(--shadow-sm)',
                            }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 10, background: result.authenticity_verified ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)', border: `1px solid ${result.authenticity_verified ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FileText size={18} color={result.authenticity_verified ? '#16a34a' : '#dc2626'} />
                                        </div>
                                        <h1 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>{file?.name || 'Document'}</h1>
                                        {result.authenticity_verified
                                            ? <span className="badge badge-success"><ShieldCheck size={10} /> Verified</span>
                                            : <span className="badge badge-danger"><XCircle size={10} /> Flagged</span>
                                        }
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                        <code style={{ background: 'rgba(0,0,0,0.05)', padding: '0.1rem 0.4rem', borderRadius: 4, fontSize: '0.75rem' }}>{result.id.substring(0, 8)}</code>
                                        {' · '}{result.template_name}{' · '}{result.department}
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.25rem' }}>
                                {/* Extracted fields */}
                                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Extracted Fields</h3>
                                        <span className="badge badge-info" style={{ background: 'rgba(99,102,241,0.1)', color: '#4f46e5' }}>{Object.keys(result.extracted_fields).length} FIELDS</span>
                                    </div>
                                    <div style={{ background: 'var(--color-base)', border: '1px solid var(--color-border)', borderRadius: 10, overflow: 'hidden' }}>
                                        {Object.entries(result.extracted_fields).map(([key, val], i) => {
                                            const conf = result.confidence_scores?.[key];
                                            return (
                                                <div key={key} className="data-row" style={{ borderBottom: i < Object.keys(result.extracted_fields).length - 1 ? '1px solid var(--color-border)' : 'none', padding: '0.8rem 1.25rem' }}>
                                                    <span className="data-label" style={{ textTransform: 'capitalize', color: 'var(--color-text-secondary)', width: '40%' }}>{key.replace(/_/g, ' ')}</span>
                                                    <span className="data-value" style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <strong style={{ color: 'var(--color-text-primary)' }}>
                                                            {val !== null && val !== undefined ? (
                                                                typeof val === 'object' ? JSON.stringify(val) : String(val)
                                                            ) : (
                                                                <em style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.8rem' }}>—</em>
                                                            )}
                                                        </strong>
                                                        {conf !== undefined && val && (
                                                            <span style={{
                                                                fontSize: '0.68rem', fontWeight: 700,
                                                                padding: '0.1rem 0.4rem', borderRadius: 4,
                                                                background: conf > 85 ? 'rgba(22,163,74,0.1)' : 'rgba(217,119,6,0.1)',
                                                                color: conf > 85 ? '#16a34a' : '#d97706',
                                                            }}>{conf}%</span>
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Right column: Confidence & Governance */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {/* Confidence ring */}
                                    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: '1.5rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                                        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Overall Confidence</div>
                                        <ConfidenceRing value={result.overall_confidence} />
                                    </div>

                                    {/* Field confidence bars */}
                                    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>Field Confidence</h3>
                                        <div style={{ maxHeight: 200, overflowY: 'auto', paddingRight: '0.5rem' }}>
                                            {Object.entries(result.confidence_scores || {}).map(([key, val]) => (
                                                <div key={key} style={{ marginBottom: '0.7rem' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: (val as number) > 85 ? '#16a34a' : '#d97706' }}>{val}%</span>
                                                    </div>
                                                    <div style={{ height: 5, background: 'var(--color-base)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                                                        <div style={{ width: `${val}%`, height: '100%', borderRadius: 3, background: (val as number) > 85 ? '#16a34a' : '#d97706', transition: 'width 0.7s ease' }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Security flags or clean */}
                                    {result.flags?.length > 0 ? (
                                        <div style={{ background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.18)', borderRadius: 16, padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                                            <h3 style={{ color: '#dc2626', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
                                                <XCircle size={15} /> Security Flags
                                            </h3>
                                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {result.flags.map((f, i) => (
                                                    <li key={i} style={{ fontSize: '0.81rem', color: '#991b1b', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#dc2626', flexShrink: 0, marginTop: '0.42rem' }} />
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div style={{ background: 'rgba(22,163,74,0.04)', border: '1px solid rgba(22,163,74,0.18)', borderRadius: 16, padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                                            <h3 style={{ color: '#16a34a', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
                                                <ShieldCheck size={15} /> No Security Flags
                                            </h3>
                                            <p style={{ fontSize: '0.81rem', color: 'var(--color-text-muted)', lineHeight: 1.65 }}>
                                                Document passed all AI authenticity checks. No anomalies detected.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Document Preview */}
                            {previewUrl && (
                                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: '1.5rem', boxShadow: 'var(--shadow-sm)', marginTop: '1.25rem' }}>
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Original Document</h3>
                                    <div style={{ background: 'var(--color-base)', borderRadius: 10, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400, border: '1px solid var(--color-border)' }}>
                                        {file?.type.includes('pdf') ? (
                                            <iframe src={`${previewUrl}#toolbar=0`} width="100%" height="800px" style={{ border: 'none' }} title="Document Preview" />
                                        ) : (
                                            <img src={previewUrl} alt="Document Preview" style={{ maxWidth: '100%', maxHeight: '800px', objectFit: 'contain' }} />
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
