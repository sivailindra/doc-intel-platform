'use client';
import Link from 'next/link';
import { ArrowRight, BrainCircuit } from 'lucide-react';

/**
 * FloatingCTA — V7Labs signature fixed pill at bottom of viewport
 * Avatar + "Book a demo" + divider + "Explore" buttons
 */
export function FloatingCTA() {
    return (
        <div className="floating-cta" role="navigation" aria-label="Quick actions">
            {/* Avatar */}
            <div className="floating-cta-avatar">🤖</div>

            {/* Action 1 */}
            <Link href="#upload" className="floating-cta-btn">
                <span>Try Demo</span>
                <ArrowRight size={14} />
            </Link>

            <div className="floating-cta-divider" />

            {/* Action 2 */}
            <Link href="/officer" className="floating-cta-btn">
                <span>Officer Portal</span>
                <ArrowRight size={14} />
            </Link>
        </div>
    );
}
