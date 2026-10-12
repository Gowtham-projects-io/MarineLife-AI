import React, { useState } from 'react';
import { Waves, ShieldAlert, Compass, Eye, BarChart3, Cpu, Sparkles, Menu, X } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenThreatModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'identify', label: 'AI Identifier', shortLabel: 'Identify', icon: Sparkles },
    { id: 'explorer', label: 'Species Explorer', shortLabel: 'Catalog', icon: Compass },
    { id: 'map', label: 'Sightings & Map', shortLabel: 'Map', icon: Eye },
    { id: 'dashboard', label: 'Dashboard', shortLabel: 'Stats', icon: BarChart3 },
    { id: 'metrics', label: 'AI Metrics', shortLabel: 'Metrics', icon: Cpu },
  ];

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="glass-panel" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderRadius: 0,
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: '1px solid var(--color-border-cyan)',
        padding: '0.75rem clamp(0.85rem, 3vw, 1.5rem)',
        backgroundColor: 'rgba(7, 27, 43, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.6rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Logo and SDG Badge */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', minWidth: 0, flexShrink: 1 }}
            onClick={() => handleTabSelect('identify')}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--color-ocean-teal), var(--color-bio-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow-cyan)',
              flexShrink: 0
            }}>
              <Waves size={22} color="#071B2B" strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(90deg, #FFFFFF, var(--color-bio-cyan))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  whiteSpace: 'nowrap'
                }}>
                  MarineLife AI
                </span>
                <span style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  background: 'rgba(0, 191, 166, 0.2)',
                  color: 'var(--color-ocean-teal)',
                  border: '1px solid rgba(0, 191, 166, 0.4)',
                  padding: '0.12rem 0.45rem',
                  borderRadius: '5px',
                  whiteSpace: 'nowrap'
                }}>
                  UN SDG 14
                </span>
              </div>
              <p className="brand-subtitle" style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                Intelligent Marine Species Identification &amp; Conservation
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Laptop/Desktop View) */}
          <nav className="desktop-nav" style={{
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: 'rgba(11, 46, 79, 0.55)',
            padding: '0.25rem 0.35rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(77, 238, 234, 0.18)'
          }}>
            {navItems.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, var(--color-ocean-teal), var(--color-bio-cyan))'
                      : 'transparent',
                    color: isActive ? '#071B2B' : 'var(--color-text-secondary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.85rem',
                    padding: '0.42rem 0.9rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'var(--transition-smooth)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.4 : 1.8} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions: Threat Button & Mobile Menu Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <button
              onClick={onOpenThreatModal}
              className="btn-coral"
              style={{
                fontSize: '0.82rem',
                padding: '0.48rem 0.95rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                whiteSpace: 'nowrap'
              }}
              title="Report Marine Threat"
            >
              <ShieldAlert size={16} />
              <span className="threat-btn-text">Report Threat</span>
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-nav-toggle btn-secondary"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              style={{
                padding: '0.45rem',
                borderRadius: '8px',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '38px',
                minHeight: '38px'
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div style={{
            marginTop: '0.85rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid rgba(77, 238, 234, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-ocean-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.5rem' }}>
              Platform Navigation
            </div>
            {navItems.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.7rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    border: isActive ? '1px solid var(--color-bio-cyan)' : '1px solid transparent',
                    background: isActive ? 'rgba(77, 238, 234, 0.12)' : 'rgba(11, 46, 79, 0.4)',
                    color: isActive ? 'var(--color-bio-cyan)' : 'var(--color-text-primary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%'
                  }}
                >
                  <Icon size={18} color={isActive ? 'var(--color-bio-cyan)' : 'var(--color-text-secondary)'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Modern Fixed Mobile Bottom Navigation Bar (Android & iOS Feel) */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
        {navItems.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabSelect(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem',
                background: 'transparent',
                border: 'none',
                color: isActive ? 'var(--color-bio-cyan)' : 'var(--color-text-secondary)',
                padding: '0.35rem 0',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {isActive && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  width: '20px',
                  height: '3px',
                  borderRadius: '3px',
                  background: 'var(--color-bio-cyan)',
                  boxShadow: '0 0 8px var(--color-bio-cyan)'
                }} />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span style={{
                fontSize: '0.68rem',
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '-0.01em'
              }}>
                {tab.shortLabel}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

