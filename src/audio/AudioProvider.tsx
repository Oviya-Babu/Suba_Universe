import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import playlistData from '../content/playlist.json';
import { Song } from '../types/content';
import { useJourney } from '../journey/JourneyProvider';

interface AudioContextValue {
  playlist: Song[];
  currentTrackIndex: number;
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeat: boolean;
  shuffle: boolean;
  isIOS: boolean;
  playTrack: (index: number) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  pauseMusic: () => void;
}

const AudioPlayerContext = createContext<AudioContextValue | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { soundOn } = useJourney();
  const playlist = playlistData as Song[];
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<boolean>(false);
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Detect iOS
  useEffect(() => {
    const isIOSDevice =
      typeof navigator !== 'undefined' &&
      (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
    setIsIOS(isIOSDevice);
  }, []);

  // Initialize Audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.setAttribute('playsinline', 'true');
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      audio.src = '';
    };
  }, [repeat]);

  const currentSong = playlist[currentTrackIndex] || null;

  // Auto-play default track (Song 1) as requested upon opening website
  useEffect(() => {
    if (!audioRef.current || playlist.length === 0) return;
    const defaultSong = playlist[0];
    const src = `${import.meta.env.BASE_URL}assets/${defaultSong.src}`;
    if (!audioRef.current.src || !audioRef.current.src.endsWith(defaultSong.src)) {
      audioRef.current.src = src;
      audioRef.current.load();
    }

    const startAudioOnGesture = () => {
      if (audioRef.current && audioRef.current.paused && soundOn) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
      removeGestureListeners();
    };

    const removeGestureListeners = () => {
      window.removeEventListener('pointerdown', startAudioOnGesture);
      window.removeEventListener('touchstart', startAudioOnGesture);
      window.removeEventListener('click', startAudioOnGesture);
      window.removeEventListener('keydown', startAudioOnGesture);
    };

    if (soundOn) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Fallback to first user tap or touch anywhere
          window.addEventListener('pointerdown', startAudioOnGesture, { once: true, passive: true });
          window.addEventListener('touchstart', startAudioOnGesture, { once: true, passive: true });
          window.addEventListener('click', startAudioOnGesture, { once: true });
          window.addEventListener('keydown', startAudioOnGesture, { once: true });
        });
    }

    return () => removeGestureListeners();
  }, [playlist, soundOn]);

  // Media Session API
  useEffect(() => {
    if (!currentSong || typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: 'A Little Universe Called Subashree',
        artwork: currentSong.artwork
          ? [{ src: `${import.meta.env.BASE_URL}assets/${currentSong.artwork}` }]
          : [{ src: `${import.meta.env.BASE_URL}assets/divine/perumal.png`, sizes: '512x512', type: 'image/png' }]
      });

      navigator.mediaSession.setActionHandler('play', () => togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => pauseMusic());
      navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
    } catch (e) {}
  }, [currentSong]);

  // Load and play track
  const playTrack = useCallback((index: number) => {
    if (!audioRef.current || index < 0 || index >= playlist.length) return;
    const song = playlist[index];
    const src = `${import.meta.env.BASE_URL}assets/${song.src}`;

    setCurrentTrackIndex(index);
    if (audioRef.current.src !== src) {
      audioRef.current.src = src;
      audioRef.current.load();
    }

    if (soundOn) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [playlist, soundOn]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src && currentSong) {
        audioRef.current.src = `${import.meta.env.BASE_URL}assets/${currentSong.src}`;
      }
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [isPlaying, currentSong]);

  const pauseMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const nextTrack = useCallback(() => {
    if (shuffle) {
      let nextIdx = Math.floor(Math.random() * playlist.length);
      if (playlist.length > 1 && nextIdx === currentTrackIndex) {
        nextIdx = (nextIdx + 1) % playlist.length;
      }
      playTrack(nextIdx);
    } else {
      const nextIdx = (currentTrackIndex + 1) % playlist.length;
      playTrack(nextIdx);
    }
  }, [currentTrackIndex, playlist.length, shuffle, playTrack]);

  const prevTrack = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    const prevIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    playTrack(prevIdx);
  }, [currentTrackIndex, playlist.length, playTrack]);

  const seek = useCallback((seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = seconds;
    setCurrentTime(seconds);
  }, []);

  const setVolume = useCallback((val: number) => {
    if (!audioRef.current || isIOS) return;
    const clamped = Math.max(0, Math.min(1, val));
    audioRef.current.volume = clamped;
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
      audioRef.current.muted = false;
    }
  }, [isIOS, isMuted]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  }, [isMuted]);

  const toggleRepeat = useCallback(() => setRepeat(prev => !prev), []);
  const toggleShuffle = useCallback(() => setShuffle(prev => !prev), []);

  // Global sound toggle reaction
  useEffect(() => {
    if (!soundOn && isPlaying) {
      pauseMusic();
    }
  }, [soundOn, isPlaying, pauseMusic]);

  return (
    <AudioPlayerContext.Provider
      value={{
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
        toggleShuffle,
        pauseMusic
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export function useAudio() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}
