'use client';
import { useEffect } from 'react';

/**
 * useScrollReveal — V7Labs-style Intersection Observer
 * Adds `.revealed` to all `.reveal` elements as they enter viewport.
 */
export function useScrollReveal() {
    useEffect(() => {
        const els = document.querySelectorAll<HTMLElement>('.reveal');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target); // once only
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
}
