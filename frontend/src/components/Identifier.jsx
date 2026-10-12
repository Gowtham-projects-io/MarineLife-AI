import React, { useState, useRef } from 'react';
import { UploadCloud, Sparkles, AlertTriangle, CheckCircle2, Clock, MapPin, BookmarkPlus, ArrowRight, Image as ImageIcon } from 'lucide-react';

const SAMPLE_SPECIES = [
  { id: 'chelonia_mydas', name: 'Green Sea Turtle', file: '/samples/chelonia_mydas.jpg' },
  { id: 'amphiprion_ocellaris', name: 'Clown Anemonefish', file: '/samples/amphiprion_ocellaris.jpg' },
  { id: 'carcharodon_carcharias', name: 'Great White Shark', file: '/samples/carcharodon_carcharias.jpg' },
  { id: 'mobula_birostris', name: 'Giant Manta Ray', file: '/samples/mobula_birostris.jpg' },
  { id: 'hippocampus_whitei', name: "White's Seahorse", file: '/samples/hippocampus_whitei.jpg' },
  { id: 'octopus_vulgaris', name: 'Common Octopus', file: '/samples/octopus_vulgaris.jpg' },
  { id: 'aurelia_aurita', name: 'Moon Jellyfish', file: '/samples/aurelia_aurita.jpg' },
  { id: 'balaenoptera_musculus', name: 'Blue Whale', file: '/samples/balaenoptera_musculus.jpg' },
];

export default function Identifier({ onSaveObservation, onInspectSpecies }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPrediction(null);
    setError(null);
  };

  const handleSelectSample = async (sample) => {
    setError(null);
    setPrediction(null);
    setPreviewUrl(sample.file);
    setIsAnalyzing(true);

    try {
      // Fetch the sample image blob
      const res = await fetch(sample.file);
      const blob = await res.blob();
      const file = new File([blob], `${sample.id}.jpg`, { type: 'image/jpeg' });
      setSelectedFile(file);

      // Perform inference
      await runInference(file);
    } catch (err) {
      setError(`Failed to load specimen sample: ${err.message}`);
      setIsAnalyzing(false);
    }
  };

  const runInference = async (fileToPredict = selectedFile) => {
    if (!fileToPredict) return;
    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', fileToPredict);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error (${response.status})`);
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err.message || 'Image prediction failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusBadge = (iucnCode, statusName) => {
    const code = (iucnCode || '').toUpperCase();
    if (code === 'CR') return <span className="badge-iucn-cr">CR • Critically Endangered</span>;
    if (code === 'EN') return <span className="badge-iucn-en">EN • Endangered</span>;
    if (code === 'VU') return <span className="badge-iucn-vu">VU • Vulnerable</span>;
    if (code === 'LC') return <span className="badge-iucn-lc">LC • Least Concern</span>;
    return <span className="badge-iucn-ne">{statusName || 'Protected'}</span>;
  };

  return (
    <div className="responsive-container">
      {/* Title & Introduction Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(77, 238, 234, 0.1)',
          color: 'var(--color-bio-cyan)',
          padding: '0.35rem 0.95rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.82rem',
          fontWeight: 600,
          border: '1px solid var(--color-border-cyan)',
          marginBottom: '0.8rem'
        }}>
          <Sparkles size={14} />
          PyTorch MobileNetV3 Transfer Learning Model
        </div>
        <h1 className="responsive-title" style={{
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #FFFFFF 30%, var(--color-bio-cyan) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.6rem'
        }}>
          AI Marine Species Identification
        </h1>
        <p className="responsive-desc" style={{ maxWidth: '680px', margin: '0 auto' }}>
          Upload high-resolution underwater or coastal photographs. Our real fine-tuned PyTorch vision model analyzes morphology, coloration, and patterns to predict the top three marine species with confidence scoring.
        </p>
      </div>

      {/* Quick Test Specimens Bar */}
      <div className="glass-panel" style={{ padding: '1rem clamp(0.85rem, 2vw, 1.2rem)', marginBottom: '1.8rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-bio-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ImageIcon size={15} /> One-Click Specimen Benchmark Samples:
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Select any specimen to test actual model prediction instantly
          </span>
        </div>
        <div className="touch-scroll-row">
          {SAMPLE_SPECIES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.42rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(7, 27, 43, 0.75)',
                border: '1px solid rgba(77, 238, 234, 0.2)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontSize: '0.82rem',
                fontWeight: 500,
                transition: 'var(--transition-smooth)',
                flexShrink: 0
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-bio-cyan)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(77, 238, 234, 0.2)'}
            >
              <img
                src={sample.file}
                alt={sample.name}
                style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span>{sample.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Upload Area & Results */}
      <div className="grid-2col-responsive">
        {/* Left Column: Upload & Live Preview */}
        <div className="glass-panel-elevated" style={{ padding: 'clamp(1.2rem, 3vw, 2rem)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UploadCloud size={20} color="var(--color-bio-cyan)" />
            Specimen Upload &amp; Preview
          </h2>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: 'relative',
              border: '2px dashed rgba(77, 238, 234, 0.35)',
              borderRadius: 'var(--radius-md)',
              minHeight: '340px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: 'rgba(7, 27, 43, 0.5)',
              overflow: 'hidden',
              transition: 'var(--transition-smooth)',
              textAlign: 'center',
              padding: '1.5rem'
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
            />

            {previewUrl ? (
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <img
                  src={previewUrl}
                  alt="Specimen preview"
                  style={{
                    width: '100%',
                    maxHeight: '340px',
                    objectFit: 'contain',
                    borderRadius: 'var(--radius-sm)'
                  }}
                />
                {isAnalyzing && <div className="scan-beam" />}
              </div>
            ) : (
              <div>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(77, 238, 234, 0.1)',
                  color: 'var(--color-bio-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto'
                }}>
                  <UploadCloud size={32} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Drag &amp; Drop marine photo here
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                  Supports JPEG, PNG, WebP up to 15MB
                </p>
                <span className="btn-secondary" style={{ fontSize: '0.8rem' }}>
                  Browse Local Files
                </span>
              </div>
            )}
          </div>

          {/* Action Trigger */}
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.8rem' }}>
            <button
              onClick={() => runInference()}
              disabled={!selectedFile || isAnalyzing}
              className="btn-primary"
              style={{
                flex: 1,
                justifyContent: 'center',
                opacity: (!selectedFile || isAnalyzing) ? 0.6 : 1,
                cursor: (!selectedFile || isAnalyzing) ? 'not-allowed' : 'pointer'
              }}
            >
              {isAnalyzing ? (
                <>
                  <div className="radar-pulse" style={{ background: '#071B2B' }} />
                  <span>Classifying Specimen...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Analyze Specimen with AI</span>
                </>
              )}
            </button>
            {previewUrl && (
              <button
                onClick={() => { setSelectedFile(null); setPreviewUrl(null); setPrediction(null); setError(null); }}
                className="btn-outline"
                style={{ padding: '0.65rem 1rem' }}
              >
                Clear
              </button>
            )}
          </div>

          {error && (
            <div style={{
              marginTop: '1.2rem',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#FCA5A5',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Column: Top 3 Predictions & Biological Intelligence */}
        <div className="glass-panel-elevated" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={20} color="var(--color-bio-cyan)" />
              Top 3 Species Predictions
            </h2>
            {prediction && (
              <span style={{ fontSize: '0.78rem', color: 'var(--color-bio-cyan)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={13} /> {prediction.inference_time_ms} ms
              </span>
            )}
          </div>

          {!prediction && !isAnalyzing && (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-secondary)',
              textAlign: 'center',
              padding: '2rem'
            }}>
              <ImageIcon size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p style={{ fontSize: '0.95rem', maxWidth: '340px' }}>
                Select an image on the left or click a benchmark sample above to trigger real neural network inference.
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem 1rem',
              textAlign: 'center'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                border: '3px solid rgba(77, 238, 234, 0.2)',
                borderTopColor: 'var(--color-bio-cyan)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '1.2rem'
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-bio-cyan)' }}>
                Evaluating Morphological Features
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.4rem' }}>
                Running PyTorch MobileNetV3 forward pass across 10 marine taxonomic classes...
              </p>
            </div>
          )}

          {prediction && !isAnalyzing && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Confidence Alert Banner if low confidence */}
              {!prediction.is_confident && (
                <div style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(234, 179, 8, 0.15)',
                  border: '1px solid rgba(234, 179, 8, 0.4)',
                  color: '#FDE047',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem'
                }}>
                  <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '2px' }}>Low Confidence Fallback</strong>
                    {prediction.warning || prediction.message}
                  </div>
                </div>
              )}

              {/* Primary / Top Match Card */}
              {prediction.top_species && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(11, 46, 79, 0.8), rgba(7, 27, 43, 0.9))',
                  border: '1px solid var(--color-bio-cyan)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.3rem',
                  boxShadow: 'var(--shadow-glow-cyan)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{
                          background: 'var(--color-bio-cyan)',
                          color: '#071B2B',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px'
                        }}>
                          PRIMARY MATCH
                        </span>
                        {getStatusBadge(prediction.top_species.iucn_code, prediction.top_species.conservation_status)}
                      </div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>
                        {prediction.top_species.common_name}
                      </h3>
                      <p style={{ fontStyle: 'italic', color: 'var(--color-bio-cyan)', fontSize: '0.9rem' }}>
                        {prediction.top_species.scientific_name}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-bio-cyan)', fontFamily: 'var(--font-mono)' }}>
                        {prediction.top_species.confidence_percentage}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                        Certainty
                      </span>
                    </div>
                  </div>

                  {/* Confidence Progress Bar */}
                  <div style={{
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    overflow: 'hidden',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      height: '100%',
                      width: prediction.top_species.confidence_percentage,
                      background: 'linear-gradient(90deg, var(--color-ocean-teal), var(--color-bio-cyan))',
                      boxShadow: '0 0 10px var(--color-bio-cyan)'
                    }} />
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {prediction.top_species.habitat}
                  </p>

                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => onSaveObservation({
                        species_id: prediction.top_species.species_id,
                        species_name: prediction.top_species.common_name,
                        confidence: prediction.top_species.confidence,
                        image_url: previewUrl
                      })}
                      className="btn-primary"
                      style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
                    >
                      <BookmarkPlus size={15} />
                      <span>Log to Sightings</span>
                    </button>
                    <button
                      onClick={() => onInspectSpecies(prediction.top_species.species_id)}
                      className="btn-secondary"
                      style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
                    >
                      <span>Species Profile</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Second & Third Ranked Predictions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Alternative Candidates (Top 2 &amp; 3):
                </span>

                {prediction.top_predictions.slice(1).map((pred, i) => (
                  <div
                    key={pred.species_id}
                    style={{
                      backgroundColor: 'rgba(7, 27, 43, 0.65)',
                      border: '1px solid rgba(77, 238, 234, 0.15)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.85rem 1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                          #{i + 2}
                        </span>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                          {pred.common_name}
                        </strong>
                        <span style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
                          ({pred.scientific_name})
                        </span>
                      </div>
                      <div style={{ marginTop: '0.2rem' }}>
                        {getStatusBadge(pred.iucn_code, pred.conservation_status)}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', minWidth: '90px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-ocean-teal)', fontFamily: 'var(--font-mono)' }}>
                        {pred.confidence_percentage}
                      </span>
                      <div style={{
                        height: '4px',
                        width: '80px',
                        borderRadius: '2px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        overflow: 'hidden',
                        marginTop: '4px'
                      }}>
                        <div style={{
                          height: '100%',
                          width: pred.confidence_percentage,
                          background: 'var(--color-ocean-teal)'
                        }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
