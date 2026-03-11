'use client';
import { Download, SplitSquareVertical, Cpu, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const STEPS = [
    { icon: Download, label: 'Receive', desc: 'Email, API, drag & drop' },
    { icon: SplitSquareVertical, label: 'Classify', desc: 'Smart doc type detection' },
    { icon: Cpu, label: 'Extract', desc: 'AI field extraction' },
    { icon: CheckCircle2, label: 'Validate', desc: '99% accuracy checks' },
    { icon: RefreshCw, label: 'Sync', desc: 'Push to any system' },
];

export function PipelineSection() {
    useScrollReveal();

    return (
        <section className="section-sm" id="pipeline" style={{ background: 'var(--color-base)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
                    <span className="label-tag reveal" style={{ display: 'inline-flex', marginBottom: '1rem' }}>AI Tech Stack</span>
                    <h2 className="reveal reveal-delay-1" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginTop: '0.75rem' }}>
                        The AI Stack <span className="text-gradient">Beyond Buzzwords</span>
                    </h2>
                    <p className="reveal reveal-delay-2" style={{ color: 'var(--color-text-secondary)', marginTop: '0.75rem', maxWidth: '540px', margin: '0.75rem auto 0' }}>
                        End-to-end document workflow — from ingestion to integration — powered by production-grade AI.
                    </p>
                </div>

                <div className="reveal reveal-delay-2" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    <div className="pipeline-container" style={{ justifyContent: 'center', gap: '0', minWidth: 600 }}>
                        {STEPS.map(({ icon: Icon, label, desc }, i) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                                <div className="pipeline-step">
                                    <div className="pipeline-step-icon">
                                        <Icon size={20} color="var(--color-brand-primary)" />
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: '0.88rem', textAlign: 'center', color: 'var(--color-text-primary)' }}>{label}</div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>{desc}</div>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div style={{ padding: '0 0.5rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>
                                        <ArrowRight size={15} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
