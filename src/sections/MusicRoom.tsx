import React from 'react';
import { useAudio } from '../audio/AudioProvider';
import copyData from '../content/copy.json';
import './MusicRoom.css';

function formatSeconds(sec: number): string {
  if (isNaN(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const MusicRoom: React.FC = () => {
  const {
    playlist,
    currentTrackIndex,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    repeat,
    shuffle,
    isIOS,
    playTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle
  } = useAudio();

  const copy = copyData.music;

  return (
    <section id="music-room" className="section-wrapper music-room-section" aria-labelledby="music-heading">
      <header className="section-header">
        <h2 id="music-heading" className="section-title">{copy.heading}</h2>
        <p className="section-subtitle">{copy.sub}</p>
      </header>

      <div className="music-player-card">
        {/* Vinyl Player Deck */}
        <div className="vinyl-stage">
          <div className={`vinyl-disc ${isPlaying ? 'spinning' : ''}`}>
            <div className="vinyl-label">
              <span>💜 Chuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuba</span>
              <span>{currentSong ? currentSong.title : 'Playlist'}</span>
            </div>
          </div>

          {/* SVG Tonearm */}
          <svg className={`vinyl-tonearm ${isPlaying ? 'playing' : ''}`} viewBox="0 0 60 140">
            <circle cx="45" cy="20" r="14" fill="#3B1E6D" stroke="#A78BFA" strokeWidth="2" />
            <path d="M45,20 L30,90 L20,110" stroke="#EDE9FE" strokeWidth="3" fill="none" strokeLinecap="round" />
            <rect x="14" y="106" width="12" height="18" rx="2" fill="#F5D98B" transform="rotate(-15 20 115)" />
          </svg>
        </div>

        {/* Equalizer Bars */}
        <div className="equalizer-bars" aria-hidden="true">
          <div className={`eq-bar ${isPlaying ? 'active' : ''}`} />
          <div className={`eq-bar ${isPlaying ? 'active' : ''}`} />
          <div className={`eq-bar ${isPlaying ? 'active' : ''}`} />
          <div className={`eq-bar ${isPlaying ? 'active' : ''}`} />
          <div className={`eq-bar ${isPlaying ? 'active' : ''}`} />
        </div>

        {/* Track Title & Artist */}
        {currentSong && (
          <div className="now-playing-info">
            <h3 className="now-playing-title">{currentSong.title}</h3>
            <p className="now-playing-artist">{currentSong.artist}</p>
            {currentSong.note && (
              <p className="song-note-bubble">{currentSong.note}</p>
            )}
          </div>
        )}

        {/* Seek Bar */}
        <div className="seek-container">
          <span className="seek-time">{formatSeconds(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="seek-slider"
            aria-label="Seek track position"
            aria-valuetext={`${formatSeconds(currentTime)} of ${formatSeconds(duration)}`}
          />
          <span className="seek-time">{formatSeconds(duration)}</span>
        </div>

        {/* Controls Row */}
        <div className="player-controls-row">
          <button
            onClick={toggleShuffle}
            className={`control-btn ${shuffle ? 'active' : ''}`}
            aria-label="Toggle shuffle"
            title="Shuffle"
          >
            🔀
          </button>
          <button
            onClick={prevTrack}
            className="control-btn"
            aria-label="Previous track"
            title="Previous"
          >
            ⏮
          </button>
          <button
            onClick={togglePlay}
            className="control-btn main-play"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button
            onClick={nextTrack}
            className="control-btn"
            aria-label="Next track"
            title="Next"
          >
            ⏭
          </button>
          <button
            onClick={toggleRepeat}
            className={`control-btn ${repeat ? 'active' : ''}`}
            aria-label="Toggle repeat"
            title="Repeat"
          >
            🔁
          </button>
        </div>

        {/* Volume Row (Hidden on iOS) */}
        {!isIOS && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', maxWidth: 280 }}>
            <button
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              style={{ fontSize: '1.1rem', minWidth: 36, minHeight: 36 }}
            >
              {isMuted || volume === 0 ? '🔇' : '🔊'}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--color-primary)' }}
              aria-label="Volume slider"
            />
          </div>
        )}
      </div>

      {/* Playlist List */}
      <div className="track-list" role="list">
        {playlist.map((song, idx) => {
          const isCurrent = idx === currentTrackIndex;
          return (
            <button
              key={song.id}
              onClick={() => playTrack(idx)}
              className={`track-item ${isCurrent ? 'current' : ''}`}
              role="listitem"
              aria-current={isCurrent ? 'true' : undefined}
            >
              <div className="track-left">
                <span className="track-number">
                  {isCurrent && isPlaying ? '▶' : `${idx + 1}`}
                </span>
                <div>
                  <div className="track-meta-title">{song.title}</div>
                  <div className="track-meta-artist">{song.artist}</div>
                </div>
              </div>
              {isCurrent && (
                <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                  Now Playing
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
