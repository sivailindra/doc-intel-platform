'use client';
import { useState, useCallback } from 'react';
import Link from 'next/link';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setResult(data.data);
        // Save to mock officer queue
        const existingQueueStr = localStorage.getItem('officerQueue');
        const existingQueue = existingQueueStr ? JSON.parse(existingQueueStr) : [];
        existingQueue.push({
          id: Date.now().toString(),
          date: new Date().toISOString(),
          ...data.data
        });
        localStorage.setItem('officerQueue', JSON.stringify(existingQueue));
      } else {
        alert("Processing failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting API");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="brand-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Document Intelligence
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/officer" className="btn btn-secondary">
            Officer Dashboard
          </Link>
          <div className="badge badge-info" style={{ alignSelf: 'center' }}>Agent Context</div>
        </div>
      </nav>

      <main className="container main-content">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Service Center Portal</h1>
          <p style={{ textAlign: 'center', color: 'var(--color-neutral-700)', marginBottom: '3rem' }}>
            Upload citizen documents to automatically classify, extract, and verify authenticity.
          </p>

          {!isProcessing && !result && (
            <div className="glass-card" style={{ marginBottom: '2rem' }}>
              <div
                className={`upload-zone ${isDragging ? 'active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
                  }}
                />

                <div className="upload-icon">📄</div>
                <div>
                  <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-brand-primary)' }}>
                    {file ? file.name : "Drag & drop document here"}
                  </h3>
                  <p style={{ color: 'var(--color-neutral-700)', fontSize: '0.875rem' }}>
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "or click to select file (PDF, JPG, PNG)"}
                  </p>
                </div>

                {file && (
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProcess();
                    }}
                    style={{ marginTop: '1rem' }}
                  >
                    Process Document
                  </button>
                )}
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div className="animate-pulse" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-brand-primary)', margin: '0 auto 2rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                  <line x1="16" y1="5" x2="22" y2="5"></line>
                  <line x1="19" y1="2" x2="19" y2="8"></line>
                  <circle cx="9" cy="9" r="2"></circle>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
              </div>
              <h2 style={{ marginBottom: '1rem' }}>Extracting & Validating</h2>
              <div className="loading-skeleton" style={{ height: '8px', width: '60%', margin: '0 auto', borderRadius: '4px' }}></div>
              <p style={{ color: 'var(--color-neutral-700)', marginTop: '1rem', fontSize: '0.875rem' }}>
                Running OCR, Template Cross-Check, and Fraud Scans...
              </p>
            </div>
          )}

          {result && !isProcessing && (
            <div className="glass-card" style={{ animation: 'var(--transition-normal)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-neutral-200)', paddingBottom: '1rem' }}>
                <div>
                  <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {result.template_name}
                    <span className={`badge ${result.authenticity_verified ? 'badge-success' : 'badge-danger'}`}>
                      {result.authenticity_verified ? 'Verified Clean' : 'Flags Detected'}
                    </span>
                  </h2>
                  <p style={{ color: 'var(--color-neutral-700)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    Dept: {result.department} | Overall Confidence: {result.overall_confidence}%
                  </p>
                </div>
                <button className="btn btn-secondary" onClick={() => { setFile(null); setResult(null); }}>
                  Scan Another
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Extracted Fields</h3>
                  <div style={{ background: 'var(--color-neutral-50)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--color-neutral-200)' }}>
                    {Object.entries(result.extracted_fields).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px dashed var(--color-neutral-200)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--color-neutral-700)', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                        <span style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {val as string}
                          <span style={{ fontSize: '0.75rem', color: result.confidence_scores[key] > 90 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                            {result.confidence_scores[key]}%
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Processing Notes</h3>
                  {result.flags && result.flags.length > 0 ? (
                    <div style={{ background: 'rgba(239, 68, 68, 0.05)', borderLeft: '4px solid var(--color-danger)', padding: '1rem', borderRadius: '0 0.5rem 0.5rem 0' }}>
                      <h4 style={{ color: 'var(--color-danger)', marginBottom: '0.5rem' }}>⚠️ Action Required</h4>
                      <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--color-neutral-900)' }}>
                        {result.flags.map((flag: string, i: number) => (
                          <li key={i} style={{ marginBottom: '0.25rem' }}>{flag}</li>
                        ))}
                      </ul>
                      <p style={{ marginTop: '1rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        Document sent to Officer Queue for manual review.
                      </p>
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(16, 185, 129, 0.05)', borderLeft: '4px solid var(--color-success)', padding: '1rem', borderRadius: '0 0.5rem 0.5rem 0' }}>
                      <h4 style={{ color: 'var(--color-success)', marginBottom: '0.5rem' }}>✅ Authenticity Verified</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-900)' }}>
                        All layout markers matched successfully. Added to Department DB.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
