import React from 'react';
import { useAudio } from '../audio/AudioProvider';
import { useJourney } from '../journey/JourneyProvider';

export const MiniPlayer: React.FC = () => {
  const { currentSong, isPlaying, togglePlay, nextTrack, currentTime, duration } = useAudio();
  const { stage } = useJourney();

  if (stage !== 'universe' || !currentSong) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const scrollToMusic = () => {
    const el = document.getElementById('music-room');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside
      aria-label="Floating music player"
      style={{
        position: 'fixed',
        bottom: 'max(16px, env(safe-area-inset-bottom))',
        right: '16px',
        zIndex: 900,
        background: 'rgba(36, 20, 63, 0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--color-card-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 12px',
        maxWidth: 'calc(100vw - 32px)',
        width: 320,
        overflow: 'hidden'
      }}
    >
      {/* Vinyl Disc Icon */}
      <button
        onClick={scrollToMusic}
        title="Scroll to Music Room"
        aria-label={`Current song: ${currentSong.title}. Tap to go to Music Room`}
        style={{
          width: 44,
          height: 44,
          minWidth: 44,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2E1B4E, #140A26)',
          border: '2px solid var(--color-lavender)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: isPlaying ? 'spin 4s linear infinite' : 'none'
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: 'var(--color-primary)'
          }}
        />
      </button>

      {/* Track Info */}
      <div
        onClick={scrollToMusic}
        style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
      >
        <div
          style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--color-lavender-50)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {currentSong.title}
        </div>
        <div
          style={{
            fontSize: '0.78rem',
            color: 'var(--color-text-muted)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {currentSong.artist}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'var(--color-primary)',
            color: '#FFFFFF',
            fontSize: '1.1rem'
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <button
          onClick={nextTrack}
          aria-label="Next track"
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            color: 'var(--color-lavender)',
            fontSize: '1.2rem'
          }}
        >
          ⏭
        </button>
      </div>

      {/* Progress Bar at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: 'var(--color-primary)',
            transition: 'width 0.2s linear'
          }}
        />
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </aside>
  );
};
