import React, { useState, useEffect } from 'react';
import { useJourney } from '../journey/JourneyProvider';
import { JourneyStage } from '../types/content';

const CEREMONY_STAGES: { stage: JourneyStage; label: string; icon: string }[] = [
  { stage: 'entrance', label: 'Welcome Letter & Cat', icon: '🐱' },
  { stage: 'cake', label: 'Birthday Cake & Candles', icon: '🎂' },
  { stage: 'blessing', label: 'Divine Blessing (Perumal)', icon: '🙏' }
];

const SECTIONS = [
  { id: 'music-room', label: 'Our Playlist', icon: '🎧' },
  { id: 'scrapbook', label: 'Memory Scrapbook', icon: '📸' },
  { id: 'penguins', label: 'Penguin & Cat Corner', icon: '🐧' },
  { id: 'flowers', label: 'Flowers For You', icon: '🌸' },
  { id: 'arcade', label: 'Surprise Arcade', icon: '🎁' },
  { id: 'letter', label: 'A Letter For You', icon: '💌' },
  { id: 'kavithai', label: 'Tamil Kavithai', icon: '📜' },
  { id: 'my-wish', label: 'My Wish For You', icon: '🌟' },
  { id: 'final-universe', label: 'Final Universe', icon: '🌌' }
];

export const ConstellationMenu: React.FC = () => {
  const { stage, dispatch } = useJourney();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (stage !== 'universe') return null;

  const navigateTo = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToCeremony = (targetStage: JourneyStage) => {
    setIsOpen(false);
    dispatch({ type: 'GO_TO', stage: targetStage });
  };

  return (
    <>
      {/* Floating Menu Trigger (Top Left) */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Navigation menu"
        aria-expanded={isOpen}
        style={{
          position: 'fixed',
          top: 'max(16px, env(safe-area-inset-top))',
          left: 'max(16px, env(safe-area-inset-left))',
          zIndex: 1000,
          background: 'rgba(36, 20, 63, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--color-card-border)',
          color: 'var(--color-lavender-50)',
          borderRadius: 'var(--radius-full)',
          padding: '6px 14px',
          fontSize: '0.88rem',
          fontWeight: 600,
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <span>✨</span>
        <span>Chapters</span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Sections navigation"
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 8, 28, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--color-midnight)',
              border: '1px solid var(--color-card-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              maxWidth: 380,
              width: '100%',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxHeight: '85vh',
              overflowY: 'auto'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--color-card-border)',
                paddingBottom: '12px',
                marginBottom: '4px'
              }}
            >
              <h2 style={{ fontSize: '1.2rem', color: 'var(--color-lavender)', fontWeight: 700 }}>
                Our Little Universe 💜
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close navigation"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  fontSize: '1.2rem'
                }}
              >
                ×
              </button>
            </div>

            {/* Revisit Birthday Ceremony */}
            <div style={{ fontSize: '0.78rem', color: 'var(--color-lavender)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Birthday Ceremony
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {CEREMONY_STAGES.map((c) => (
                <button
                  key={c.stage}
                  onClick={() => goToCeremony(c.stage)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(245, 217, 139, 0.08)',
                    border: '1px solid rgba(245, 217, 139, 0.25)',
                    color: '#FEF08A',
                    textAlign: 'left',
                    width: '100%',
                    justifyContent: 'flex-start',
                    fontSize: '0.92rem'
                  }}
                >
                  <span style={{ fontSize: '1.15rem' }}>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>

            {/* Universe Sections */}
            <div style={{ fontSize: '0.78rem', color: 'var(--color-lavender)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginTop: 8 }}>
              Memory Universe
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => navigateTo(sec.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid transparent',
                    color: 'var(--color-lavender-50)',
                    textAlign: 'left',
                    width: '100%',
                    justifyContent: 'flex-start',
                    fontSize: '0.95rem',
                    transition: 'background var(--dur-fast), border-color var(--dur-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(167, 139, 250, 0.15)';
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{sec.icon}</span>
                  <span>{sec.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
