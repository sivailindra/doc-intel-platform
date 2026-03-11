'use client';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function HeroSection() {
    useScrollReveal();

    return (
        <section style={{
            paddingTop: '6rem', paddingBottom: '5rem',
            position: 'relative', overflow: 'hidden', background: 'var(--color-base)',
        }}>
            {/* Grid texture */}
            <div className="grid-bg" />

            {/* Large warm glow orbs — V7Labs style, subtle on light bg */}
            <div style={{
                position: 'absolute', bottom: '-10%', left: '-8%',
                width: '650px', height: '650px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(224,79,42,0.13) 0%, transparent 65%)',
                filter: 'blur(40px)', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', top: '-5%', right: '-10%',
                width: '580px', height: '580px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(110,70,232,0.07) 0%, transparent 65%)',
                filter: 'blur(50px)', pointerEvents: 'none',
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>

                    {/* Tag */}
                    <div className="reveal" style={{ marginBottom: '1.5rem' }}>
                        <span className="label-tag orange">
                            <Sparkles size={11} />
                            Powered by Google Gemini AI
                        </span>
                    </div>

                    {/* Headline — V7Labs: extremely bold, tight tracking */}
                    <h1 className="reveal reveal-delay-1" style={{
                        fontSize: 'clamp(2.8rem, 6vw, 4.8rem)',
                        fontWeight: 900,
                        lineHeight: 1.05,
                        letterSpacing: '-0.04em',
                        marginBottom: '1.5rem',
                        color: 'var(--color-text-primary)',
                    }}>
                        Extract Intelligence<br />
                        from Any{' '}
                        <span className="text-gradient">Document</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="reveal reveal-delay-2" style={{
                        fontSize: '1.15rem', color: 'var(--color-text-secondary)',
                        lineHeight: 1.75, maxWidth: '620px', margin: '0 auto 2.5rem',
                    }}>
                        DocIntel automates extraction, classification, validation and routing of data from any document — with 99% accuracy, in seconds.
                    </p>

                    {/* CTAs — V7Labs: Black pill primary, outline secondary */}
                    <div className="reveal reveal-delay-3" style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="#upload" className="btn btn-primary btn-lg">
                            Start Extracting Free <ArrowRight size={17} />
                        </Link>
                        <Link href="/officer" className="btn btn-secondary btn-lg">
                            View Officer Portal
                        </Link>
                    </div>

                    {/* Social proof line */}
                    <div className="reveal reveal-delay-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '2.25rem', flexWrap: 'wrap' }}>
                        {[
                            '✦ No credit card required',
                            '✦ 1,000 free pages',
                            '✦ SOC 2 compliant',
                        ].map(t => (
                            <span key={t} style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{t}</span>
                        ))}
                    </div>
                </div>

                {/* Hero visual — browser mockup */}
                <div className="reveal reveal-delay-5" style={{ marginTop: '4.5rem', maxWidth: '900px', margin: '4.5rem auto 0' }}>
                    <div style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        boxShadow: '0 24px 64px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)',
                    }}>
                        {/* Browser bar */}
                        <div style={{
                            padding: '0.75rem 1.25rem',
                            borderBottom: '1px solid var(--color-border)',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            background: 'var(--color-base)',
                        }}>
                            {['#ef4444', '#f59e0b', '#22c55e'].map(c => (
                                <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                            ))}
                            <div style={{
                                marginLeft: '0.5rem', flex: 1, height: 22, borderRadius: 6,
                                background: 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center',
                                padding: '0 0.75rem', fontSize: '0.72rem', color: 'var(--color-text-muted)',
                            }}>
                                app.docintel.ai/extract
                            </div>
                        </div>

                        {/* Split view */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '300px' }}>
                            {/* Left — document */}
                            <div style={{ padding: '2rem', borderRight: '1px solid var(--color-border)', background: 'var(--color-base)' }}>
                                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                                    Input Document
                                </div>
                                {['Full Name', 'Date of Birth', 'Document ID', 'Address', 'Issue Date', 'Expiry Date'].map((fld, i) => (
                                    <div key={fld} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.6rem', animation: `fadeInUp 0.4s ease ${0.5 + i * 0.07}s both`, opacity: 0 }}>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', width: '85px', flexShrink: 0 }}>{fld}</div>
                                        <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'rgba(0,0,0,0.07)' }}>
                                            <div style={{ width: `${62 + (i * 13) % 35}%`, height: '100%', borderRadius: 4, background: 'rgba(0,0,0,0.13)' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Right — extracted data */}
                            <div style={{ padding: '2rem' }}>
                                <div style={{ fontSize: '0.72rem', color: 'var(--color-success)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block', animation: 'blink 1.5s infinite' }} />
                                    AI Extracted Data
                                </div>
                                {[
                                    { key: 'Full Name', val: 'Arjun Mehta', conf: 98 },
                                    { key: 'Date of Birth', val: '14 Aug 1989', conf: 97 },
                                    { key: 'Document ID', val: 'DL-MH-2024-88821', conf: 99 },
                                    { key: 'Address', val: 'Mumbai, MH 400001', conf: 92 },
                                    { key: 'Issue Date', val: '01 Jan 2022', conf: 96 },
                                    { key: 'Expiry Date', val: '31 Dec 2032', conf: 95 },
                                ].map(({ key, val, conf }, i) => (
                                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', animation: `fadeInUp 0.4s ease ${0.6 + i * 0.07}s both`, opacity: 0 }}>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{key}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>{val}</span>
                                            <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.38rem', borderRadius: 4, background: 'rgba(22,163,74,0.1)', color: 'var(--color-success)', fontWeight: 700 }}>{conf}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Scan line */}
                        <div style={{
                            position: 'absolute', left: 0, right: 0, height: '2px',
                            background: 'linear-gradient(90deg, transparent, rgba(224,79,42,0.5), transparent)',
                            animation: 'scanLine 3s ease-in-out infinite', pointerEvents: 'none',
                        }} />
                    </div>

                    {/* Trust badge row below mockup */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
                        {[
                            { icon: <ShieldCheck size={14} />, text: 'SOC 2 Type II' },
                            { icon: '🔒', text: 'GDPR Compliant' },
                            { icon: '⚡', text: '< 3s processing' },
                            { icon: '🇮🇳', text: 'India-first doc support' },
                        ].map(({ icon, text }) => (
                            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                <span style={{ color: 'var(--color-brand-primary)' }}>{icon}</span> {text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
