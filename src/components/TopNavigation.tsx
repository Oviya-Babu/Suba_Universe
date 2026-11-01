import React from 'react';
import { useJourney } from '../journey/JourneyProvider';
import { useAudio } from '../audio/AudioProvider';
import { playSFX } from '../audio/sfx';
import copyData from '../content/copy.json';
import './TopNavigation.css';

export const TopNavigation: React.FC = () => {
  const { stage, soundOn, calmMode, dispatch, goBack } = useJourney();
  const { isPlaying, togglePlay, currentSong } = useAudio();
  const copyUI = copyData.ui;

  const handleBack = () => {
    playSFX('whoosh', soundOn);
    if (stage === 'entrance') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      goBack();
    }
  };

  return (
    <header className="global-top-header" aria-label="Site navigation bar">
      {/* Left Side: Only one simple back button with <- arrow on every page */}
      <div className="top-nav-left">
        <button
          className="top-pill-btn top-back-btn"
          onClick={handleBack}
          aria-label="Back"
          title="Go back"
        >
          <span className="btn-arrow">←</span>
        </button>
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
  );
};
