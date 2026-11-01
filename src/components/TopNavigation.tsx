import React, { useState, useEffect } from 'react';
import { useJourney } from '../journey/JourneyProvider';
import { useAudio } from '../audio/AudioProvider';
import { playSFX } from '../audio/sfx';
import { JourneyStage } from '../types/content';
import copyData from '../content/copy.json';
import './TopNavigation.css';

const CEREMONY_STAGES: { stage: JourneyStage; label: string; icon: string }[] = [
  { stage: 'entrance', label: 'Welcome Letter & Cat', icon: '🐱' },
  { stage: 'countdown', label: '3-2-1 Countdown', icon: '⏳' },
  { stage: 'cake', label: 'Birthday Cake & Candles (Blow!)', icon: '🎂' },
  { stage: 'blessing', label: 'Divine Blessing (Lord Perumal)', icon: '🙏' }
];

const SECTIONS = [
  { id: 'music-room', label: 'Our Playlist', icon: '🎧' },
  { id: 'scrapbook', label: 'Memory Scrapbook (37 Photos)', icon: '📸' },
  { id: 'penguins', label: 'Penguin & Cat Corner', icon: '🐧' },
  { id: 'flowers', label: 'Flowers For You', icon: '🌸' },
  { id: 'arcade', label: 'Surprise Arcade', icon: '🎁' },
  { id: 'letter', label: 'A Letter For You', icon: '💌' },
  { id: 'kavithai', label: 'Tamil Kavithai', icon: '📜' },
  { id: 'my-wish', label: 'My Wish For You', icon: '🌟' },
  { id: 'final-universe', label: 'Final Universe', icon: '🌌' }
];

export const TopNavigation: React.FC = () => {
  const { stage, soundOn, calmMode, dispatch, goBack, goTo } = useJourney();
  const { isPlaying, togglePlay, currentSong } = useAudio();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const copyUI = copyData.ui;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  const handleBack = () => {
    playSFX('whoosh', soundOn);
    goBack();
  };

  const getBackDetails = () => {
    switch (stage) {
      case 'countdown':
        return { label: 'Letter', icon: '💌' };
      case 'cake':
        return { label: 'Countdown', icon: '⏳' };
      case 'blessing':
        return { label: 'Cake & Wish', icon: '🎂' };
      case 'universe':
        return { label: 'Blessing', icon: '🙏' };
      default:
        return { label: 'Back', icon: '←' };
    }
  };

  const { label, icon } = getBackDetails();

  const navigateToSection = (id: string) => {
    setDrawerOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToCeremony = (targetStage: JourneyStage) => {
    setDrawerOpen(false);
    playSFX('sparkle', soundOn);
    goTo(targetStage);
  };

  return (
    <>
      <header className="global-top-header" aria-label="Site navigation bar">
        {/* Left Side: Back button & Navigation shortcuts */}
        <div className="top-nav-left">
          {stage !== 'entrance' && (
            <button
              className="top-pill-btn top-back-btn"
              onClick={handleBack}
              aria-label={`Go back to ${label}`}
              title={`Go back to ${label}`}
            >
              <span className="btn-arrow">←</span>
              <span className="btn-icon">{icon}</span>
              <span className="btn-text">{label}</span>
            </button>
          )}

          {/* Direct shortcut to Cake & Wish if in universe */}
          {stage === 'universe' && (
            <button
              className="top-pill-btn top-shortcut-btn"
              onClick={() => {
                playSFX('sparkle', soundOn);
                goTo('cake');
              }}
              aria-label="Revisit Birthday Cake and Blow Candles"
              title="Revisit Birthday Cake"
            >
              <span>🎂</span>
              <span className="btn-text desktop-only">Cake & Wish</span>
            </button>
          )}

          {/* Chapters Drawer Trigger in Act II */}
          {stage === 'universe' && (
            <button
              className="top-pill-btn top-chapters-btn"
              onClick={() => setDrawerOpen(prev => !prev)}
              aria-label="Open chapters menu"
              aria-expanded={drawerOpen}
            >
              <span>✨</span>
              <span className="btn-text">Chapters</span>
            </button>
          )}
        </div>

        {/* Right Side: Music Play/Stop, Sound & Calm Toggles */}
        <div className="top-nav-right">
          <button
            className={`top-pill-btn music-control-btn ${isPlaying ? 'playing' : ''}`}
            onClick={() => {
              togglePlay();
              playSFX('pop', soundOn);
            }}
            aria-label={isPlaying ? 'Stop music' : 'Play music'}
            title={isPlaying ? `Now Playing: ${currentSong ? currentSong.title : 'Song 1'}. Click to stop` : 'Click to play music'}
          >
            <span className="music-icon">{isPlaying ? '⏸️' : '🎵'}</span>
            <span className="btn-text">
              {isPlaying ? 'Stop Music' : 'Play Music'}
            </span>
            {isPlaying && (
              <span className="equalizer-bars" aria-hidden="true">
                <span className="bar bar-1" />
                <span className="bar bar-2" />
                <span className="bar bar-3" />
              </span>
            )}
          </button>

          <button
            className={`top-pill-btn ${soundOn ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_SOUND' })}
            aria-label={soundOn ? copyUI.soundOn : copyUI.soundOff}
            title={soundOn ? 'Mute sound effects' : 'Enable sound effects'}
          >
            <span>{soundOn ? '🔊' : '🔇'}</span>
            <span className="btn-text desktop-only">{soundOn ? 'SFX' : 'Muted'}</span>
          </button>

          <button
            className={`top-pill-btn ${calmMode ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_CALM' })}
            aria-label={calmMode ? copyUI.calmModeActive : copyUI.calmMode}
            title={calmMode ? 'Disable calm mode' : 'Enable calm mode'}
          >
            <span>{calmMode ? '🌙' : '✨'}</span>
            <span className="btn-text desktop-only">{calmMode ? 'Calm' : 'Sparkle'}</span>
          </button>
        </div>
      </header>

      {/* Chapters & Revisit Modal Drawer */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Chapters and Ceremony Navigation"
          onClick={() => setDrawerOpen(false)}
          className="chapters-drawer-overlay"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="chapters-drawer-card"
          >
            <div className="drawer-header">
              <h2 className="drawer-title">Our Little Universe 💜</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation"
                className="drawer-close-btn"
              >
                ×
              </button>
            </div>

            {/* Revisit Birthday Ceremony */}
            <div className="drawer-section-label">
              <span>🎂 Revisit Birthday Ceremony</span>
            </div>
            <div className="drawer-buttons-column">
              {CEREMONY_STAGES.map((c) => (
                <button
                  key={c.stage}
                  onClick={() => navigateToCeremony(c.stage)}
                  className="drawer-ceremony-btn"
                >
                  <span className="drawer-item-icon">{c.icon}</span>
                  <span className="drawer-item-label">{c.label}</span>
                </button>
              ))}
            </div>

            {/* Universe Sections */}
            <div className="drawer-section-label" style={{ marginTop: 14 }}>
              <span>🌌 Memory Universe Chapters</span>
            </div>
            <nav className="drawer-buttons-column">
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => navigateToSection(sec.id)}
                  className="drawer-section-btn"
                >
                  <span className="drawer-item-icon">{sec.icon}</span>
                  <span className="drawer-item-label">{sec.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

