'use client';
import {
    Cpu, Globe, ShieldCheck, BarChart3, FileStack, Languages,
    Zap, Brain, GitMerge, Layers, UserCheck, Eye, ListChecks, BookOpen, Workflow
} from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const FEATURES = [
    {
        icon: Cpu, color: '#3b82f6',
        title: 'Automated Data Extraction',
        desc: 'Extract data with unmatched accuracy and contextual understanding using state-of-the-art LLMs. Supports 16+ field types per document.'
    },
    {
        icon: FileStack, color: '#8b5cf6',
        title: 'Multi-Format Support',
        desc: 'Break down information silos — process PDFs, images, Excel sheets, emails, and scanned forms seamlessly from any source.'
    },
    {
        icon: Brain, color: '#06b6d4',
        title: 'Contextual Intelligence',
        desc: 'Turn raw text into actionable insights with advanced contextual interpretation beyond simple pattern matching or keyword rules.'
    },
    {
        icon: Zap, color: '#f59e0b',
        title: 'Adaptive Learning',
        desc: 'Continuously learn and adapt from corrections — ensuring long-term efficiency and improving field confidence over time.'
    },
    {
        icon: GitMerge, color: '#10b981',
        title: 'Seamless Integration',
        desc: 'Integrate effortlessly via REST APIs, webhooks, and native connectors for Salesforce, SAP, Zapier, Slack, and 50+ systems.'
    },
    {
        icon: ShieldCheck, color: '#ef4444',
        title: 'Security & Compliance',
        desc: 'Strengthen data governance with SOC 2 Type II, HIPAA-ready, and GDPR compliance. End-to-end encryption and audit trails.'
    },
    {
        icon: BarChart3, color: '#a78bfa',
        title: 'Real-Time Analytics',
        desc: 'Generate real-time processing dashboards and turn document data into strategic business intelligence and decision support.'
    },
    {
        icon: Layers, color: '#38bdf8',
        title: 'Complex Document Handling',
        desc: 'Handle complex, multi-page documents with table detection, cross-page field linking, and nested section parsing with ease.'
    },
    {
        icon: Languages, color: '#34d399',
        title: 'Multilingual Support',
        desc: 'Break down language barriers — extract and classify fields from 50+ languages including RTL scripts for truly global operations.'
    },
    {
        icon: Globe, color: '#fb923c',
        title: 'Enterprise Scalability',
        desc: 'Scale efficiently to meet enterprise-level demands — process millions of pages per month with consistent speed and accuracy.'
    },
    {
        icon: Brain, color: '#c084fc',
        title: 'Smart Classification Engine',
        desc: 'Auto-detect and route document types — invoices, IDs, contracts, medical records — with a trained multi-class classifier.'
    },
    {
        icon: UserCheck, color: '#4ade80',
        title: 'Human-in-the-Loop Review',
        desc: 'Route low-confidence or flagged documents to a governed officer review portal with approve/reject workflow and audit trails.'
    },
    {
        icon: Eye, color: '#f472b6',
        title: 'Confidence Scoring',
        desc: 'Every extracted field comes with a confidence score and anomaly flag, enabling transparent, auditable AI decision-making.'
    },
    {
        icon: ListChecks, color: '#a3e635',
        title: 'Audit Trail & Governance',
        desc: 'Complete chain-of-custody logs for every document — from ingestion to approval — satisfying regulatory and compliance needs.'
    },
    {
        icon: Workflow, color: '#22d3ee',
        title: 'Low-Code Workflow Builder',
        desc: 'Customize extraction templates, validation rules, and routing logic without engineering effort using intuitive drag-and-drop tools.'
    },
];

export function FeaturesSection() {
    useScrollReveal();
    return (
        <section className="section" id="features" style={{ background: 'var(--color-base-alt)' }}>
            <div className="container">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span className="label-tag reveal" style={{ marginBottom: '1rem', display: 'inline-flex' }}>Platform Capabilities</span>
                    <h2 className="reveal reveal-delay-1" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginTop: '1rem', maxWidth: '700px', margin: '1rem auto 0' }}>
                        Everything You Need to <span className="text-gradient">Conquer Document Complexity</span>
                    </h2>
                    <p className="reveal reveal-delay-2" style={{ color: 'var(--color-text-secondary)', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto 0' }}>
                        15 production-grade capabilities built into one unified platform — no stitching tools together.
                    </p>
                </div>

                {/* Feature grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {FEATURES.map(({ icon: Icon, color, title, desc }, i) => (
                        <div key={title} className={`feature-card reveal reveal-delay-${(i % 5) + 1}`}>
                            <div className="feature-icon-wrapper" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                                <Icon size={22} color={color} />
                            </div>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>{title}</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
