'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BrainCircuit, ArrowRight, X } from 'lucide-react';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [announcementVisible, setAnnouncement] = useState(true);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            {/* ── Announcement bar — V7Labs dark bar at very top ── */}
            {announcementVisible && (
                <div className="announcement-bar">
                    <span className="pulse-dot" />
                    <span style={{ color: 'rgba(255,255,255,0.75)' }}>
                        New: AI-powered document authenticity scoring is here.{' '}
                    </span>
                    <a href="#upload" style={{ color: 'white', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                        Try it free →
                    </a>
                    <button
                        onClick={() => setAnnouncement(false)}
                        style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.45)', lineHeight: 1, position: 'absolute', right: '1.25rem' }}
                        aria-label="Dismiss"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* ── Navbar ── */}
            <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} style={{ top: announcementVisible ? 0 : 0 }}>
                {/* Brand */}
                <Link href="/" className="brand-logo">
                    <BrainCircuit size={24} className="logo-icon" />
                    <span>DocIntel</span>
                </Link>

                {/* Desktop Nav */}
                <div className="nav-links">
                    {[
                        { label: 'Products', href: '/features' },
                        { label: 'Solutions', href: '#industries' },
                        { label: 'How It Works', href: '#pipeline' },
                        { label: 'Officer Portal', href: '/officer' },
                    ].map(({ label, href }) => (
                        <Link key={label} href={href} className="nav-link">{label}</Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="nav-actions">
                    <Link href="/officer" className="btn btn-ghost" style={{ fontSize: '0.875rem' }}>
                        Sign In
                    </Link>
                    <Link href="#upload" className="btn btn-primary" style={{ padding: '0.5rem 1.15rem', fontSize: '0.875rem' }}>
                        Get Started Free
                    </Link>
                </div>
            </nav>
        </>
    );
}
