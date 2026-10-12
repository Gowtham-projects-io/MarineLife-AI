import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { BarChart3, ShieldAlert, Fish, Eye, Globe2, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function BiodiversityDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem' }}>
        <div className="radar-pulse" style={{ width: '16px', height: '16px', background: 'var(--color-bio-cyan)' }} />
        <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>Compiling biodiversity analytics...</p>
      </div>
    );
  }

  // Chart 1: IUCN Distribution Doughnut
  const statusLabels = Object.keys(stats.conservation_distribution || {});
  const statusValues = Object.values(stats.conservation_distribution || {});

  const doughnutData = {
    labels: statusLabels,
    datasets: [
      {
        data: statusValues,
        backgroundColor: [
          'rgba(248, 113, 113, 0.8)', // CR
          'rgba(251, 146, 60, 0.8)',  // EN
          'rgba(250, 204, 21, 0.8)',  // VU
          'rgba(52, 211, 153, 0.8)',  // LC
          'rgba(148, 169, 192, 0.8)', // NE
        ],
        borderColor: '#071B2B',
        borderWidth: 2,
      },
    ],
  };

  // Chart 2: Marine Threats by Category Bar Chart
  const threatLabels = Object.keys(stats.threats_by_type || {});
  const threatValues = Object.values(stats.threats_by_type || {});

  const barDataThreats = {
    labels: threatLabels,
    datasets: [
      {
        label: 'Hazard Incidents Reported',
        data: threatValues,
        backgroundColor: 'rgba(255, 128, 102, 0.75)',
        borderColor: '#FF8066',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94A9C0',
          font: { family: 'Outfit', size: 12 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(7, 27, 43, 0.95)',
        titleColor: '#4DEEEA',
        bodyColor: '#F0F9FF',
        borderColor: 'rgba(77, 238, 234, 0.3)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: '#94A9C0', font: { family: 'Outfit', size: 11 } },
        grid: { color: 'rgba(77, 238, 234, 0.06)' },
      },
      y: {
        ticks: { color: '#94A9C0', font: { family: 'Outfit', size: 11 } },
        grid: { color: 'rgba(77, 238, 234, 0.06)' },
      },
    },
  };

  return (
    <div className="responsive-container">
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-ocean-teal)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <BarChart3 size={16} /> UN SDG 14 Ocean Health Indicators
        </div>
        <h1 className="responsive-title" style={{
          background: 'linear-gradient(135deg, #FFFFFF, var(--color-bio-cyan))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginTop: '0.3rem',
          marginBottom: '0.5rem'
        }}>
          Marine Biodiversity Intelligence Dashboard
        </h1>
        <p className="responsive-desc" style={{ maxWidth: '780px' }}>
          Real-time aggregated conservation statistics derived from citizen sightings, verified catalog specimens, and community marine threat reporting.
        </p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid-stats-responsive" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '14px',
            background: 'rgba(0, 191, 166, 0.15)',
            color: 'var(--color-ocean-teal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(0, 191, 166, 0.3)',
            flexShrink: 0
          }}>
            <Fish size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Cataloged Species
            </span>
            <div style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2rem)', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
              {stats.total_species}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-ocean-teal)' }}>
              100% SDG 14 Aligned
            </span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '14px',
            background: 'rgba(77, 238, 234, 0.15)',
            color: 'var(--color-bio-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(77, 238, 234, 0.3)',
            flexShrink: 0
          }}>
            <Eye size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Sighting Logs
            </span>
            <div style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2rem)', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
              {stats.total_observations}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-bio-cyan)' }}>
              Community GPS Pinned
            </span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '14px',
            background: 'rgba(255, 128, 102, 0.15)',
            color: 'var(--color-coral)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 128, 102, 0.3)',
            flexShrink: 0
          }}>
            <ShieldAlert size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Marine Threats Logged
            </span>
            <div style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2rem)', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
              {stats.total_threat_reports}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-coral)' }}>
              Marked Unverified
            </span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '14px',
            background: 'rgba(234, 88, 12, 0.15)',
            color: '#FB923C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(234, 88, 12, 0.3)',
            flexShrink: 0
          }}>
            <AlertTriangle size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Threatened Species
            </span>
            <div style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2rem)', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
              {stats.endangered_species_count}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#FB923C' }}>
              IUCN EN / CR Priority
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Row */}
      <div className="grid-2col-responsive" style={{ marginBottom: '2.5rem' }}>
        {/* Chart 1: IUCN Status Distribution */}
        <div className="glass-panel-elevated" style={{ padding: 'clamp(1.2rem, 3vw, 2rem)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem', color: '#FFFFFF' }}>
            IUCN Red List Conservation Distribution
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            Categorical assessment of supported marine taxa according to global extinction risk criteria.
          </p>
          <div style={{ height: 'clamp(220px, 32vh, 280px)', position: 'relative' }}>
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Chart 2: Threat Incidents by Category */}
        <div className="glass-panel-elevated" style={{ padding: 'clamp(1.2rem, 3vw, 2rem)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem', color: '#FFFFFF' }}>
            Reported Marine Hazards by Category
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            Incidence of ghost gear, plastic debris, injured wildlife, and localized spills reported by contributors.
          </p>
          <div style={{ height: 'clamp(220px, 32vh, 280px)', position: 'relative' }}>
            <Bar data={barDataThreats} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Feed Rows: Recent Observations & Active Marine Threats */}
      <div className="grid-2col-responsive">
        {/* Recent Sightings */}
        <div className="glass-panel" style={{ padding: '1.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={18} color="var(--color-bio-cyan)" />
              Recent Field Observations
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Latest submissions</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {stats.recent_observations?.map((obs) => (
              <div
                key={obs.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(7, 27, 43, 0.65)',
                  border: '1px solid rgba(77, 238, 234, 0.12)',
                  flexWrap: 'wrap'
                }}
              >
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
                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(77,238,234,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    🐟
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '0.95rem', color: '#FFFFFF', display: 'block' }}>{obs.species_name}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-bio-cyan)' }}>📍 {obs.location_name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>{obs.date_observed}</span>
                  {obs.confidence && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-ocean-teal)', fontWeight: 700 }}>
                      {(obs.confidence * 100).toFixed(0)}% AI Conf.
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Marine Threats */}
        <div className="glass-panel" style={{ padding: '1.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} color="var(--color-coral)" />
              Active Marine Threats Under Review
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-coral)', fontWeight: 600 }}>Unverified Status</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {stats.recent_threats?.map((th) => (
              <div
                key={th.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(7, 27, 43, 0.65)',
                  border: '1px solid rgba(255, 128, 102, 0.15)'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'rgba(255, 128, 102, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-coral)',
                  fontWeight: 800
                }}>
                  ⚠️
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <strong style={{ fontSize: '0.95rem', color: '#FFFFFF' }}>{th.threat_type}</strong>
                    <span className="badge-unverified" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                      {th.status}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>📍 {th.location_name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: th.severity === 'Critical' ? '#F87171' : 'var(--color-coral)',
                    textTransform: 'uppercase'
                  }}>
                    {th.severity} Severity
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
