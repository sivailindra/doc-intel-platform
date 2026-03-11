'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ShieldCheck, XCircle, FileText, Search, BrainCircuit,
    Clock, CheckCircle2, AlertCircle, ChevronRight,
    TrendingUp, Inbox, Eye, ArrowLeft, BarChart3, Star,
} from 'lucide-react';

interface QueueItem {
    id: string;
    date: string;
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

type FilterType = 'all' | 'flagged' | 'clean';

const MOCK_QUEUE: QueueItem[] = [
    {
        id: 'mock-001', date: new Date().toISOString(),
        filename: 'DL_Application_Tampered.pdf',
        template_name: 'Driving License', department: 'Parivahan',
        extracted_fields: { name: 'Sanjiv Kumar', vehicle_class: 'LMV', dob: '1985-03-12', address: 'Delhi, 110001', dl_number: 'DL-20-2024-0012345' },
        confidence_scores: { name: 94, vehicle_class: 82, dob: 71, address: 68, dl_number: 55 },
        overall_confidence: 65, authenticity_verified: false,
        flags: ['Signature mismatch detected', 'Suspected digitally altered photo', 'Low DL number confidence'],
        status: 'flagged',
    },
    {
        id: 'mock-002', date: new Date(Date.now() - 3600000).toISOString(),
        filename: 'Passport_Scan_Clean.jpg',
        template_name: 'Indian Passport', department: 'Immigration',
        extracted_fields: { full_name: 'Meera Iyer', passport_no: 'Z9012345', nationality: 'Indian', dob: '1991-07-22', expiry: '2031-07-21' },
        confidence_scores: { full_name: 98, passport_no: 99, nationality: 97, dob: 96, expiry: 98 },
        overall_confidence: 97, authenticity_verified: true, flags: [], status: 'clean',
    },
    {
        id: 'mock-003', date: new Date(Date.now() - 7200000).toISOString(),
        filename: 'GST_Invoice_Q4_2025.pdf',
        template_name: 'GST Invoice', department: 'Finance',
        extracted_fields: { vendor: 'TechCorp Pvt Ltd', invoice_no: 'INV-2025-004421', amount: '₹1,24,500', gst_no: '27AABCT1234A1Z5', date: '2025-12-15' },
        confidence_scores: { vendor: 92, invoice_no: 95, amount: 93, gst_no: 88, date: 97 },
        overall_confidence: 93, authenticity_verified: true, flags: [], status: 'clean',
    },
    {
        id: 'mock-004', date: new Date(Date.now() - 14400000).toISOString(),
        filename: 'Aadhaar_Card_Verify.jpg',
        template_name: 'Aadhaar Card', department: 'UIDAI',
        extracted_fields: { name: 'Rahul Verma', uid: '4321 5678 9012', dob: '1993-11-05', address: 'Mumbai, 400001', gender: 'Male' },
        confidence_scores: { name: 96, uid: 99, dob: 94, address: 87, gender: 99 },
        overall_confidence: 95, authenticity_verified: true, flags: [], status: 'clean',
    },
    {
        id: 'mock-005', date: new Date(Date.now() - 18000000).toISOString(),
        filename: 'Income_Certificate_Suspect.pdf',
        template_name: 'Income Certificate', department: 'Revenue',
        extracted_fields: { name: 'Unknown User', annual_income: '₹8,40,000', issuing_authority: 'Tehsildar, Kolkata', issue_date: '2025-01-01' },
        confidence_scores: { name: 58, annual_income: 72, issuing_authority: 61, issue_date: 80 },
        overall_confidence: 68, authenticity_verified: false,
        flags: ['Issuing authority seal missing', 'Name confidence critically low'],
        status: 'flagged',
    },
];

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

export default function OfficerDashboard() {
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [selected, setSelected] = useState<QueueItem | null>(null);
    const [filter, setFilter] = useState<FilterType>('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const raw = localStorage.getItem('officerQueue');
        const stored: QueueItem[] = raw ? JSON.parse(raw) : [];
        const all = [...MOCK_QUEUE, ...stored.filter(s => !MOCK_QUEUE.some(m => m.id === s.id))];
        all.sort(a => (a.authenticity_verified === false ? -1 : 1));
        setQueue(all);
        setSelected(all[0] || null);
    }, []);

    const filtered = queue.filter(item => {
        const matchSearch = search === '' ||
            item.filename.toLowerCase().includes(search.toLowerCase()) ||
            item.template_name.toLowerCase().includes(search.toLowerCase());
        const matchFilter =
            filter === 'flagged' ? !item.authenticity_verified :
                filter === 'clean' ? item.authenticity_verified : true;
        return matchSearch && matchFilter;
    });

    const handleAction = (id: string) => {
        const next = queue.filter(i => i.id !== id);
        setQueue(next);
        localStorage.setItem('officerQueue', JSON.stringify(next.filter(i => !MOCK_QUEUE.some(m => m.id === i.id))));
        setSelected(next[0] || null);
    };

    const flaggedCount = queue.filter(i => !i.authenticity_verified).length;
    const cleanCount = queue.filter(i => i.authenticity_verified).length;
    const avgConf = queue.length ? Math.round(queue.reduce((s, i) => s + i.overall_confidence, 0) / queue.length) : 0;

    const FILTERS: { key: FilterType; label: string; count: number }[] = [
        { key: 'all', label: 'All', count: queue.length },
        { key: 'flagged', label: 'Flagged', count: flaggedCount },
        { key: 'clean', label: 'Verified', count: cleanCount },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--color-base)', fontFamily: 'var(--font-sans)' }}>

            {/* ─── Top bar ─── */}
            <nav style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 2rem', height: 56, flexShrink: 0,
                background: 'var(--color-dark)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,var(--color-brand-accent),var(--color-brand-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldCheck size={16} color="white" />
                    </div>
                    <span style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
                        DocIntel <span style={{ color: 'var(--color-brand-accent)' }}>Officer Portal</span>
                    </span>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', background: 'rgba(220,38,38,0.18)', border: '1px solid rgba(220,38,38,0.3)', color: '#fca5a5', fontSize: '0.7rem', fontWeight: 700 }}>
                        SECURE
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
                        {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', padding: '0.35rem 0.8rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.15s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'white'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    >
                        <ArrowLeft size={13} /> Back to Platform
                    </Link>
                </div>
            </nav>

            {/* ─── Stats strip ─── */}
            <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', display: 'flex', flexShrink: 0 }}>
                {[
                    { icon: Inbox, label: 'In Queue', value: queue.length, color: '#6366f1' },
                    { icon: AlertCircle, label: 'Needs Review', value: flaggedCount, color: '#dc2626' },
                    { icon: CheckCircle2, label: 'Verified', value: cleanCount, color: '#16a34a' },
                    { icon: BarChart3, label: 'Avg Confidence', value: `${avgConf}%`, color: '#d97706' },
                ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', borderRight: '1px solid var(--color-border)' }}>
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: `${color}12`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon size={15} color={color} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1, fontFamily: 'var(--font-display)' }}>{value}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.15rem', fontWeight: 500 }}>{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ─── Body ─── */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* ─ Sidebar ─ */}
                <aside style={{ width: 320, background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                    <div style={{ padding: '1rem 1rem 0.75rem', borderBottom: '1px solid var(--color-border)' }}>
                        {/* Search */}
                        <div style={{ position: 'relative', marginBottom: '0.65rem' }}>
                            <Search size={13} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                            <input
                                type="text" placeholder="Search queue…" value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{
                                    width: '100%', padding: '0.5rem 0.75rem 0.5rem 2rem',
                                    background: 'var(--color-base)', border: '1px solid var(--color-border)',
                                    borderRadius: '999px', fontSize: '0.82rem', outline: 'none',
                                    color: 'var(--color-text-primary)', fontFamily: 'inherit',
                                    transition: 'border-color 0.15s',
                                }}
                                onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--color-brand-primary)'}
                                onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--color-border)'}
                            />
                        </div>
                        {/* Filter tabs */}
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                            {FILTERS.map(({ key, label, count }) => (
                                <button key={key} onClick={() => setFilter(key)} style={{
                                    flex: 1, padding: '0.3rem 0', fontSize: '0.75rem', fontWeight: 600,
                                    borderRadius: '999px', border: '1px solid',
                                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                                    background: filter === key ? 'var(--color-dark)' : 'transparent',
                                    borderColor: filter === key ? 'var(--color-dark)' : 'var(--color-border)',
                                    color: filter === key ? 'white' : 'var(--color-text-muted)',
                                }}>
                                    {label} <span style={{ opacity: 0.7 }}>({count})</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Queue list */}
                    <div style={{ overflowY: 'auto', flex: 1, padding: '0.5rem' }}>
                        {filtered.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '3rem', fontSize: '0.875rem' }}>
                                <Inbox size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} /><br />No documents found.
                            </div>
                        ) : filtered.map(item => {
                            const isSelected = selected?.id === item.id;
                            const isFlagged = !item.authenticity_verified;
                            return (
                                <div key={item.id} onClick={() => setSelected(item)} style={{
                                    padding: '0.85rem 0.9rem', borderRadius: '10px', marginBottom: '0.35rem',
                                    cursor: 'pointer', transition: 'all 0.15s',
                                    background: isSelected ? 'rgba(224,79,42,0.07)' : 'transparent',
                                    border: `1px solid ${isSelected ? 'rgba(224,79,42,0.22)' : 'transparent'}`,
                                    display: 'flex', alignItems: 'center', gap: '0.7rem',
                                }}
                                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--color-base)'; }}
                                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                                >
                                    {/* Doc icon */}
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                                        background: isFlagged ? 'rgba(220,38,38,0.08)' : 'rgba(22,163,74,0.08)',
                                        border: `1px solid ${isFlagged ? 'rgba(220,38,38,0.18)' : 'rgba(22,163,74,0.18)'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <FileText size={15} color={isFlagged ? '#dc2626' : '#16a34a'} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.81rem', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.filename}</div>
                                        <div style={{ fontSize: '0.71rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>{item.template_name}</div>
                                        <div style={{ fontSize: '0.7rem', marginTop: '0.2rem', fontWeight: 700, color: item.overall_confidence > 80 ? '#16a34a' : '#dc2626' }}>
                                            {item.overall_confidence}% conf.
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', flexShrink: 0 }}>
                                        {isFlagged
                                            ? <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(220,38,38,0.1)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)' }}>FLAGGED</span>
                                            : <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(22,163,74,0.1)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.2)' }}>CLEAN</span>
                                        }
                                        <ChevronRight size={12} color="var(--color-text-muted)" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* ─ Main review panel ─ */}
                <main style={{ flex: 1, overflowY: 'auto', background: 'var(--color-base-alt)', padding: '1.75rem 2rem' }}>
                    {selected ? (
                        <div style={{ maxWidth: 900, margin: '0 auto', animation: 'fadeInUp 0.3s ease' }}>

                            {/* Document header */}
                            <div style={{
                                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                                borderRadius: 16, padding: '1.5rem 2rem', marginBottom: '1.25rem',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap',
                                boxShadow: 'var(--shadow-sm)',
                            }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 10, background: selected.authenticity_verified ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)', border: `1px solid ${selected.authenticity_verified ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FileText size={18} color={selected.authenticity_verified ? '#16a34a' : '#dc2626'} />
                                        </div>
                                        <h1 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>{selected.filename}</h1>
                                        {selected.authenticity_verified
                                            ? <span className="badge badge-success"><CheckCircle2 size={10} /> Verified</span>
                                            : <span className="badge badge-danger"><AlertCircle size={10} /> Flagged</span>
                                        }
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                        <code style={{ background: 'rgba(0,0,0,0.05)', padding: '0.1rem 0.4rem', borderRadius: 4, fontSize: '0.75rem' }}>{selected.id}</code>
                                        {' · '}{selected.template_name}{' · '}{selected.department}
                                        {' · '}{new Date(selected.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.65rem', flexShrink: 0 }}>
                                    <button onClick={() => handleAction(selected.id)} className="btn btn-danger">
                                        <XCircle size={15} /> Reject
                                    </button>
                                    <button onClick={() => handleAction(selected.id)} className="btn btn-success">
                                        <ShieldCheck size={15} /> Approve
                                    </button>
                                </div>
                            </div>

                            {/* Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.25rem' }}>

                                {/* Extracted fields */}
                                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Extracted Fields</h3>
                                        <span className="badge badge-info">{Object.keys(selected.extracted_fields).length} fields</span>
                                    </div>
                                    <div style={{ background: 'var(--color-base)', border: '1px solid var(--color-border)', borderRadius: 10, overflow: 'hidden' }}>
                                        {Object.entries(selected.extracted_fields).map(([key, val], i) => {
                                            const conf = selected.confidence_scores?.[key];
                                            return (
                                                <div key={key} className="data-row" style={{ borderBottom: i < Object.keys(selected.extracted_fields).length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                                                    <span className="data-label" style={{ textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                                                    <span className="data-value">
                                                        {val || <em style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.8rem' }}>—</em>}
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

                                {/* Right column */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                                    {/* Confidence ring */}
                                    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: '1.5rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                                        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Overall Confidence</div>
                                        <ConfidenceRing value={selected.overall_confidence} />
                                    </div>

                                    {/* Field confidence bars */}
                                    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>Field Confidence</h3>
                                        {Object.entries(selected.confidence_scores || {}).map(([key, val]) => (
                                            <div key={key} style={{ marginBottom: '0.7rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: (val as number) > 85 ? '#16a34a' : '#d97706' }}>{val}%</span>
                                                </div>
                                                <div style={{ height: 5, background: 'var(--color-base)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                                                    <div style={{ width: `${val}%`, height: '100%', borderRadius: 3, background: (val as number) > 85 ? '#16a34a' : '#d97706', transition: 'width 0.7s ease' }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Security flags or clean */}
                                    {selected.flags?.length > 0 ? (
                                        <div style={{ background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.18)', borderRadius: 16, padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                                            <h3 style={{ color: '#dc2626', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
                                                <XCircle size={15} /> Security Flags
                                            </h3>
                                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {selected.flags.map((f, i) => (
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
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '1rem', color: 'var(--color-text-muted)' }}>
                            <Eye size={48} style={{ opacity: 0.25 }} />
                            <p style={{ fontSize: '0.95rem' }}>Select a document from the queue to begin review.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
