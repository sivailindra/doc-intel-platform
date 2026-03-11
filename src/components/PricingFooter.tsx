'use client';
import Link from 'next/link';
import { ArrowRight, BrainCircuit, Twitter, Linkedin, Github, Mail } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

/* ─── CTA Banner — V7Labs warm full-width orange section ─── */
export function CTABanner() {
    useScrollReveal();

    return (
        <section
            className="section-warm"
            style={{ padding: '6rem 0', position: 'relative', overflow: 'hidden' }}
        >
            {/* Grain overlay is defined in .section-warm::before */}

            {/* Large text testimonials — V7Labs style horizontal scroll quotes */}
            <div style={{ textAlign: 'center', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
                <div className="reveal" style={{
                    fontSize: 'clamp(0.75rem, 1.2vw, 0.8rem)', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.12em',
                    color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem',
                }}>
                    What customers say
                </div>

                {/* Big impactful quote — V7Labs scrolling testimonials */}
                <div className="reveal reveal-delay-1" style={{
                    fontSize: 'clamp(1.6rem, 4vw, 3rem)', fontWeight: 700,
                    color: 'white', lineHeight: 1.2, maxWidth: '900px',
                    margin: '0 auto', letterSpacing: '-0.03em',
                }}>
                    "DocIntel enabled us to process 50,000 documents 21× faster while also increasing accuracy by 54%."
                </div>

                <div className="reveal reveal-delay-2" style={{ marginTop: '1.25rem', color: 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: 500 }}>
                    — Priya Sharma, Head of Operations, FinEdge Capital
                </div>

                <div className="reveal reveal-delay-3" style={{
                    display: 'flex', gap: '1rem', justifyContent: 'center',
                    marginTop: '3.5rem', flexWrap: 'wrap',
                }}>
                    <Link href="#upload" className="btn btn-white btn-lg">
                        Start free today <ArrowRight size={17} />
                    </Link>
                    <Link href="/officer" className="btn btn-lg" style={{
                        background: 'rgba(255,255,255,0.12)', color: 'white',
                        border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(6px)',
                    }}>
                        Book a demo
                    </Link>
                </div>

                {/* Mini stats row */}
                <div className="reveal reveal-delay-4" style={{
                    display: 'flex', gap: '3rem', justifyContent: 'center',
                    marginTop: '3.5rem', flexWrap: 'wrap',
                }}>
                    {[
                        { value: '10,000+', label: 'businesses' },
                        { value: '21×', label: 'faster processing' },
                        { value: '99.2%', label: 'accuracy' },
                    ].map(({ value, label }) => (
                        <div key={label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white', letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</div>
                            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.3rem', fontWeight: 500 }}>{label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Footer ─── */
const NAV_COLS = [
    { title: 'Product', links: ['Features', 'API Docs', 'Integrations', 'Changelog'] },
    { title: 'Solutions', links: ['Finance', 'Legal', 'Healthcare', 'Logistics', 'Insurance'] },
    { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press', 'Contact'] },
];

export function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand col */}
                    <div>
                        <div className="brand-logo" style={{ marginBottom: '1rem', color: 'white' }}>
                            <BrainCircuit size={22} style={{ color: 'var(--color-brand-accent)' }} />
                            <span>DocIntel</span>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.75, maxWidth: '260px' }}>
                            AI-powered document intelligence for forward-thinking enterprises. Extract, validate, and act on data instantly.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                                <a key={i} href="#" style={{
                                    width: 36, height: 36, borderRadius: 'var(--radius-md)',
                                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'rgba(255,255,255,0.4)', transition: 'all 0.2s ease',
                                }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'white'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.18)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {NAV_COLS.map(({ title, links }) => (
                        <div key={title}>
                            <h4 style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: '1.25rem', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</h4>
                            {links.map(l => <a key={l} href="#" className="footer-link">{l}</a>)}
                        </div>
                    ))}
                </div>

                <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 0 1.75rem' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>© 2026 DocIntel Platform. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        {['Privacy Policy', 'Terms of Service', 'Security'].map(l => (
                            <a key={l} href="#" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', transition: 'color 0.15s' }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)'}
                            >{l}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
