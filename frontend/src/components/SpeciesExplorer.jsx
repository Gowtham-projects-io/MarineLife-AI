import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, ShieldCheck, AlertCircle, Compass, ChevronRight, X, BookOpen, Globe, Anchor } from 'lucide-react';

export default function SpeciesExplorer({ selectedSpeciesId, onCloseModal }) {
  const [speciesList, setSpeciesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeSpecies, setActiveSpecies] = useState(null);

  useEffect(() => {
    fetchSpecies();
  }, [statusFilter]);

  useEffect(() => {
    if (selectedSpeciesId && speciesList.length > 0) {
      const match = speciesList.find((s) => s.id === selectedSpeciesId);
      if (match) setActiveSpecies(match);
    }
  }, [selectedSpeciesId, speciesList]);

  const fetchSpecies = async () => {
    setLoading(true);
    try {
      let url = '/api/species';
      if (statusFilter !== 'ALL') {
        url += `?iucn_status=${encodeURIComponent(statusFilter)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setSpeciesList(data);
    } catch (err) {
      console.error('Failed to fetch species catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSpecies = speciesList.filter((s) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.common_name.toLowerCase().includes(term) ||
      s.scientific_name.toLowerCase().includes(term) ||
      s.habitat.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (iucnCode, statusName) => {
    const code = (iucnCode || '').toUpperCase();
    if (code === 'CR') return <span className="badge-iucn-cr">CR • Critically Endangered</span>;
    if (code === 'EN') return <span className="badge-iucn-en">EN • Endangered</span>;
    if (code === 'VU') return <span className="badge-iucn-vu">VU • Vulnerable</span>;
    if (code === 'LC') return <span className="badge-iucn-lc">LC • Least Concern</span>;
    return <span className="badge-iucn-ne">{statusName || 'Protected'}</span>;
  };

  const parseJsonSafe = (raw, fallback = []) => {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return [raw];
    }
  };

  return (
    <div className="responsive-container">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-ocean-teal)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Compass size={16} /> Marine Biodiversity Catalog
        </div>
        <h1 className="responsive-title" style={{
          background: 'linear-gradient(135deg, #FFFFFF, var(--color-bio-cyan))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginTop: '0.3rem',
          marginBottom: '0.5rem'
        }}>
          Species Explorer &amp; Conservation Status
        </h1>
        <p className="responsive-desc" style={{ maxWidth: '780px' }}>
          Curated encyclopedia of marine life cataloged under UN SDG 14: Life Below Water. Features verified IUCN Red List conservation ratings, ecological threats, scientific references, and actionable preservation strategies.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel species-filter-bar">
        {/* Search */}
        <div className="species-search-box">
          <Search size={18} color="var(--color-text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="species-search-input"
            placeholder="Search species name, scientific, or habitat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* IUCN Status Filter Buttons */}
        <div className="touch-scroll-row species-status-filters">
          {[
            { label: 'All Statuses', value: 'ALL' },
            { label: 'Endangered', value: 'Endangered' },
            { label: 'Vulnerable', value: 'Vulnerable' },
            { label: 'Least Concern', value: 'Least Concern' }
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`filter-chip ${statusFilter === f.value ? 'active' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Species Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div className="radar-pulse" style={{ width: '16px', height: '16px', background: 'var(--color-bio-cyan)' }} />
          <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>Loading marine species profiles...</p>
        </div>
      ) : (
        <div className="grid-cards-responsive">
          {filteredSpecies.map((sp) => (
            <div
              key={sp.id}
              className="glass-panel"
              onClick={() => setActiveSpecies(sp)}
              style={{
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'var(--color-bio-cyan)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card), var(--shadow-glow-cyan)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--color-border-cyan)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
              }}
            >
              {/* Photo Thumbnail */}
              <div style={{ height: '210px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={sp.image_url}
                  alt={sp.common_name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `${import.meta.env.BASE_URL}samples/${sp.id}.jpg`;
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px'
                }}>
                  {getStatusBadge(sp.iucn_code, sp.conservation_status)}
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '12px',
                  background: 'rgba(7, 27, 43, 0.85)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  color: 'var(--color-bio-cyan)',
                  border: '1px solid rgba(77, 238, 234, 0.3)'
                }}>
                  Class: {sp.class_taxonomy}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.2rem' }}>
                    {sp.common_name}
                  </h3>
                  <p style={{ fontSize: '0.88rem', fontStyle: 'italic', color: 'var(--color-bio-cyan)', marginBottom: '0.65rem' }}>
                    {sp.scientific_name}
                  </p>
                  <p style={{
                    fontSize: '0.82rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {sp.habitat}
                  </p>
                </div>

                <div style={{ marginTop: '1.2rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(77, 238, 234, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Depth: {sp.depth_range || 'Epipelagic'}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-ocean-teal)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    Profile <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comprehensive Scientific Profile Modal */}
      {activeSpecies && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(3, 13, 20, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(0.5rem, 2vw, 1.5rem)'
        }} onClick={() => setActiveSpecies(null)}>
          <div
            className="glass-panel-elevated modal-dialog-responsive"
            style={{
              maxWidth: '850px',
              width: '100%',
              maxHeight: '94vh',
              overflowY: 'auto',
              padding: 0,
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div style={{ height: 'clamp(200px, 32vh, 320px)', width: '100%', position: 'relative' }}>
              <img
                src={activeSpecies.image_url}
                alt={activeSpecies.common_name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `${import.meta.env.BASE_URL}samples/${activeSpecies.id}.jpg`;
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(7, 27, 43, 0.2) 0%, rgba(7, 27, 43, 0.95) 100%)'
              }} />

              {/* Close Button */}
              <button
                onClick={() => setActiveSpecies(null)}
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(7, 27, 43, 0.75)',
                  border: '1px solid var(--color-border-cyan)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ position: 'absolute', bottom: '16px', left: 'clamp(14px, 3vw, 24px)', right: 'clamp(14px, 3vw, 24px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                  {getStatusBadge(activeSpecies.iucn_code, activeSpecies.conservation_status)}
                  <span style={{ fontSize: '0.75rem', background: 'rgba(0, 191, 166, 0.25)', color: 'var(--color-ocean-teal)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                    {activeSpecies.sdg_alignment}
                  </span>
                </div>
                <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
                  {activeSpecies.common_name}
                </h2>
                <p style={{ fontSize: 'clamp(0.85rem, 2vw, 1.05rem)', fontStyle: 'italic', color: 'var(--color-bio-cyan)' }}>
                  {activeSpecies.scientific_name} • Family: {activeSpecies.family}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 'clamp(1.2rem, 3vw, 2rem)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Habitat & Distribution */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1.2rem' }}>
                <div style={{ background: 'rgba(11, 46, 79, 0.5)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(77, 238, 234, 0.15)' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--color-bio-cyan)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Anchor size={15} /> Habitat &amp; Depth Range
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
                    {activeSpecies.habitat}
                  </p>
                  <span style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                    Vertical Depth: {activeSpecies.depth_range || '0-100m'}
                  </span>
                </div>

                <div style={{ background: 'rgba(11, 46, 79, 0.5)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(77, 238, 234, 0.15)' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--color-ocean-teal)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Globe size={15} /> Geographic Distribution
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
                    {activeSpecies.geographic_range}
                  </p>
                  <span style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                    Population Trend: {activeSpecies.population_trend}
                  </span>
                </div>
              </div>

              {/* Major Threats */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-coral)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertCircle size={17} /> Major Anthropogenic Threats
                </h4>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {parseJsonSafe(activeSpecies.threats).map((threat, idx) => (
                    <li key={idx} style={{ marginBottom: '0.3rem' }}>{threat}</li>
                  ))}
                </ul>
              </div>

              {/* Conservation Actions */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-bio-cyan)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={17} /> UN SDG 14 Conservation Interventions
                </h4>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {parseJsonSafe(activeSpecies.conservation_actions).map((act, idx) => (
                    <li key={idx} style={{ marginBottom: '0.3rem' }}>{act}</li>
                  ))}
                </ul>
              </div>

              {/* Traceable Sources */}
              <div style={{ borderTop: '1px solid rgba(77, 238, 234, 0.15)', paddingTop: '1.2rem' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BookOpen size={15} /> Traceable Scientific Citations
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {parseJsonSafe(activeSpecies.traceable_sources).map((src, idx) => (
                    <a
                      key={idx}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
                    >
                      <span>{src.title}</span>
                      <ExternalLink size={12} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
