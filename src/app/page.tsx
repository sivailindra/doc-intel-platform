'use client';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import { FileUp, ShieldCheck, Activity, BrainCircuit, XCircle, FileText } from 'lucide-react'; // Need to add lucide-react

interface ExtractionResult {
  id: string;
  filename: string;
  template_name: string;
  department: string;
  extracted_fields: Record<string, string | null>;
  confidence_scores: Record<string, number>;
  overall_confidence: number;
  authenticity_verified: boolean;
  flags: string[];
  status: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ExtractionResult | null>(null);

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
          id: data.data.id || Date.now().toString(),
          date: new Date().toISOString(),
          ...data.data
        });
        localStorage.setItem('officerQueue', JSON.stringify(existingQueue));
      } else {
        alert(data.error || "Processing failed!");
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
          <BrainCircuit size={28} />
          <span>DocIntel<span style={{ color: "var(--color-text-primary)", opacity: 0.9 }}>Platform</span></span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="badge badge-info">AI Governance Layer</div>
          <Link href="/officer" className="btn btn-secondary">
            Officer Portal
          </Link>
        </div>
      </nav>

      <main className="container" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          {/* Hero Section */}
          {!isProcessing && !result && (
            <div style={{ textAlign: 'center', marginBottom: '4rem', animation: 'var(--transition-slow)' }}>
              <div className="badge badge-info" style={{ marginBottom: '1.5rem' }}>Next-Gen AI Extraction</div>
              <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
                Automate Forms with <br />
                <span className="text-gradient">Governance-Grade Reliability</span>
              </h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.8 }}>
                Upload applicant forms and templates to digitize, classify, and extract 16 distinct data fields instantly. Backed by Google Gemini LLM for superior accuracy and integrated fraud-detection.
              </p>
            </div>
          )}

          {/* Upload Zone */}
          {!isProcessing && !result && (
            <div className="glass-panel" style={{ maxWidth: '700px', margin: '0 auto' }}>
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

                <div className="upload-icon-wrapper animate-float">
                  <FileUp size={36} />
                </div>

                <div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    {file ? file.name : "Select or Drop Document"}
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB • PDF or Image` : "Supports PDF, JPG, PNG"}
                  </p>
                </div>

                {file && (
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProcess();
                    }}
                    style={{ marginTop: '1rem', width: '100%', maxWidth: '300px' }}
                  >
                    Analyze and Extract <Activity size={18} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isProcessing && (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
              <div className="upload-icon-wrapper animate-pulse-glow" style={{ margin: '0 auto 2rem auto', background: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary))', color: 'white' }}>
                <BrainCircuit size={36} className="animate-float" />
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Extracting Intelligence...</h2>
              <div style={{ height: '4px', width: '200px', background: 'rgba(255,255,255,0.1)', margin: '0 auto', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '50%', background: 'var(--color-brand-primary)', animation: 'float 1s ease-in-out infinite alternate' }}></div>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: '2rem' }}>
                Running Gemini OCR, Structured Classification, and Authenticity Checks.
              </p>
            </div>
          )}

          {/* Results State */}
          {result && !isProcessing && (
            <div style={{ animation: 'var(--transition-normal)' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <button className="btn btn-secondary" onClick={() => { setFile(null); setResult(null); }}>
                  ← Upload Another
                </button>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="badge badge-info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={14} /> ID: {result.id.substring(0, 8)}...
                  </div>
                </div>
              </div>

              <div className="glass-panel" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {result.template_name}
                      {result.authenticity_verified ? (
                        <span className="badge badge-success"><ShieldCheck size={14} style={{ marginRight: '4px' }} /> Verified Clean</span>
                      ) : (
                        <span className="badge badge-danger"><XCircle size={14} style={{ marginRight: '4px' }} /> Flagged</span>
                      )}
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                      Match: {result.department} &bull; Overall Confidence Payload: <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{result.overall_confidence}%</span>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>

                  {/* Left Column: Dense Data Extraction */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        Extracted Data Elements
                      </h3>
                      <span className="badge badge-info">16 Fields</span>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.5rem', maxHeight: '500px', overflowY: 'auto' }}>
                      {result.extracted_fields && Object.entries(result.extracted_fields).map(([key, val]) => {
                        const confScore = result.confidence_scores ? result.confidence_scores[key] : 0;
                        return (
                          <div key={key} className="data-row">
                            <span className="data-label">{key}</span>
                            <span className="data-value">
                              {val !== null && val !== "" ? String(val) : <span style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Missing</span>}

                              {confScore !== undefined && val !== null && val !== "" && (
                                <span style={{
                                  padding: '0.1rem 0.4rem',
                                  borderRadius: '4px',
                                  fontSize: '0.7rem',
                                  marginLeft: '0.5rem',
                                  background: confScore > 85 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                  color: confScore > 85 ? '#6ee7b7' : '#fcd34d'
                                }}>
                                  {confScore}%
                                </span>
                              )}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Right Column: Alerts & Status */}
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Governance Trace</h3>

                    {result.flags && result.flags.length > 0 ? (
                      <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                        <h4 style={{ color: '#fca5a5', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <XCircle size={18} /> Action Required
                        </h4>
                        <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-primary)', marginBottom: '1.5rem' }}>
                          {result.flags.map((flag: string, i: number) => (
                            <li key={i} style={{ marginBottom: '0.5rem' }}>{flag}</li>
                          ))}
                        </ul>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                          Alert: This document has been routed to the Officer Portal for manual remediation. AI detected anomalies matching fraud signatures.
                        </p>
                      </div>
                    ) : (
                      <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                        <h4 style={{ color: '#6ee7b7', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <ShieldCheck size={18} /> Authenticity Verified
                        </h4>
                        <p style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
                          No structural anomalies or tampering found. Image clarity is sufficient.
                        </p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                          Record cleanly committed to the database. Officer review is optional.
                        </p>
                      </div>
                    )}

                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
