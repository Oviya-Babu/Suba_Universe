import React from 'react';
import { useJourney } from '../journey/JourneyProvider';
import { playSFX } from '../audio/sfx';
import './TopBackButton.css';

export const TopBackButton: React.FC = () => {
  const { stage, goBack, goTo, replay, soundOn } = useJourney();

  if (stage === 'entrance') {
    return null;
  }

  const handleBack = () => {
    playSFX('whoosh', soundOn);
    goBack();
  };

  const handleReplayStart = () => {
    playSFX('pop', soundOn);
    replay();
  };

  const getBackLabel = () => {
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

  const { label, icon } = getBackLabel();

  return (
    <div className="top-back-nav" aria-label="Journey navigation">
      {/* 1. Step Back Button */}
      <button
        className="top-back-btn"
        onClick={handleBack}
        aria-label={`Go back to ${label}`}
        title={`Back to ${label}`}
      >
        <span className="back-arrow">←</span>
        <span className="back-icon">{icon}</span>
        <span className="back-text">{label}</span>
      </button>

      {/* 2. Quick Revisit Ceremony from Universe / Blessing */}
      {(stage === 'universe' || stage === 'blessing') && (
        <button
          className="top-restart-btn"
          onClick={() => {
            playSFX('sparkle', soundOn);
            goTo('cake');
          }}
          aria-label="Revisit Birthday Cake and Blow Candles"
          title="Revisit Birthday Cake & Wish"
        >
          <span>🎂</span>
          <span className="restart-text">Cake & Wish</span>
        </button>
      )}

      {/* 3. Replay from the very beginning */}
      {stage === 'universe' && (
        <button
          className="top-restart-btn"
          onClick={handleReplayStart}
          aria-label="Replay entire universe from the beginning"
          title="Replay from start"
        >
          <span>↺</span>
          <span className="restart-text">From Start</span>
        </button>
      )}
    </div>
  );
};

