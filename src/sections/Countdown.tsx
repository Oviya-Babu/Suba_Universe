import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useJourney } from '../journey/JourneyProvider';
import { playSFX } from '../audio/sfx';
import { fxEngine } from '../fx/engine';
import { CelestialAtmosphere } from '../components/CelestialAtmosphere';
import copyData from '../content/copy.json';
import './Countdown.css';

export const Countdown: React.FC = () => {
  const { dispatch, soundOn } = useJourney();
  const copy = copyData.countdown;

  // States: 'wait' -> 3 -> 2 -> 1 -> 'burst'
  const [phase, setPhase] = useState<'wait' | 3 | 2 | 1 | 'burst'>('wait');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Wait phase (1.2s)
    timerRef.current = setTimeout(() => {
      setPhase(3);
      playSFX('tick', soundOn);
    }, 1200);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase === 3) {
      timerRef.current = setTimeout(() => {
        setPhase(2);
        playSFX('tick', soundOn);
      }, 900);
    } else if (phase === 2) {
      timerRef.current = setTimeout(() => {
        setPhase(1);
        playSFX('tick', soundOn);
      }, 900);
    } else if (phase === 1) {
      timerRef.current = setTimeout(() => {
        setPhase('burst');
        playSFX('fanfare', soundOn);
        playSFX('whoosh', soundOn);

        // Spawn celebratory confetti & fireworks
        try {
          confetti({
            particleCount: 80,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#A78BFA', '#C4B5FD', '#FBCFE8', '#F5D98B', '#BFDBFE']
          });
        } catch (e) {}

        if (typeof window !== 'undefined') {
          fxEngine.spawnFireworks(window.innerWidth * 0.3, window.innerHeight * 0.4);
          fxEngine.spawnFireworks(window.innerWidth * 0.7, window.innerHeight * 0.45);
        }

        // Auto advance after 2.8s
        timerRef.current = setTimeout(() => {
          dispatch({ type: 'COUNTDOWN_COMPLETE' });
        }, 2800);
      }, 900);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, soundOn, dispatch]);

  const handleSkip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    dispatch({ type: 'COUNTDOWN_COMPLETE' });
  };

  return (
    <main className="countdown-container" aria-live="assertive">
      {/* Living Celestial Aurora & Stardust Atmosphere */}
      <CelestialAtmosphere variant="countdown" showMoon={false} showShootingStar={true} />

      <button className="countdown-skip" onClick={handleSkip} aria-label="Skip countdown">
        {copy.skip}
      </button>

      <div className="countdown-content">
        {phase === 'wait' && (
          <>
            <h1 className="countdown-intro-text">{copy.wait}</h1>
            <p className="countdown-sub-text">{copy.sub}</p>
          </>
        )}

        {(phase === 3 || phase === 2 || phase === 1) && (
          <div className="countdown-number" key={phase}>
            {phase}
          </div>
        )}

        {phase === 'burst' && (
          <>
            <h1 className="countdown-burst-text">{copy.burst}</h1>
            <button
              className="btn-primary"
              onClick={() => dispatch({ type: 'COUNTDOWN_COMPLETE' })}
              autoFocus
            >
              Continue to Birthday Cake 🎂
            </button>
          </>
        )}
      </div>
    </main>
  );
};
