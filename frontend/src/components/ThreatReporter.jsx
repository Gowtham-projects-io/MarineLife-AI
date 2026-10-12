import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, UploadCloud, MapPin, CheckCircle2, Info, Filter, Camera } from 'lucide-react';

export default function ThreatReporter({ isOpenModal, onCloseModal }) {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const [formData, setFormData] = useState({
    threat_type: 'Plastic Pollution',
    description: '',
    severity: 'Medium',
    location_name: '',
    latitude: null,
    longitude: null,
    image_url: '',
    reporter_contact: '',
  });

  useEffect(() => {
    fetchThreats();
  }, []);

  const fetchThreats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/threats');
      const data = await res.json();
      setThreats(data);
    } catch (err) {
      console.error('Failed to load threats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await res.json();
      setFormData((prev) => ({ ...prev, image_url: data.url }));
    } catch (err) {
      alert(`Image upload error: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.location_name) {
      alert('Please provide a hazard description and location.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/threats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to submit marine threat incident.');
      }

      setSuccessMessage('Incident logged successfully! Marked as "Unverified" pending marine ranger inspection.');
      setFormData({
        threat_type: 'Plastic Pollution',
        description: '',
        severity: 'Medium',
        location_name: '',
        latitude: null,
        longitude: null,
        image_url: '',
        reporter_contact: '',
      });
      await fetchThreats();
      setTimeout(() => setSuccessMessage(null), 6000);
      if (onCloseModal) onCloseModal();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredThreats = threats.filter((th) => {
    if (filterType === 'ALL') return true;
    return th.threat_type === filterType;
  });

  return (
    <div className={isOpenModal ? "" : "responsive-container"} style={isOpenModal ? {} : {}}>
      {/* Title */}
      {!isOpenModal && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-coral)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <ShieldAlert size={16} /> UN SDG 14.1 Marine Pollution &amp; Habitat Threat Monitoring
          </div>
          <h1 className="responsive-title" style={{
            background: 'linear-gradient(135deg, #FFFFFF, var(--color-coral))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginTop: '0.3rem',
            marginBottom: '0.5rem'
          }}>
            Marine Threat &amp; Ecological Hazard Reporting
          </h1>
          <p className="responsive-desc" style={{ maxWidth: '780px' }}>
            Empowering coastal communities and divers to rapidly alert conservation authorities to plastic slicks, abandoned ghost nets, injured wildlife, and localized spills. All community submissions are marked as <strong>Unverified</strong> until assessed by certified ocean rangers.
          </p>
        </div>
      )}

      {successMessage && (
        <div style={{
          padding: '1rem 1.4rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(0, 191, 166, 0.2)',
          border: '1px solid var(--color-ocean-teal)',
          color: '#E0F2FE',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem'
        }}>
          <CheckCircle2 size={20} color="var(--color-ocean-teal)" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Grid: Reporting Form & Active Reports Stream */}
      <div className={isOpenModal ? "" : "grid-2col-responsive"}>
        {/* Left: Report Submission Form */}
        <div className="glass-panel-elevated" style={{ padding: 'clamp(1.2rem, 3vw, 2rem)' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.4rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertTriangle size={20} color="var(--color-coral)" />
            Log Marine Ecological Hazard
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            Provide accurate geographic details and evidence photos to assist rapid response teams.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Threat Type */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                Hazard Classification *
              </label>
              <select
                value={formData.threat_type}
                onChange={(e) => setFormData((prev) => ({ ...prev, threat_type: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-coral)',
                  backgroundColor: 'rgba(7, 27, 43, 0.9)',
                  color: 'var(--color-text-primary)',
                  outline: 'none'
                }}
              >
                <option value="Plastic Pollution">Plastic Pollution / Macro-debris Slick</option>
                <option value="Ghost Gear / Entanglement">Ghost Gear / Derelict Fishing Nets</option>
                <option value="Injured Marine Animal">Injured / Stranded Marine Wildlife</option>
                <option value="Oil/Chemical Spill">Oil Slick / Chemical Discharge</option>
                <option value="Coral Bleaching">Severe Coral Bleaching / Tissue Loss</option>
                <option value="Illegal Fishing">Illegal / Unregulated Fishing Activity</option>
              </select>
            </div>

            {/* Severity Indicator */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                Ecological Severity Level
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {['Low', 'Medium', 'High', 'Critical'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, severity: lvl }))}
                    style={{
                      padding: '0.55rem 0',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: formData.severity === lvl ? '1px solid var(--color-coral)' : '1px solid rgba(255, 128, 102, 0.2)',
                      backgroundColor: formData.severity === lvl ? 'rgba(255, 128, 102, 0.25)' : 'rgba(7, 27, 43, 0.6)',
                      color: formData.severity === lvl ? 'var(--color-coral)' : 'var(--color-text-secondary)',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Location & GPS */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                Location Name / Landmark *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Moreton Bay northern channel, QLD"
                value={formData.location_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, location_name: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-cyan)',
                  backgroundColor: 'rgba(7, 27, 43, 0.9)',
                  color: 'var(--color-text-primary)',
                  outline: 'none'
                }}
              />
            </div>

            {/* Incident Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                Detailed Incident Description *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe animal species if injured, extent of debris slick, current drift direction, depth, or hazards to marine traffic..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-cyan)',
                  backgroundColor: 'rgba(7, 27, 43, 0.9)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Photo Attachment */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                Visual Photographic Evidence
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}
              />
              {uploadingImage && <span style={{ fontSize: '0.8rem', color: 'var(--color-coral)' }}>Uploading image...</span>}
              {formData.image_url && (
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <img src={formData.image_url} alt="Attached hazard" style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }} />
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-coral)' }}>Evidence photo attached</span>
                </div>
              )}
            </div>

            {/* Verification Notice */}
            <div style={{
              padding: '0.8rem 1rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255, 128, 102, 0.12)',
              border: '1px solid var(--color-border-coral)',
              fontSize: '0.8rem',
              color: '#FFB3A3',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              lineHeight: 1.4
            }}>
              <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                <strong>Verification Protocol:</strong> This report will be registered with status <strong>"Unverified"</strong> to maintain scientific and operational integrity until validated by ocean conservation authorities.
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-coral"
              style={{ justifyContent: 'center', marginTop: '0.5rem' }}
            >
              {isSubmitting ? 'Logging Hazard Incident...' : 'Submit Incident Report'}
            </button>
          </form>
        </div>

        {/* Right: Existing Threat Incident Logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FFFFFF' }}>
              Logged Threat Feed ({filteredThreats.length})
            </h2>

            {/* Category Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border-coral)',
                backgroundColor: 'rgba(7, 27, 43, 0.85)',
                color: 'var(--color-text-primary)',
                fontSize: '0.8rem'
              }}
            >
              <option value="ALL">All Threat Types</option>
              <option value="Plastic Pollution">Plastic Pollution</option>
              <option value="Ghost Gear / Entanglement">Ghost Gear</option>
              <option value="Injured Marine Animal">Injured Animal</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '720px', overflowY: 'auto' }}>
            {filteredThreats.map((th) => (
              <div
                key={th.id}
                className="glass-panel"
                style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', borderLeft: '4px solid var(--color-coral)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span className="badge-unverified">
                        <span className="radar-pulse" />
                        {th.status}
                      </span>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        background: th.severity === 'Critical' ? 'rgba(239,68,68,0.25)' : 'rgba(255,128,102,0.25)',
                        color: th.severity === 'Critical' ? '#FCA5A5' : 'var(--color-coral)'
                      }}>
                        {th.severity} Severity
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>
                      {th.threat_type}
                    </h3>
                  </div>

                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    📅 {new Date(th.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                  {th.image_url && (
                    <img
                      src={th.image_url}
                      alt={th.threat_type}
                      style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-bio-cyan)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.3rem' }}>
                      <MapPin size={13} /> {th.location_name}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                      {th.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
