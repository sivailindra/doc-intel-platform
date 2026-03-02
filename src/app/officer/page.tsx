'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, XCircle, FileText } from 'lucide-react';

interface QueueItem {
    id: string;
    date: string;
    filename: string;
    template_id: string;
    template_name: string;
    department: string;
    extracted_fields: Record<string, string | null>;
    confidence_scores: Record<string, number>;
    overall_confidence: number;
    authenticity_verified: boolean;
    flags: string[];
    status: string;
}

export default function OfficerDashboard() {
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);

    useEffect(() => {
        // Load queue on client side
        const qStr = localStorage.getItem('officerQueue');
        if (qStr) {
            const q = JSON.parse(qStr);
            // For demo purposes, we sort to bring flagged items to top
            q.sort((a: QueueItem) => (a.status === 'flagged' ? -1 : 1));
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setQueue(q);
            if (q.length > 0) setSelectedItem(q[0]);
        } else {
            // seed mock data if none exists
            const mock: QueueItem[] = [
                {
                    id: 'mock-1',
                    date: new Date().toISOString(),
                    filename: 'DL_Application_Tampered.pdf',
                    template_id: 'dl_app',
                    template_name: 'Driving License Application',
                    department: 'Parivahan',
                    extracted_fields: { name: 'Sanjiv Kumar', vehicle_class: 'LMV' },
                    confidence_scores: { name: 94, vehicle_class: 82 },
                    overall_confidence: 65,
                    authenticity_verified: false,
                    flags: ["Signature mismatch detected", "Suspected digitally altered photo"],
                    status: 'flagged'
                }
            ];
            setQueue(mock);
            setSelectedItem(mock[0]);
        }
    }, []);

    const handleAction = (id: string, action: 'approve' | 'reject') => {
        const updated = queue.filter(item => item.id !== id);
        setQueue(updated);
        localStorage.setItem('officerQueue', JSON.stringify(updated));
        setSelectedItem(updated.length > 0 ? updated[0] : null);

        // In a real app, this would hit a PUT/POST endpoint to update DB
        alert(`Document ${action}d successfully. Audit trail generated.`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--color-base)' }}>
            <nav className="navbar" style={{ flexShrink: 0 }}>
                <div className="brand-logo">
                    <ShieldCheck size={28} />
                    Verification Center
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/" className="btn btn-secondary">
                        Switch to Agent View
                    </Link>
                    <div className="badge badge-warning" style={{ alignSelf: 'center' }}>Officer Account</div>
                </div>
            </nav>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Sidebar */}
                <div style={{ width: '350px', borderRight: '1px solid var(--color-border)', background: 'rgba(15, 23, 42, 0.95)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                        <h2 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)' }}>Review Queue ({queue.length})</h2>
                    </div>
                    <div style={{ overflowY: 'auto', flex: 1, padding: '1rem' }}>
                        {queue.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: '2rem' }}>Queue is empty.</p>
                        ) : (
                            queue.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedItem(item)}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: 'var(--radius-md)',
                                        marginBottom: '0.75rem',
                                        cursor: 'pointer',
                                        background: selectedItem?.id === item.id ? 'var(--color-surface-hover)' : 'var(--color-surface)',
                                        border: `1px solid ${selectedItem?.id === item.id ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                                        transition: 'var(--transition-fast)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>{item.filename}</span>
                                        <span className={`badge ${item.authenticity_verified ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.65rem' }}>
                                            {item.authenticity_verified ? 'Auto-Pass' : 'Flagged'}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                        {item.template_name}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                                        Confidence: <span style={{ fontWeight: 600, color: item.overall_confidence > 80 ? 'var(--color-success)' : 'var(--color-danger)' }}>{item.overall_confidence}%</span> &bull; {new Date(item.date).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Review Panel */}
                <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                    {selectedItem ? (
                        <div className="glass-panel" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                                <div>
                                    <h1 style={{ color: 'var(--color-text-primary)' }}>Document Review</h1>
                                    <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                                        Record ID: <span style={{ fontFamily: 'monospace' }}>{selectedItem.id}</span> &bull; Processed at {new Date(selectedItem.date).toLocaleString()}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button className="btn btn-danger" onClick={() => handleAction(selectedItem.id, 'reject')}>
                                        <XCircle size={18} /> Reject
                                    </button>
                                    <button className="btn btn-success" onClick={() => handleAction(selectedItem.id, 'approve')}>
                                        <ShieldCheck size={18} /> Approve Exception
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
                                {/* Left side Data view */}
                                <div>
                                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Extracted Data</h3>
                                    <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap' }}>
                                        {JSON.stringify(selectedItem.extracted_fields, null, 2)}
                                    </div>

                                    <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>AI Confidence Matrix</h3>
                                    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                                        {Object.entries(selectedItem.confidence_scores || {}).map(([key, val]) => (
                                            <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.85rem' }}>
                                                <div style={{ width: '45%', fontSize: '0.85rem', color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</div>
                                                <div style={{ width: '45%', background: 'rgba(255,255,255,0.05)', height: '6px', borderRadius: '3px', overflow: 'hidden', marginRight: '1rem' }}>
                                                    <div style={{ width: `${val}%`, height: '100%', background: (val as number) > 85 ? 'var(--color-success)' : 'var(--color-warning)' }}></div>
                                                </div>
                                                <div style={{ width: '10%', textAlign: 'right', fontSize: '0.85rem', fontWeight: 600, color: (val as number) > 85 ? 'var(--color-success)' : 'var(--color-warning)' }}>{val as React.ReactNode}%</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right side Metadata & Flags */}
                                <div>
                                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Verification Details</h3>
                                    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Template Matched</span>
                                            <div style={{ fontWeight: 500, color: 'var(--color-text-primary)', marginTop: '0.25rem' }}>{selectedItem.template_name}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--color-brand-accent)' }}>Dept: {selectedItem.department}</div>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Confidence</span>
                                            <div style={{ fontWeight: 600, fontSize: '1.5rem', color: selectedItem.overall_confidence > 80 ? 'var(--color-success)' : 'var(--color-danger)', marginTop: '0.25rem' }}>
                                                {selectedItem.overall_confidence}%
                                            </div>
                                        </div>
                                    </div>

                                    {selectedItem.flags && selectedItem.flags.length > 0 && (
                                        <div style={{ marginTop: '2rem' }}>
                                            <h3 style={{ marginBottom: '1rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <XCircle size={18} />
                                                Security Flags Triggered
                                            </h3>
                                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                                                <ul style={{ paddingLeft: '1.25rem', color: '#fca5a5', fontWeight: 500, margin: 0 }}>
                                                    {selectedItem.flags.map((flag: string, i: number) => (
                                                        <li key={i} style={{ marginBottom: '0.75rem' }}>{flag}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                <FileText size={48} style={{ margin: '0 auto 1.5rem auto', opacity: 0.5 }} />
                                <p style={{ fontSize: '1.1rem' }}>Select a document from the queue to start reviewing.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
