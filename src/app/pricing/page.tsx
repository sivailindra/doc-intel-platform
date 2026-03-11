import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { PricingSection, Footer } from '@/components/PricingFooter';
import { ArrowRight, HelpCircle, ChevronDown } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Pricing — DocIntel Platform',
    description: 'Simple, transparent pricing for teams of all sizes. Start free with 1,000 pages, then scale as you grow.',
};

const FAQS = [
    { q: 'What counts as one "page"?', a: 'Each document side processed by the AI counts as one page. A 10-page PDF uses 10 page credits.' },
    { q: 'Can I use DocIntel for free?', a: 'Yes! Every account starts with 1,000 free page credits — no credit card required. Plenty to run a real proof of concept.' },
    { q: 'What document formats are supported?', a: 'PDF, JPG, PNG, TIFF, BMP, HEIC, WEBP, and multi-page TIFF. Excel and email support available on Professional and Enterprise plans.' },
    { q: 'Is my data secure?', a: 'Yes. All data is encrypted at rest and in transit. We are SOC 2 Type II certified and GDPR compliant. Enterprise plans include data residency options.' },
    { q: 'Can I cancel anytime?', a: "Absolutely. No long-term contracts for Starter or Professional. Enterprise agreements are custom — talk to our sales team." },
    { q: 'Do you offer a free trial for Professional?', a: 'Yes, 14-day free trial with full Professional features. No credit card required to start.' },
];

export default function PricingPage() {
    return (
        <>
            <Navbar />
            <main>
                {/* Hero */}
                <section style={{ padding: '6rem 0 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div className="grid-bg" />
                    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                        <span className="label-tag" style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>Pricing</span>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>
                            Transparent Pricing,{' '}
                            <span className="text-gradient">No Surprises</span>
                        </h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.8 }}>
                            Start free. Scale as you grow. Everything you need to automate your document workflows.
                        </p>
                    </div>
                </section>

                <PricingSection />

                {/* Trust signals */}
                <section className="section-sm">
                    <div className="container">
                        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '5rem' }}>
                            {['SOC 2 Type II Certified', 'HIPAA Ready', 'GDPR Compliant', 'AES-256 Encryption', '99.9% Uptime SLA'].map(t => (
                                <div key={t} className="badge badge-success" style={{ fontSize: '0.78rem', padding: '0.4rem 0.9rem' }}>{t}</div>
                            ))}
                        </div>

                        {/* FAQ */}
                        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
                            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                                    <HelpCircle size={28} style={{ color: 'var(--color-brand-primary)' }} />
                                    Frequently Asked Questions
                                </h2>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {FAQS.map(({ q, a }) => (
                                    <details key={q} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                                        <summary style={{
                                            padding: '1.1rem 1.5rem',
                                            background: 'rgba(10,15,30,0.7)',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: 'var(--radius-lg)',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            fontSize: '0.95rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            listStyle: 'none',
                                            transition: 'background 0.2s ease',
                                        }}>
                                            {q}
                                            <ChevronDown size={18} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                                        </summary>
                                        <div style={{
                                            padding: '1.1rem 1.5rem',
                                            background: 'rgba(10,15,30,0.4)',
                                            border: '1px solid var(--color-border)',
                                            borderTop: 'none',
                                            fontSize: '0.9rem',
                                            color: 'var(--color-text-secondary)',
                                            lineHeight: 1.75,
                                        }}>{a}</div>
                                    </details>
                                ))}
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>Still have questions?</p>
                                <Link href="/officer" className="btn btn-secondary">
                                    Contact Sales <ArrowRight size={15} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
