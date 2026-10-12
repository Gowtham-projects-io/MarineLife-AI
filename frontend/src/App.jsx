import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Identifier from './components/Identifier';
import SpeciesExplorer from './components/SpeciesExplorer';
import ObservationsMap from './components/ObservationsMap';
import BiodiversityDashboard from './components/BiodiversityDashboard';
import ThreatReporter from './components/ThreatReporter';
import ModelMetrics from './components/ModelMetrics';
import { Waves, Heart, Shield, Globe, Award } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('identify');
  const [prefilledObservation, setPrefilledObservation] = useState(null);
  const [inspectSpeciesId, setInspectSpeciesId] = useState(null);
  const [showThreatModal, setShowThreatModal] = useState(false);

  const handleSaveObservation = (obsData) => {
    setPrefilledObservation(obsData);
    setActiveTab('map');
  };

  const handleInspectSpecies = (speciesId) => {
    setInspectSpeciesId(speciesId);
    setActiveTab('explorer');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Ambient Underwater Bubbles Background */}
      <div className="bubble-container" aria-hidden="true">
        <div className="bubble" />
        <div className="bubble" />
        <div className="bubble" />
        <div className="bubble" />
        <div className="bubble" />
        <div className="bubble" />
      </div>

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenThreatModal={() => setShowThreatModal(true)}
      />

      {/* Main Tab Content */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1, paddingBottom: '3rem' }}>
        {activeTab === 'identify' && (
          <Identifier
            onSaveObservation={handleSaveObservation}
            onInspectSpecies={handleInspectSpecies}
          />
        )}

        {activeTab === 'explorer' && (
          <SpeciesExplorer
            selectedSpeciesId={inspectSpeciesId}
            onCloseModal={() => setInspectSpeciesId(null)}
          />
        )}

        {activeTab === 'map' && (
          <ObservationsMap
            prefilledObservation={prefilledObservation}
            onClearPrefill={() => setPrefilledObservation(null)}
          />
        )}

        {activeTab === 'dashboard' && (
          <BiodiversityDashboard />
        )}

        {activeTab === 'metrics' && (
          <ModelMetrics />
        )}
      </main>

      {/* Direct Marine Threat Reporting Modal if triggered via Navbar button */}
      {showThreatModal && (
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
          <div className="modal-dialog-responsive" style={{ maxWidth: '800px', width: '100%', maxHeight: '94vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
              <button
                onClick={() => setShowThreatModal(false)}
                className="btn-outline"
                style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>
            <ThreatReporter
              isOpenModal={true}
              onCloseModal={() => setShowThreatModal(false)}
            />
          </div>
        </div>
      )}

      {/* Professional Marine Conservation Footer */}
      <footer style={{
        backgroundColor: 'rgba(3, 13, 20, 0.95)',
        borderTop: '1px solid var(--color-border-cyan)',
        padding: 'clamp(2.5rem, 5vw, 3.5rem) clamp(0.85rem, 3vw, 1.5rem) clamp(5.5rem, 8vw, 2.5rem) clamp(0.85rem, 3vw, 1.5rem)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
            {/* Mission Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
                <Waves size={22} color="var(--color-bio-cyan)" />
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>MarineLife AI</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                An open-science digital public good engineered to advance United Nations Sustainable Development Goal 14: Conserve and sustainably use the oceans, seas, and marine resources.
              </p>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.78rem',
                color: 'var(--color-ocean-teal)',
                fontWeight: 700
              }}>
                <Globe size={14} /> UN SDG 14.1 • 14.2 • 14.4 • 14.5 Target Alignment
              </span>
            </div>

            {/* AI/ML Framework Column */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.8rem' }}>
                AI &amp; Data Pipeline
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                <li>• PyTorch MobileNetV3 Transfer Learning</li>
                <li>• 10 Marine Indicator Taxa Fine-Tuned</li>
                <li>• Strict Held-out Test Split Validation</li>
                <li>• Real Confidence-Aware Low-Confidence Fallback</li>
                <li>• FastAPI Async Microservice Architecture</li>
              </ul>
            </div>

            {/* Scientific Sources Column */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.8rem' }}>
                Authoritative Sources
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                <li>• IUCN Red List of Threatened Species</li>
                <li>• NOAA Fisheries Marine Life Profiles</li>
                <li>• Ocean Biodiversity Information System (OBIS)</li>
                <li>• FishBase Marine Biological Database</li>
                <li>• UN Department of Economic &amp; Social Affairs</li>
              </ul>
            </div>

            {/* Stewardship Column */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.8rem' }}>
                Citizen Science Stewardship
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Every marine sighting and unverified threat report submitted strengthens global biodiversity tracking. Marine life observations are preserved with contributor consent under open-access science guidelines.
              </p>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(77, 238, 234, 0.1)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)'
          }}>
            <div>
              &copy; {new Date().getFullYear()} MarineLife AI Platform. Built for ocean conservation &amp; research.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-bio-cyan)' }}>
              <span>Powered by PyTorch, MobileNetV3 &amp; UN SDG 14 Life Below Water</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
