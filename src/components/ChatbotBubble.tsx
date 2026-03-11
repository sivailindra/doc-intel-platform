'use client';
import { useState, useRef, useEffect } from 'react';
import { X, Send, BrainCircuit, ChevronDown } from 'lucide-react';

interface Message {
    role: 'bot' | 'user';
    text: string;
}

const QUICK_REPLIES = [
    'How accurate is extraction?',
    'Which documents are supported?',
    'How do I integrate via API?',
    'Is data stored securely?',
];

const BOT_RESPONSES: Record<string, string> = {
    default: "Hi! I'm DocIntel AI. Ask me anything about document extraction, accuracy, integrations, or our officer portal.",
    'how accurate is extraction?': "DocIntel achieves **99.2% accuracy** on structured documents (IDs, invoices, contracts). Each field comes with a confidence score so you always know reliability.",
    'which documents are supported?': "We support 30+ document types — Aadhaar, PAN, Passport, Driving License, GST invoices, bank statements, Form 16, contracts, medical reports, and more.",
    'how do i integrate via api?': "Integration is easy:\n1. Get your API key from the dashboard\n2. POST your document to `/api/v1/extract`\n3. Receive structured JSON in < 3 seconds\n\nWe also have webhooks and native connectors for Salesforce, SAP, and Zapier.",
    'is data stored securely?': "Yes! DocIntel is SOC 2 Type II certified and GDPR compliant. Documents are encrypted at rest (AES-256) and in transit (TLS 1.3). You can opt for on-premise deployment too.",
};

function getBotReply(userText: string): string {
    const key = userText.trim().toLowerCase();
    for (const [pattern, reply] of Object.entries(BOT_RESPONSES)) {
        if (pattern !== 'default' && key.includes(pattern.split(' ')[0])) return reply;
    }
    return BOT_RESPONSES.default;
}

export function ChatbotBubble() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', text: BOT_RESPONSES.default },
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;
        setMessages(prev => [...prev, { role: 'user', text }]);
        setInput('');
        setTyping(true);
        setTimeout(() => {
            setTyping(false);
            setMessages(prev => [...prev, { role: 'bot', text: getBotReply(text) }]);
        }, 900 + Math.random() * 400);
    };

    return (
        <>
            {/* Chat panel */}
            {open && (
                <div style={{
                    position: 'fixed', bottom: '5.5rem', right: '1.5rem', zIndex: 200,
                    width: 360, maxHeight: 520,
                    background: 'white',
                    border: '1px solid rgba(0,0,0,0.09)',
                    borderRadius: '20px',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08)',
                    display: 'flex', flexDirection: 'column',
                    overflow: 'hidden',
                    animation: 'fadeInUp 0.25s ease',
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1rem 1.25rem',
                        background: 'var(--color-dark)',
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                    }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--color-brand-accent), var(--color-brand-primary))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <BrainCircuit size={18} color="white" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1 }}>DocIntel AI</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'blink 2s infinite' }} />
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>Online · Replies instantly</span>
                            </div>
                        </div>
                        <button onClick={() => setOpen(false)} style={{ color: 'rgba(255,255,255,0.45)', transition: 'color 0.15s', lineHeight: 1 }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'white'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'}
                        >
                            <ChevronDown size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#fafaf9' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '0.5rem', alignItems: 'flex-end' }}>
                                {msg.role === 'bot' && (
                                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-brand-accent), var(--color-brand-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <BrainCircuit size={13} color="white" />
                                    </div>
                                )}
                                <div style={{
                                    maxWidth: '78%',
                                    padding: '0.6rem 0.9rem',
                                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                    background: msg.role === 'user' ? 'var(--color-dark)' : 'white',
                                    color: msg.role === 'user' ? 'white' : 'var(--color-text-primary)',
                                    fontSize: '0.85rem', lineHeight: 1.65,
                                    border: msg.role === 'bot' ? '1px solid rgba(0,0,0,0.07)' : 'none',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                    whiteSpace: 'pre-line',
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {typing && (
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-brand-accent), var(--color-brand-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <BrainCircuit size={13} color="white" />
                                </div>
                                <div style={{ padding: '0.65rem 1rem', borderRadius: '16px 16px 16px 4px', background: 'white', border: '1px solid rgba(0,0,0,0.07)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                                    {[0, 1, 2].map(i => (
                                        <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-text-muted)', animation: `blink 1.2s ease ${i * 0.2}s infinite` }} />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Quick replies */}
                    {messages.length <= 1 && (
                        <div style={{ padding: '0.5rem 1rem 0', background: '#fafaf9', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                            {QUICK_REPLIES.map(q => (
                                <button key={q} onClick={() => sendMessage(q)} style={{
                                    fontSize: '0.75rem', padding: '0.32rem 0.75rem',
                                    borderRadius: '999px', border: '1px solid rgba(0,0,0,0.1)',
                                    background: 'white', color: 'var(--color-text-secondary)',
                                    cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                                }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-dark)'; (e.currentTarget as HTMLElement).style.color = 'white'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'white'; (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.1)'; }}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: '0.5rem', background: 'white' }}>
                        <input
                            value={input} onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                            placeholder="Ask anything…"
                            style={{
                                flex: 1, padding: '0.55rem 0.85rem', borderRadius: '999px',
                                border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.85rem',
                                outline: 'none', fontFamily: 'inherit', color: 'var(--color-text-primary)',
                                background: '#f5f5f4', transition: 'border-color 0.15s',
                            }}
                            onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--color-brand-primary)'}
                            onBlur={e => (e.target as HTMLElement).style.borderColor = 'rgba(0,0,0,0.1)'}
                        />
                        <button onClick={() => sendMessage(input)} style={{
                            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                            background: input.trim() ? 'var(--color-dark)' : 'rgba(0,0,0,0.06)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s', cursor: input.trim() ? 'pointer' : 'default',
                        }}>
                            <Send size={15} color={input.trim() ? 'white' : '#aaa'} />
                        </button>
                    </div>
                </div>
            )}

            {/* Bubble trigger */}
            <button
                onClick={() => setOpen(o => !o)}
                aria-label="Open chat"
                style={{
                    position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 200,
                    width: 54, height: 54, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-brand-accent), var(--color-brand-primary))',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(224,79,42,0.45), 0 2px 8px rgba(0,0,0,0.18)',
                    transition: 'all 0.2s ease',
                    animation: open ? 'none' : 'pulseRing 3s ease infinite',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(224,79,42,0.55), 0 2px 8px rgba(0,0,0,0.18)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(224,79,42,0.45), 0 2px 8px rgba(0,0,0,0.18)'; }}
            >
                {open ? <X size={20} color="white" /> : <BrainCircuit size={22} color="white" />}

                {/* Unread dot */}
                {!open && (
                    <div style={{
                        position: 'absolute', top: 2, right: 2,
                        width: 12, height: 12, borderRadius: '50%',
                        background: '#22c55e', border: '2px solid white',
                        animation: 'blink 2s ease infinite',
                    }} />
                )}
            </button>
        </>
    );
}
