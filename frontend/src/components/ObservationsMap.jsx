import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import confetti from 'canvas-confetti';
import { MapPin, Plus, CheckCircle, ShieldAlert, Calendar, Camera, User, FileText, CheckSquare } from 'lucide-react';

export default function ObservationsMap({ prefilledObservation, onClearPrefill }) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [observations, setObservations] = useState([]);
  const [threats, setThreats] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);
  const [showObsModal, setShowObsModal] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    species_id: '',
    species_name: '',
    confidence: null,
    date_observed: new Date().toISOString().split('T')[0],
    location_name: '',
    latitude: -16.9203,
    longitude: 145.7710,
    notes: '',
    image_url: '',
    observer_name: 'Marine Citizen Scientist',
    consent_given: true,
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (prefilledObservation) {
      setFormData((prev) => ({
        ...prev,
        species_id: prefilledObservation.species_id || '',
        species_name: prefilledObservation.species_name || '',
        confidence: prefilledObservation.confidence || null,
        image_url: prefilledObservation.image_url || '',
      }));
      setShowObsModal(true);
      onClearPrefill?.();
    }
  }, [prefilledObservation]);

  const fetchData = async () => {
    try {
      const [obsRes, threatRes, speciesRes] = await Promise.all([
        fetch('/api/observations'),
        fetch('/api/threats'),
        fetch('/api/species')
      ]);
      const obsData = await obsRes.json();
      const threatData = await threatRes.json();
      const speciesData = await speciesRes.json();

      setObservations(obsData);
      setThreats(threatData);
      setSpeciesList(speciesData);
    } catch (err) {
      console.error('Failed to load observations or map data:', err);
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (leafletMapRef.current) return; // already initialized

    // Reset container if previously initialized by HMR or hot reload
    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id;
    }

    const map = L.map(mapContainerRef.current, {
      center: [-10, 130],
      zoom: 3,
      minZoom: 2,
      maxZoom: 18,
    });

    // 1. Esri Ocean Basemap with Bathymetry & Seabed Topography (UN SDG 14 tailored)
    const oceanBase = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri, GEBCO, NOAA, National Geographic',
        maxNativeZoom: 13,
        maxZoom: 18,
      }
    );

    const oceanRef = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}',
      {
        maxNativeZoom: 13,
        maxZoom: 18,
      }
    );

    const oceanGroup = L.layerGroup([oceanBase, oceanRef]);

    // 2. High-resolution Satellite Imagery
    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri, Earthstar Geographics, Maxar',
        maxNativeZoom: 18,
        maxZoom: 18,
      }
    );

    // 3. OpenStreetMap Cartographic
    const osmLayer = L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }
    );

    // Set default base layer to Ocean Bathymetry
    oceanGroup.addTo(map);

    // Add Base Layer Switcher Control
    const baseLayers = {
      '🌊 Ocean Bathymetry': oceanGroup,
      '🛰️ Satellite View': satelliteLayer,
      '🗺️ Street & Coastline': osmLayer,
    };
    L.control.layers(baseLayers, null, { position: 'topright' }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    leafletMapRef.current = map;

    // Handle map click to pin location
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      setSelectedCoords({ lat: parseFloat(lat.toFixed(4)), lng: parseFloat(lng.toFixed(4)) });
      setFormData((prev) => ({
        ...prev,
        latitude: parseFloat(lat.toFixed(4)),
        longitude: parseFloat(lng.toFixed(4)),
      }));
    });

    // Invalidate map size to ensure full rendering across screen widths and tab switches
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    const resizeObserver = new ResizeObserver(() => {
      if (leafletMapRef.current) {
        leafletMapRef.current.invalidateSize();
      }
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // Render markers when data updates
  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    // 1. Observation markers (Cyan)
    observations.forEach((obs) => {
      if (obs.latitude && obs.longitude) {
        const cyanIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `
            <div style="
              width: 22px; height: 22px;
              background: #4DEEEA;
              border: 2px solid #071B2B;
              border-radius: 50%;
              box-shadow: 0 0 14px #4DEEEA;
              display: flex; align-items: center; justify-content: center;
              cursor: pointer;
            ">
              <div style="width: 6px; height: 6px; background: #071B2B; border-radius: 50%;"></div>
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        const marker = L.marker([obs.latitude, obs.longitude], { icon: cyanIcon });
        marker.bindPopup(`
          <div style="min-width: 200px; padding: 6px; color: #F0F9FF;">
            ${obs.image_url ? `<img src="${obs.image_url}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />` : ''}
            <div style="font-size: 0.7rem; color: #4DEEEA; font-weight: 700; text-transform: uppercase;">Community Sighting</div>
            <h4 style="font-size: 1rem; margin: 2px 0 4px 0; color: #FFFFFF;">${obs.species_name}</h4>
            <div style="font-size: 0.78rem; color: #94A9C0; margin-bottom: 4px;">📍 ${obs.location_name}</div>
            <div style="font-size: 0.75rem; color: #94A9C0; margin-bottom: 4px;">📅 ${obs.date_observed} • By ${obs.observer_name}</div>
            ${obs.notes ? `<p style="font-size: 0.8rem; color: #CBD5E1; margin-top: 6px; border-top: 1px solid rgba(77,238,234,0.2); padding-top: 6px;">"${obs.notes}"</p>` : ''}
          </div>
        `);
        markersLayerRef.current.addLayer(marker);
      }
    });

    // 2. Threat markers (Coral)
    threats.forEach((th) => {
      if (th.latitude && th.longitude) {
        const coralIcon = L.divIcon({
          className: 'custom-map-marker-threat',
          html: `
            <div style="
              width: 24px; height: 24px;
              background: #FF8066;
              border: 2px solid #071B2B;
              border-radius: 50%;
              box-shadow: 0 0 16px #FF8066;
              display: flex; align-items: center; justify-content: center;
              cursor: pointer;
            ">
              <div style="width: 8px; height: 8px; background: #FFFFFF; border-radius: 50%;"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([th.latitude, th.longitude], { icon: coralIcon });
        marker.bindPopup(`
          <div style="min-width: 200px; padding: 6px; color: #F0F9FF;">
            ${th.image_url ? `<img src="${th.image_url}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />` : ''}
            <div style="display: inline-block; background: rgba(255,128,102,0.25); color: #FF8066; font-size: 0.7rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-bottom: 4px;">
              ${th.status} Hazard (${th.severity})
            </div>
            <h4 style="font-size: 1rem; margin: 2px 0 4px 0; color: #FFFFFF;">${th.threat_type}</h4>
            <div style="font-size: 0.78rem; color: #94A9C0; margin-bottom: 4px;">📍 ${th.location_name}</div>
            <p style="font-size: 0.8rem; color: #CBD5E1; margin-top: 4px;">${th.description}</p>
          </div>
        `);
        markersLayerRef.current.addLayer(marker);
      }
    });
  }, [observations, threats]);

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
      alert(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.species_name || !formData.location_name) {
      alert('Please fill in species name and location.');
      return;
    }
    if (!formData.consent_given) {
      alert('Consent is required to contribute observation data to UN SDG 14 open research.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/observations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to submit observation.');
      }

      // Trigger Confetti!
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4DEEEA', '#00BFA6', '#FF8066']
      });

      setShowObsModal(false);
      await fetchData();
    } catch (err) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="responsive-container">
      {/* Header and Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="responsive-title" style={{
            background: 'linear-gradient(135deg, #FFFFFF, var(--color-bio-cyan))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.3rem'
          }}>
            Global Marine Sightings &amp; Threats Map
          </h1>
          <p className="responsive-desc">
            Interactive geospatial observation log. Click anywhere on the ocean to record coordinates for a new species sighting.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          {/* Map Legend */}
          <div className="glass-panel" style={{ padding: '0.45rem 0.85rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-bio-cyan)', boxShadow: '0 0 8px var(--color-bio-cyan)' }} />
              Observations ({observations.length})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-coral)', boxShadow: '0 0 8px var(--color-coral)' }} />
              Threats ({threats.length})
            </span>
          </div>

          <button
            onClick={() => setShowObsModal(true)}
            className="btn-primary"
            style={{ fontSize: '0.88rem', padding: '0.6rem 1.2rem' }}
          >
            <Plus size={18} />
            <span>Log Observation</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="glass-panel" style={{ padding: '0.4rem', marginBottom: '2rem', overflow: 'hidden' }}>
        <div
          ref={mapContainerRef}
          style={{
            height: 'clamp(320px, 48vh, 560px)',
            width: '100%',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            position: 'relative'
          }}
        />
        {selectedCoords && (
          <div style={{
            padding: '0.6rem 1rem',
            fontSize: '0.82rem',
            color: 'var(--color-bio-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>📍 Pinned Coordinates: {selectedCoords.lat}° N, {selectedCoords.lng}° E</span>
            <button
              onClick={() => setShowObsModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-ocean-teal)',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Use these coordinates for observation &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Observation Feed Cards */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.2rem', color: '#FFFFFF' }}>
          Recent Community Sighting Logs
        </h2>
        <div className="grid-cards-responsive">
          {observations.map((obs) => (
            <div
              key={obs.id}
              className="glass-panel"
              style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}
            >
              <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                {obs.image_url ? (
                  <img
                    src={obs.image_url}
                    alt={obs.species_name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      if (obs.species_id) {
                        e.currentTarget.src = `${import.meta.env.BASE_URL}samples/${obs.species_id}.jpg`;
                      }
                    }}
                    style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '10px',
                    background: 'rgba(77, 238, 234, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-bio-cyan)'
                  }}>
                    <Camera size={24} />
                  </div>
                )}
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {obs.species_name}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-bio-cyan)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
                    <MapPin size={13} /> {obs.location_name}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    📅 {obs.date_observed} • {obs.observer_name}
                  </p>
                </div>
              </div>

              {obs.notes && (
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, background: 'rgba(7, 27, 43, 0.5)', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
                  "{obs.notes}"
                </p>
              )}

              {obs.confidence && (
                <div style={{ fontSize: '0.75rem', color: 'var(--color-ocean-teal)', fontWeight: 600 }}>
                  AI Identification Confidence: {(obs.confidence * 100).toFixed(1)}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Observation Submission Modal */}
      {showObsModal && (
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
        }}>
          <div
            className="glass-panel-elevated modal-dialog-responsive"
            style={{
              maxWidth: '600px',
              width: '100%',
              maxHeight: '94vh',
              overflowY: 'auto',
              padding: 'clamp(1.2rem, 3vw, 2rem)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF' }}>
                Log Marine Species Sighting
              </h2>
              <button
                onClick={() => setShowObsModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Species Name or Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Species Observed *
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    value={formData.species_id}
                    onChange={(e) => {
                      const sp = speciesList.find((s) => s.id === e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        species_id: e.target.value,
                        species_name: sp ? sp.common_name : prev.species_name,
                      }));
                    }}
                    style={{
                      flex: 1,
                      padding: '0.65rem 0.9rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border-cyan)',
                      backgroundColor: 'rgba(7, 27, 43, 0.9)',
                      color: 'var(--color-text-primary)',
                      outline: 'none'
                    }}
                  >
                    <option value="">-- Select from catalog or type custom --</option>
                    {speciesList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.common_name} ({s.scientific_name})
                      </option>
                    ))}
                  </select>
                </div>
                {!formData.species_id && (
                  <input
                    type="text"
                    placeholder="Or enter species name manually..."
                    value={formData.species_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, species_name: e.target.value }))}
                    style={{
                      width: '100%',
                      marginTop: '0.5rem',
                      padding: '0.65rem 0.9rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border-cyan)',
                      backgroundColor: 'rgba(7, 27, 43, 0.9)',
                      color: 'var(--color-text-primary)',
                      outline: 'none'
                    }}
                  />
                )}
              </div>

              {/* Location Name & Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Location Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ningaloo Reef, Australia"
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
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Date Sighted
                  </label>
                  <input
                    type="date"
                    value={formData.date_observed}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date_observed: e.target.value }))}
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
              </div>

              {/* GPS Coordinates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Latitude (°N)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData((prev) => ({ ...prev, latitude: parseFloat(e.target.value) }))}
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
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Longitude (°E)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData((prev) => ({ ...prev, longitude: parseFloat(e.target.value) }))}
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
              </div>

              {/* Photo Upload or URL */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Observation Photograph
                </label>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}
                  />
                  {uploadingImage && <span style={{ fontSize: '0.8rem', color: 'var(--color-bio-cyan)' }}>Uploading...</span>}
                </div>
                {formData.image_url && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <img src={formData.image_url} alt="Uploaded preview" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-ocean-teal)' }}>Photo attached</span>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Field Notes &amp; Marine Behavior
                </label>
                <textarea
                  rows={3}
                  placeholder="Note specimen behavior, water clarity, depth, or nearby marine interactions..."
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
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

              {/* Observer Name & Consent */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Contributor Name / Handle
                </label>
                <input
                  type="text"
                  value={formData.observer_name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, observer_name: e.target.value }))}
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

              {/* Consent Checkbox */}
              <div style={{
                background: 'rgba(0, 191, 166, 0.1)',
                padding: '0.9rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(0, 191, 166, 0.3)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem'
              }}>
                <input
                  type="checkbox"
                  id="consent"
                  checked={formData.consent_given}
                  onChange={(e) => setFormData((prev) => ({ ...prev, consent_given: e.target.checked }))}
                  style={{ marginTop: '3px', cursor: 'pointer' }}
                />
                <label htmlFor="consent" style={{ fontSize: '0.82rem', color: 'var(--color-text-primary)', cursor: 'pointer', lineHeight: 1.4 }}>
                  <strong>Mandatory Contributor Consent:</strong> I verify this observation and consent to sharing its geospatial and biological data with global conservationists under UN SDG 14 Open Science protocols.
                </label>
              </div>

              {/* Submit Button */}
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {isSubmitting ? 'Recording Sighting...' : 'Submit Marine Sighting'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowObsModal(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
