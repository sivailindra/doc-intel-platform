'use client';
import { Upload, Cpu, CheckCircle2 } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const STEPS = [
    {
        icon: Upload, num: '01',
        title: 'Upload Any Document',
        desc: 'Drag & drop, email in, or connect via API. We accept PDFs, images, Word files, Excel sheets, and more — from anywhere.',
        color: '#3b82f6'
    },
    {
        icon: Cpu, num: '02',
        title: 'AI Extracts & Validates',
        desc: 'Google Gemini AI reads, classifies, and extracts all key fields with contextual understanding. Confidence scores computed per field.',
        color: '#8b5cf6'
    },
    {
        icon: CheckCircle2, num: '03',
        title: 'Review, Export & Sync',
        desc: 'Review flagged documents in the officer portal. Auto-export clean extractions to your CRM, ERP, or data warehouse in real time.',
        color: '#10b981'
    },
];

const TESTIMONIALS = [
    { quote: '"DocIntel reduced our loan processing time from 3 days to 4 hours. The accuracy is remarkable — we see less than 0.5% error rate."', name: 'Priya Sharma', role: 'Head of Operations, FinEdge Capital', initials: 'PS', color: '#3b82f6' },
    { quote: '"We process 50,000 insurance claims per month. DocIntel handles the entire data extraction layer — completely automated."', name: 'James Okafor', role: 'CTO, Meridian Insurance Group', initials: 'JO', color: '#8b5cf6' },
    { quote: '"The multilingual support is a game-changer for our global operations. Documents in 12 languages, all extracted perfectly."', name: 'Hana Yamamoto', role: 'VP Digital, Nexus Logistics Asia', initials: 'HY', color: '#06b6d4' },
    { quote: '"Our legal team review contracts 8× faster. The clause extraction and risk flagging saves us 200+ hours per quarter."', name: 'Marcus Reid', role: 'General Counsel, Atlas Ventures', initials: 'MR', color: '#10b981' },
    { quote: '"Compliance audits used to take weeks. Now we run them overnight with DocIntel\'s audit trail and governance layer."', name: 'Anika Bose', role: 'Chief Compliance Officer, RegTech Co.', initials: 'AB', color: '#f59e0b' },
    { quote: '"The confidence scoring gives us exactly the transparency our regulators demand. This is enterprise-grade AI done right."', name: 'Callum Fraser', role: 'Director of Analytics, DataFirst Bank', initials: 'CF', color: '#ef4444' },
];

export function HowItWorksAndTestimonials() {
    useScrollReveal();
    return (
        <>
            {/* How It Works */}
            <section className="section" style={{ background: 'var(--color-surface)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <span className="label-tag reveal" style={{ display: 'inline-flex', marginBottom: '1rem' }}>Simple by Design</span>
                        <h2 className="reveal reveal-delay-1" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginTop: '1rem' }}>
                            Up and Running in <span className="text-gradient">3 Simple Steps</span>
                        </h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                        {STEPS.map(({ icon: Icon, num, title, desc, color }, i) => (
                            <div key={num} className={`card reveal reveal-delay-${i + 1}`} style={{ textAlign: 'center', padding: '2rem' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: `${color}20`, fontFamily: 'var(--font-display)', lineHeight: 1, marginBottom: '1.25rem', letterSpacing: '-0.05em' }}>{num}</div>
                                <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-lg)', background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                                    <Icon size={22} color={color} />
                                </div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>{title}</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section" style={{ background: 'var(--color-base)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <span className="label-tag reveal" style={{ display: 'inline-flex', marginBottom: '1rem' }}>Social Proof</span>
                        <h2 className="reveal reveal-delay-1" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginTop: '1rem' }}>
                            Businesses Do <span className="text-gradient">Extraordinary Things</span>
                        </h2>
                    </div>
                    {/* Masonry 3-col */}
                    <div style={{ columns: 3, gap: '1.25rem', columnFill: 'balance' }}>
                        {TESTIMONIALS.map(({ quote, name, role, initials, color }, i) => (
                            <div key={name} className={`testimonial-card reveal reveal-delay-${(i % 4) + 1}`}>
                                <div style={{ fontSize: '2rem', color: 'rgba(0,0,0,0.12)', lineHeight: 1, marginBottom: '0.75rem', fontFamily: 'serif' }}>"</div>
                                <p className="testimonial-quote">{quote.replace(/^"|"$/g, '')}</p>
                                <div className="testimonial-author">
                                    <div className="author-avatar" style={{ background: `${color}18`, color, border: `1px solid ${color}25` }}>{initials}</div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{name}</div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
