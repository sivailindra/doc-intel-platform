import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { FeaturesSection } from '@/components/FeaturesSection';
import { Footer } from '@/components/PricingFooter';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Features — DocIntel Platform',
    description: 'Explore all 15 production-grade AI document intelligence capabilities. From multi-format extraction to enterprise compliance and real-time analytics.',
};

export default function FeaturesPage() {
    return (
        <>
            <Navbar />
            <main>
                {/* Page Header */}
                <section style={{ padding: '6rem 0 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div className="grid-bg" />
                    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                        <span className="label-tag" style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>Platform Features</span>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginBottom: '1.25rem' }}>
                            Built for{' '}
                            <span className="text-gradient">Enterprise Intelligence</span>
                        </h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', maxWidth: '620px', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
                            Every capability you need to automate document workflows end-to-end — no duct tape required.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/#upload" className="btn btn-primary btn-lg">
                                Try Demo Free <ArrowRight size={18} />
                            </Link>
                            <Link href="/pricing" className="btn btn-secondary btn-lg">View Pricing</Link>
                        </div>
                    </div>
                </section>

                <FeaturesSection />

                {/* Comparison table */}
                <section className="section-sm">
                    <div className="container">
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2.5rem' }}>
                                Why Choose <span className="text-gradient">DocIntel?</span>
                            </h2>
                            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid var(--color-border)' }}>
                                    {['Capability', 'Traditional OCR', 'DocIntel AI'].map((h, i) => (
                                        <div key={h} style={{ padding: '1rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', background: i === 2 ? 'rgba(37,99,235,0.08)' : 'transparent', color: i === 2 ? '#93c5fd' : 'var(--color-text-secondary)' }}>{h}</div>
                                    ))}
                                </div>
                                {[
                                    ['Extraction Accuracy', '70-85%', '99%+'],
                                    ['Multi-format Support', 'PDF only', 'PDF, Images, Excel, Email'],
                                    ['Contextual Understanding', '✗', '✓ LLM-powered'],
                                    ['Confidence Scoring', '✗', '✓ Per field'],
                                    ['Multilingual', 'Limited', '50+ languages'],
                                    ['Compliance Ready', 'Manual', 'SOC 2, HIPAA, GDPR'],
                                    ['Human Review Portal', '✗', '✓ Built-in'],
                                    ['Integration', 'Manual export', '50+ native connectors'],
                                ].map(([cap, old, neo], ri) => (
                                    <div key={cap} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: ri < 7 ? '1px solid var(--color-border)' : undefined }}>
                                        <div style={{ padding: '0.9rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{cap}</div>
                                        <div style={{ padding: '0.9rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{old}</div>
                                        <div style={{ padding: '0.9rem 1.5rem', fontSize: '0.875rem', color: '#6ee7b7', background: 'rgba(37,99,235,0.04)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <CheckCircle2 size={14} /> {neo}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
