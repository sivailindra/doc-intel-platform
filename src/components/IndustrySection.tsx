'use client';
import { useState } from 'react';
import { TrendingDown, FileText, Stethoscope, Truck, ShieldCheck } from 'lucide-react';

const INDUSTRIES = [
    {
        id: 'finance',
        icon: TrendingDown, label: 'Finance', formName: 'Bank Statement',
        headline: 'Lower Bad-Debt Risk by 64%',
        desc: 'Automate credit decisioning with accurate extraction from bank statements, tax returns, pay stubs, and financial reports. Run finance on autopilot.',
        bullets: ['Instant bank statement analysis', 'Automated KYC document checks', 'Invoice & PO matching at scale', 'Real-time fraud detection flags'],
        accent: '#3b82f6',
        mockForm: [
            { k: 'Account Holder', v: 'Rohit Sharma', conf: 99 },
            { k: 'Account Num', v: '03XX-XXXX-4291', conf: 98 },
            { k: 'Bank Branch', v: 'HSR Layout, BGLR', conf: 96 },
            { k: 'Closing Bal', v: '₹4,12,050.00', conf: 97 },
            { k: 'Total Deposits', v: '₹1,45,000.00', conf: 91 },
            { k: 'IFSC Code', v: 'HDFC0001234', conf: 92 },
            { k: 'Fraud Flags', v: 'NONE DETECTED', conf: 95 }
        ]
    },
    {
        id: 'legal',
        icon: FileText, label: 'Legal', formName: 'NDA Contract',
        headline: 'Review Contracts 10× Faster',
        desc: 'Extract key clauses, parties, obligations, and risk terms from legal contracts. Streamline due diligence, M&A reviews, and compliance audits.',
        bullets: ['Clause extraction and classification', 'Obligation & deadline tracking', 'Risk flag auto-identification', 'Multi-party contract comparison'],
        accent: '#8b5cf6',
        mockForm: [
            { k: 'Party A', v: 'Reliance Ind. Ltd.', conf: 98 },
            { k: 'Party B', v: 'TCS Solutions', conf: 99 },
            { k: 'Reg. Office', v: 'Navi Mumbai, IN', conf: 96 },
            { k: 'Jurisdiction', v: 'Mumbai Courts', conf: 95 },
            { k: 'Effective Dt', v: '01 April 2024', conf: 92 },
            { k: 'Duration', v: '24 Months', conf: 93 },
            { k: 'Indemnity Cap', v: '₹5,00,00,000', conf: 89 }
        ]
    },
    {
        id: 'healthcare',
        icon: Stethoscope, label: 'Healthcare', formName: 'Clinical Record',
        headline: 'Simplify Patient Workflows at Scale',
        desc: 'Digitize patient records, EOBs, prior authorizations, and clinical notes. Ensure HIPAA compliance with zero manual data entry.',
        bullets: ['Patient intake form digitization', 'Insurance claim auto-routing', 'Prior auth data extraction', 'HIPAA-ready data handling'],
        accent: '#06b6d4',
        mockForm: [
            { k: 'Patient Name', v: 'Priya Verma', conf: 99 },
            { k: 'Date of Birth', v: '14 May 1982', conf: 98 },
            { k: 'Aadhaar ID', v: 'XXXX-XXXX-8912', conf: 97 },
            { k: 'Diagnosis', v: 'Type 2 Diabetes', conf: 91 },
            { k: 'Hospital', v: 'Apollo Hospitals', conf: 96 },
            { k: 'Attending Dr', v: 'Dr. Anand Kumar', conf: 93 },
            { k: 'Prescription', v: 'Metformin 500mg', conf: 94 }
        ]
    },
    {
        id: 'logistics',
        icon: Truck, label: 'Logistics', formName: 'E-Way Bill',
        headline: 'Process Shipping Docs Instantly',
        desc: 'Automate bills of lading, customs forms, manifests, and delivery receipts to eliminate delays and errors in your supply chain.',
        bullets: ['Bill of lading extraction', 'Customs & compliance forms', 'Multi-carrier document support', 'Real-time tracking doc sync'],
        accent: '#f59e0b',
        mockForm: [
            { k: 'E-Way Bill No', v: '1012-3498-5000', conf: 97 },
            { k: 'Vehicle Num', v: 'KA-01-AB-1234', conf: 99 },
            { k: 'Consignee', v: 'Flipkart Logistics', conf: 98 },
            { k: 'Origin', v: 'Bengaluru, KA', conf: 99 },
            { k: 'Destination', v: 'Hyderabad, TS', conf: 96 },
            { k: 'Gross Weight', v: '14,250 KG', conf: 95 },
            { k: 'GSTIN', v: '29ABCDE1234F1Z5', conf: 92 }
        ]
    },
    {
        id: 'insurance',
        icon: ShieldCheck, label: 'Insurance', formName: 'Motor Claim',
        headline: 'Settle Claims 5× Faster',
        desc: 'Extract, validate, and route claims documents automatically. Reduce manual review time and deliver faster policyholder experiences.',
        bullets: ['Claims form data extraction', 'Policy document analysis', 'Fraud anomaly detection', 'Auto-adjudication support'],
        accent: '#10b981',
        mockForm: [
            { k: 'Policy Num', v: 'MTR-2023-8991', conf: 98 },
            { k: 'Insured Name', v: 'Vikas Sharma', conf: 99 },
            { k: 'Incident Date', v: '12 Oct 2024', conf: 96 },
            { k: 'Damage Est.', v: '₹42,500.00', conf: 91 },
            { k: 'Garage Name', v: 'Maruti Authorized', conf: 94 },
            { k: 'Surveyor ID', v: 'SUR-8910-XX', conf: 95 },
            { k: 'Police FIR', v: 'ATTACHED / VALID', conf: 88 }
        ]
    },
];

export function IndustrySection() {
    const [active, setActive] = useState('finance');
    const tab = INDUSTRIES.find(t => t.id === active)!;
    const Icon = tab.icon;

    return (
        <section className="section" id="industries">
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <span className="label-tag" style={{ display: 'inline-flex', marginBottom: '1rem' }}>Built For Every Team</span>
                    <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginTop: '1rem' }}>
                        Made for Enterprise Teams <span className="text-gradient">That Can't Afford Delays</span>
                    </h2>
                </div>

                {/* Tabs */}
                <div className="tab-list" style={{ marginBottom: '2.5rem' }}>
                    {INDUSTRIES.map(({ id, label, icon: TIcon, accent }) => (
                        <button
                            key={id}
                            className={`tab-btn ${active === id ? 'active' : ''}`}
                            onClick={() => setActive(id)}
                            style={active === id ? { borderBottomColor: accent, color: accent } : {}}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <TIcon size={15} />
                                {label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="glass-panel" style={{ padding: '2.5rem', borderColor: `${tab.accent}25`, animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
                        <div>
                            <div style={{
                                width: 56, height: 56, borderRadius: 'var(--radius-lg)',
                                background: `${tab.accent}18`, border: `1px solid ${tab.accent}30`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
                            }}>
                                <Icon size={26} color={tab.accent} />
                            </div>
                            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{tab.headline}</h3>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: '1.75rem' }}>{tab.desc}</p>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {tab.bullets.map(b => (
                                    <li key={b} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                        <span style={{
                                            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                                            background: tab.accent, boxShadow: `0 0 8px ${tab.accent}`
                                        }} />
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Realistic form panel */}
                        <div style={{
                            background: '#ffffff', borderRadius: '4px', padding: '1.5rem',
                            border: '5px double #000000', minHeight: 280, display: 'flex', flexDirection: 'column',
                            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.15)', position: 'relative', overflow: 'hidden'
                        }}>
                            {/* Watermark/Stamp */}
                            <div style={{
                                position: 'absolute', top: '15%', right: '-10%', transform: 'rotate(-15deg)',
                                border: `3px solid ${tab.accent}40`, color: `${tab.accent}40`,
                                padding: '0.4rem 0.8rem', fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase',
                                letterSpacing: '2px', borderRadius: '6px', pointerEvents: 'none'
                            }}>
                                VERIFIED
                            </div>

                            {/* Form Header */}
                            <div style={{ borderBottom: '2px solid #000', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#000', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{tab.formName}</div>
                                    <div style={{ fontSize: '0.65rem', color: '#666', marginTop: '0.2rem' }}>EXTRACTED • ID_{tab.id.toUpperCase().substring(0, 4)}X{tab.mockForm.length}</div>
                                </div>
                                <div style={{ textAlign: 'right', fontSize: '0.65rem', color: '#666' }}>
                                    Oct 24, 2024
                                </div>
                            </div>

                            {/* Form Fields Table */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
                                {tab.mockForm.map((field, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted #ccc', paddingBottom: '0.4rem' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#444', width: '40%' }}>
                                            {field.k}:
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#000', fontFamily: 'monospace', flex: 1 }}>
                                            {field.v}
                                        </div>
                                        {/* Confidence tag */}
                                        <div style={{
                                            fontSize: '0.6rem', fontWeight: 700, color: tab.accent,
                                            background: `${tab.accent}15`, padding: '2px 6px', borderRadius: '4px'
                                        }}>
                                            {field.conf}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
