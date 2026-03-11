'use client';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const COMPANIES = [
    { name: 'Snowflake', icon: '❄️' }, { name: 'AWS', icon: '☁️' },
    { name: 'Azure', icon: '⚡' }, { name: 'Google Cloud', icon: '🌐' },
    { name: 'Salesforce', icon: '☁️' }, { name: 'SAP', icon: '🔷' },
    { name: 'Workday', icon: '💼' }, { name: 'QuickBooks', icon: '📊' },
    { name: 'Oracle', icon: '🔶' }, { name: 'ServiceNow', icon: '⚙️' },
];

const DOCUMENTS = [
    { name: 'Aadhaar Card', icon: '🪪' }, { name: 'PAN Card', icon: '🪪' },
    { name: 'Indian Passport', icon: '📘' }, { name: 'Driving License', icon: '🚗' },
    { name: 'Voter ID', icon: '🗳️' }, { name: 'GST Invoice', icon: '🧾' },
    { name: 'Bank Statement', icon: '🏦' }, { name: 'Form 16', icon: '📋' },
    { name: 'ITR Filing', icon: '📑' }, { name: 'Salary Slip', icon: '💴' },
    { name: 'Birth Certificate', icon: '📜' }, { name: 'Death Certificate', icon: '📜' },
    { name: 'Marriage Certificate', icon: '💍' }, { name: 'Property Deed', icon: '🏠' },
    { name: 'Land Record', icon: '🗺️' }, { name: 'RC Book', icon: '🚗' },
    { name: 'Insurance Policy', icon: '🛡️' }, { name: 'Medical Report', icon: '🏥' },
    { name: 'COVID Certificate', icon: '💉' }, { name: 'NREGA Card', icon: '🪪' },
    { name: 'Ration Card', icon: '📦' }, { name: 'Caste Certificate', icon: '📄' },
    { name: 'Income Certificate', icon: '📄' }, { name: 'Domicile Certificate', icon: '📄' },
    { name: 'Visa Stamp', icon: '✈️' }, { name: 'Trade License', icon: '🏢' },
    { name: 'MSME Registration', icon: '🏭' }, { name: 'Police FIR', icon: '👮' },
    { name: 'Court Order', icon: '⚖️' }, { name: 'Form 15CB', icon: '📋' },
];

const STATS = [
    { value: '10,000+', label: 'Businesses using DocIntel' },
    { value: '99.2%', label: 'Extraction accuracy' },
    { value: '10×', label: 'Faster than manual review' },
    { value: '50+', label: 'Native integrations' },
];

const COMPANIES_DUP = [...COMPANIES, ...COMPANIES];
const DOCUMENTS_DUP = [...DOCUMENTS, ...DOCUMENTS];

export function TrustBar() {
    useScrollReveal();

    return (
        <section style={{ padding: '0 0 4rem', position: 'relative', zIndex: 1 }}>

            {/* ── Stats row ── */}
            <div className="container" style={{ marginBottom: '4rem' }}>
                <div className="reveal" style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-card)',
                }}>
                    {STATS.map(({ value, label }) => (
                        <div key={label} className="stat-tile">
                            <div className="stat-number">{value}</div>
                            <div className="stat-label">{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Trusted companies ── */}
            <div style={{ marginBottom: '0.5rem' }}>
                <p className="reveal" style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                    Trusted by leading enterprises worldwide
                </p>
                <div className="marquee-wrapper">
                    <div className="marquee-track" style={{ animationDuration: '34s' }}>
                        {COMPANIES_DUP.map(({ name, icon }, i) => (
                            <div key={`${name}-${i}`} className="logo-chip">
                                <span>{icon}</span> {name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Documents validated ── */}
            <div style={{ marginTop: '2rem' }}>
                <p className="reveal" style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                    Documents validated with AI intelligence
                </p>
                <div className="marquee-wrapper">
                    <div className="marquee-track" style={{ animationDuration: '42s', animationDirection: 'reverse' }}>
                        {DOCUMENTS_DUP.map(({ name, icon }, i) => (
                            <div key={`${name}-${i}`} className="doc-chip">
                                <span style={{ fontSize: '1rem' }}>{icon}</span> {name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
