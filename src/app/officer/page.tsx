'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function OfficerDashboard() {
    const [queue, setQueue] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);

    useEffect(() => {
        // Load queue on client side
        const qStr = localStorage.getItem('officerQueue');
        if (qStr) {
            const q = JSON.parse(qStr);
            // For demo purposes, we sort to bring flagged items to top
            q.sort((a: any, b: any) => (a.status === 'flagged' ? -1 : 1));
            setQueue(q);
            if (q.length > 0) setSelectedItem(q[0]);
        } else {
            // seed mock data if none exists
            const mock = [
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
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            <nav className="navbar" style={{ flexShrink: 0 }}>
                <div className="brand-logo">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    Verification Center
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/" className="btn btn-secondary">
                        Switch to Agent Mode
                    </Link>
                    <div className="badge badge-warning" style={{ alignSelf: 'center' }}>Officer Account</div>
                </div>
            </nav>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Sidebar */}
                <div style={{ width: '350px', borderRight: '1px solid var(--color-neutral-200)', background: 'white', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-neutral-200)' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>Review Queue ({queue.length})</h2>
                    </div>
                    <div style={{ overflowY: 'auto', flex: 1, padding: '1rem' }}>
                        {queue.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--color-neutral-700)', marginTop: '2rem' }}>Queue is empty.</p>
                        ) : (
                            queue.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedItem(item)}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: '0.5rem',
                                        marginBottom: '0.5rem',
                                        cursor: 'pointer',
                                        background: selectedItem?.id === item.id ? 'var(--color-neutral-50)' : 'transparent',
                                        border: `1px solid ${selectedItem?.id === item.id ? 'var(--color-brand-secondary)' : 'var(--color-neutral-200)'}`,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.filename}</span>
                                        <span className={`badge ${item.authenticity_verified ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.65rem' }}>
                                            {item.authenticity_verified ? 'Auto-Pass' : 'Flagged'}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-700)' }}>
                                        {item.template_name}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-700)', marginTop: '0.5rem' }}>
                                        Score: <span style={{ fontWeight: 600, color: item.overall_confidence > 80 ? 'var(--color-success)' : 'var(--color-danger)' }}>{item.overall_confidence}%</span> &bull; {new Date(item.date).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Review Panel */}
                <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', background: 'var(--color-neutral-50)' }}>
                    {selectedItem ? (
                        <div className="glass-card" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--color-neutral-200)', paddingBottom: '1rem' }}>
                                <div>
                                    <h1>Document Review</h1>
                                    <p style={{ color: 'var(--color-neutral-700)', marginTop: '0.5rem' }}>
                                        ID: {selectedItem.id} &bull; Received at {new Date(selectedItem.date).toLocaleString()}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button className="btn btn-danger" onClick={() => handleAction(selectedItem.id, 'reject')}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        Reject Flag
                                    </button>
                                    <button className="btn btn-success" onClick={() => handleAction(selectedItem.id, 'approve')}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        Approve Exception
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                {/* Left side Data view */}
                                <div>
                                    <h3 style={{ marginBottom: '1rem' }}>Extracted Data</h3>
                                    <div style={{ background: 'white', border: '1px solid var(--color-neutral-200)', borderRadius: '0.5rem', padding: '1rem', fontFamily: 'monospace', fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
                                        {JSON.stringify(selectedItem.extracted_fields, null, 2)}
                                    </div>

                                    <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>AI Confidence Scores</h3>
                                    <div style={{ background: 'white', border: '1px solid var(--color-neutral-200)', borderRadius: '0.5rem', padding: '1rem' }}>
                                        {Object.entries(selectedItem.confidence_scores).map(([key, val]) => (
                                            <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                <div style={{ width: '40%', fontSize: '0.875rem' }}>{key}</div>
                                                <div style={{ width: '50%', background: 'var(--color-neutral-200)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${val}%`, height: '100%', background: (val as number) > 90 ? 'var(--color-success)' : 'var(--color-warning)' }}></div>
                                                </div>
                                                <div style={{ width: '10%', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600 }}>{val as React.ReactNode}%</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right side Metadata & Flags */}
                                <div>
                                    <h3 style={{ marginBottom: '1rem' }}>Verification Details</h3>
                                    <div style={{ background: 'white', border: '1px solid var(--color-neutral-200)', borderRadius: '0.5rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--color-neutral-700)', textTransform: 'uppercase' }}>Template Matched</span>
                                            <div style={{ fontWeight: 500 }}>{selectedItem.template_name} ({selectedItem.department})</div>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--color-neutral-700)', textTransform: 'uppercase' }}>Overall Confidence</span>
                                            <div style={{ fontWeight: 600, fontSize: '1.25rem', color: selectedItem.overall_confidence > 80 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                                {selectedItem.overall_confidence}%
                                            </div>
                                        </div>
                                    </div>

                                    {selectedItem.flags && selectedItem.flags.length > 0 && (
                                        <div style={{ marginTop: '2rem' }}>
                                            <h3 style={{ marginBottom: '1rem', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                                Security Flags
                                            </h3>
                                            <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '0.5rem', padding: '1rem' }}>
                                                <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-danger)', fontWeight: 500, margin: 0 }}>
                                                    {selectedItem.flags.map((flag: string, i: number) => (
                                                        <li key={i} style={{ marginBottom: '0.5rem' }}>{flag}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* Tamper overlay mock */}
                                    <div style={{ marginTop: '2rem' }}>
                                        <h3 style={{ marginBottom: '1rem' }}>Original Scan</h3>
                                        <div style={{ position: 'relative', background: '#e2e8f0', borderRadius: '0.5rem', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            <div style={{ color: 'var(--color-neutral-700)' }}>Document Preview Redacted</div>
                                            {selectedItem.flags && selectedItem.flags.length > 0 && (
                                                <div style={{ position: 'absolute', top: '20px', right: '40px', border: '3px dashed var(--color-danger)', width: '100px', height: '50px', background: 'rgba(239, 68, 68, 0.1)', animation: 'pulse 2s infinite' }}></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <div style={{ textAlign: 'center', color: 'var(--color-neutral-700)' }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem auto' }}>
                                    <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                </svg>
                                <p>Select a document from the queue to start reviewing.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
