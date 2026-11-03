import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useJourney } from '../journey/JourneyProvider';
import { playSFX } from '../audio/sfx';
import { startBlowDetector, BlowDetectorHandle } from '../audio/blowDetector';
import { Character } from '../components/Character';
import { CelestialAtmosphere } from '../components/CelestialAtmosphere';
import copyData from '../content/copy.json';
import siteConfig from '../content/site.json';
import './Cake.css';

export const Cake: React.FC = () => {
  const { dispatch, soundOn } = useJourney();
  const copy = copyData.cake;
  const candleCount = siteConfig.candleCount || 5;

  // Candles state: array of booleans (true = lit)
  const [candles, setCandles] = useState<boolean[]>(() =>
    Array(candleCount).fill(true)
  );

  const [blowCountdown, setBlowCountdown] = useState<number | 'BLOW!' | null>(null);
  const [isBlowingWind, setIsBlowingWind] = useState(false);
  const [isMicListening, setIsMicListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const micHandleRef = useRef<BlowDetectorHandle | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const allExtinguished = candles.every(c => !c);

  const extinguishCandle = useCallback((index: number) => {
    setCandles(prev => {
      if (!prev[index]) return prev;
      const next = [...prev];
      next[index] = false;
      return next;
    });
    playSFX('extinguish', soundOn);
  }, [soundOn]);

  const executeCandleBlow = useCallback(() => {
    setIsBlowingWind(true);
    playSFX('whoosh', soundOn);

    candles.forEach((isLit, idx) => {
      if (isLit) {
        setTimeout(() => {
          extinguishCandle(idx);
        }, (idx + 1) * 110);
      }
    });

    setTimeout(() => {
      setIsBlowingWind(false);
      setBlowCountdown(null);
    }, 900);
  }, [candles, extinguishCandle, soundOn]);

  const relightCandles = useCallback(() => {
    setCandles(Array(candleCount).fill(true));
    setBlowCountdown(null);
    setIsBlowingWind(false);
    playSFX('sparkle', soundOn);
  }, [candleCount, soundOn]);

  // Dramatic 3... 2... 1... BLOW! Sequence
  const startBlowSequence = useCallback(() => {
    if (blowCountdown !== null) return;

    setBlowCountdown(3);
    playSFX('tick', soundOn);

    countdownTimerRef.current = setTimeout(() => {
      setBlowCountdown(2);
      playSFX('tick', soundOn);

      countdownTimerRef.current = setTimeout(() => {
        setBlowCountdown(1);
        playSFX('tick', soundOn);

        countdownTimerRef.current = setTimeout(() => {
          setBlowCountdown('BLOW!');
          executeCandleBlow();
        }, 750);
      }, 750);
    }, 750);
  }, [blowCountdown, executeCandleBlow, soundOn]);

  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    };
  }, []);

  // Handle all blown
  useEffect(() => {
    if (allExtinguished) {
      if (micHandleRef.current) {
        micHandleRef.current.stop();
        setIsMicListening(false);
      }

      playSFX('harp', soundOn);
      try {
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.55 },
          colors: ['#F5D98B', '#A78BFA', '#FBCFE8', '#60A5FA', '#EDE9FE']
        });
      } catch (e) {}
    }
  }, [allExtinguished, soundOn]);

  // Clean up mic on unmount
  useEffect(() => {
    return () => {
      if (micHandleRef.current) {
        micHandleRef.current.stop();
      }
    };
  }, []);

  const toggleMic = async () => {
    if (isMicListening) {
      micHandleRef.current?.stop();
      setIsMicListening(false);
      return;
    }

    setMicError(null);
    const handle = await startBlowDetector(
      () => {
        startBlowSequence();
      },
      (err) => {
        console.warn('Mic blow error:', err);
        setMicError(copy.micFallback);
        setIsMicListening(false);
      }
    );

    if (handle) {
      micHandleRef.current = handle;
      setIsMicListening(true);
    }
  };

  return (
    <main className="cake-container">
      {/* Living Celestial Atmosphere & Floating Butterflies */}
      <CelestialAtmosphere variant="cake" showMoon={true} showShootingStar={true} />

      <header className="cake-header">
        <h1 className="cake-title">{copy.title}</h1>
        <p className="cake-helper">{copy.helper}</p>
      </header>

      <div className="cake-scene">
        {/* Cute Pastel Bunting Garland Overhead */}
        <div className="party-bunting-garland" aria-hidden="true">
          <svg viewBox="0 0 320 50" width="100%" height="45">
            <path d="M0,8 Q160,38 320,8" stroke="rgba(221, 214, 254, 0.45)" strokeWidth="1.5" fill="none" />
            {/* Flags */}
            <polygon points="30,12 50,15 40,38" fill="#FBCFE8" />
            <polygon points="70,18 90,21 80,44" fill="#93C5FD" />
            <polygon points="110,23 130,25 120,48" fill="#FDE68A" />
            <polygon points="150,26 170,26 160,50" fill="#C4B5FD" />
            <polygon points="190,25 210,23 200,48" fill="#FBCFE8" />
            <polygon points="230,21 250,18 240,44" fill="#93C5FD" />
            <polygon points="270,15 290,12 280,38" fill="#FDE68A" />
          </svg>
        </div>

        {/* Left Character: Party Cat */}
        <div className="cake-side-character left">
          <Character type="cat" variant="party" size={75} />
        </div>

        {/* 3-Tier Illustrated SVG Cake */}
        <div className="cake-svg-wrapper">
          <svg viewBox="0 0 300 300" width="100%" height="100%">
            <defs>
              <linearGradient id="cakePlate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EDE9FE" />
                <stop offset="100%" stopColor="#C4B5FD" />
              </linearGradient>
              <linearGradient id="tierBottom" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C4B5FD" />
                <stop offset="100%" stopColor="#A78BFA" />
              </linearGradient>
              <linearGradient id="tierMiddle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DDD6FE" />
                <stop offset="100%" stopColor="#C4B5FD" />
              </linearGradient>
              <linearGradient id="tierTop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EDE9FE" />
                <stop offset="100%" stopColor="#DDD6FE" />
              </linearGradient>
            </defs>

            {/* Stand / Plate */}
            <ellipse cx="150" cy="270" rx="130" ry="14" fill="url(#cakePlate)" />
            <ellipse cx="150" cy="267" rx="120" ry="10" fill="#FFFFFF" opacity="0.6" />

            {/* Bottom Tier (Tier 1) */}
            <rect x="50" y="195" width="200" height="70" rx="12" fill="url(#tierBottom)" />
            {/* Frosting Waves Bottom */}
            <path
              d="M50,205 Q62,216 75,205 Q87,216 100,205 Q112,216 125,205 Q137,216 150,205 Q162,216 175,205 Q187,216 200,205 Q212,216 225,205 Q237,216 250,205"
              stroke="#FFFFFF"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
            />

            {/* Middle Tier (Tier 2) */}
            <rect x="80" y="140" width="140" height="58" rx="10" fill="url(#tierMiddle)" />
            {/* Frosting Waves Middle */}
            <path
              d="M80,148 Q95,158 110,148 Q125,158 140,148 Q155,158 170,148 Q185,158 200,148 Q210,158 220,148"
              stroke="#FFFFFF"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />

            {/* Top Tier (Tier 3) */}
            <rect x="110" y="95" width="80" height="48" rx="8" fill="url(#tierTop)" />
            {/* Violet Drip from top */}
            <path
              d="M110,105 Q118,118 124,105 Q130,120 138,105 Q145,116 150,105 Q158,122 165,105 Q172,118 178,105 Q184,116 190,105"
              stroke="#6D28D9"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />

            {/* Sprinkles & Sugar Pearls */}
            <circle cx="120" cy="120" r="2.5" fill="#FBCFE8" />
            <circle cx="140" cy="128" r="2.5" fill="#BFDBFE" />
            <circle cx="165" cy="122" r="2.5" fill="#F5D98B" />
            <circle cx="95" cy="170" r="3" fill="#FBCFE8" />
            <circle cx="130" cy="175" r="3" fill="#A5B4FC" />
            <circle cx="170" cy="172" r="3" fill="#F5D98B" />
            <circle cx="195" cy="178" r="3" fill="#BFDBFE" />
            <circle cx="70" cy="235" r="3.5" fill="#FBCFE8" />
            <circle cx="110" cy="242" r="3.5" fill="#F5D98B" />
            <circle cx="150" cy="238" r="3.5" fill="#BFDBFE" />
            <circle cx="190" cy="245" r="3.5" fill="#EDE9FE" />
            <circle cx="230" cy="237" r="3.5" fill="#FBCFE8" />

            {/* Candles & Flames */}
            {candles.map((isLit, idx) => {
              // Distribute candles horizontally across top tier (x: 118 to 182)
              const step = 64 / (candleCount - 1 || 1);
              const candleX = candleCount === 1 ? 150 : 118 + idx * step;
              const candleY = 68;

              return (
                <g
                  key={idx}
                  onClick={() => extinguishCandle(idx)}
                  style={{ cursor: isLit ? 'pointer' : 'default' }}
                  role="button"
                  aria-label={`Candle ${idx + 1}, ${isLit ? 'lit, tap to extinguish' : 'extinguished'}`}
                >
                  {/* Candle stick */}
                  <rect
                    x={candleX - 3}
                    y={candleY}
                    width="6"
                    height="28"
                    rx="2"
                    fill={idx % 2 === 0 ? '#C4B5FD' : '#FBCFE8'}
                    stroke="#FFFFFF"
                    strokeWidth="0.8"
                  />
                  {/* Wick */}
                  <line
                    x1={candleX}
                    y1={candleY}
                    x2={candleX}
                    y2={candleY - 4}
                    stroke="#4B2E7A"
                    strokeWidth="1.2"
                  />

                  {/* Animated Flame */}
                  {isLit && (
                    <g
                      className={`candle-flame ${isBlowingWind ? 'flame-blowing' : ''}`}
                      style={{
                        animationDelay: `${(idx * 0.23) % 1}s`,
                        transformOrigin: `${candleX}px ${candleY - 5}px`
                      }}
                    >
                      {/* Outer flame */}
                      <path
                        d={`M${candleX},${candleY - 20} Q${candleX - 6},${candleY - 10} ${candleX},${candleY - 4} Q${candleX + 6},${candleY - 10} ${candleX},${candleY - 20}`}
                        fill="#F5D98B"
                        filter="drop-shadow(0 0 6px rgba(245, 217, 139, 0.8))"
                      />
                      {/* Inner flame core */}
                      <path
                        d={`M${candleX},${candleY - 16} Q${candleX - 3},${candleY - 9} ${candleX},${candleY - 5} Q${candleX + 3},${candleY - 9} ${candleX},${candleY - 16}`}
                        fill="#FFFFFF"
                      />
                    </g>
                  )}

                  {/* Smoke puff if extinguished */}
                  {!isLit && (
                    <path
                      d={`M${candleX},${candleY - 5} Q${candleX - 3},${candleY - 12} ${candleX + 2},${candleY - 18}`}
                      stroke="#DDD6FE"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.6"
                      className="smoke-puff-anim"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Sweeping Wind Gust Animation */}
          {isBlowingWind && (
            <div className="cake-wind-gust" aria-hidden="true">
              <span className="gust-wave">💨 ༄ ༄ 💨</span>
            </div>
          )}

          {/* Dramatic 3... 2... 1... Blow Badge */}
          {blowCountdown !== null && (
            <div className="cake-blow-countdown-badge" role="status" aria-live="assertive">
              <span className="countdown-digit">{blowCountdown}</span>
              <span className="countdown-sub">
                {blowCountdown === 'BLOW!' ? '💨💨💨' : 'Get ready to blow...'}
              </span>
            </div>
          )}
        </div>

        {/* Right Character: Balloon Penguin */}
        <div className="cake-side-character right">
          <Character type="penguin" variant="party-hat" size={75} />
        </div>
      </div>

      {/* Action Controls */}
      {!allExtinguished && (
        <div className="cake-controls">
          <button
            className="btn-primary cake-blow-trigger-btn"
            onClick={startBlowSequence}
            disabled={blowCountdown !== null}
          >
            {blowCountdown !== null ? 'Blowing... 💨' : 'Blow the Candles 💨'}
          </button>

          {siteConfig.features.micBlow && (
            <button
              className={`pill-button ${isMicListening ? 'active' : ''}`}
              onClick={toggleMic}
            >
              {isMicListening ? copy.micActive : copy.micButton}
            </button>
          )}
        </div>
      )}

      {isMicListening && (
        <p style={{ fontSize: '0.88rem', color: '#DDD6FE', marginBottom: 12 }}>
          {copy.micHelper}
        </p>
      )}

      {micError && (
        <p style={{ fontSize: '0.88rem', color: 'var(--color-pink)', marginBottom: 12 }}>
          {micError}
        </p>
      )}

      {/* Make A Wish Card after all extinguished */}
      {allExtinguished && (
        <div className="wish-reveal-box" role="status" aria-live="polite">
          <div className="wish-stars-header">🎂 ✨ 🎂</div>
          <h2 className="wish-title">MAKE A WISH, CHUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUBA! 💜</h2>
          <p className="wish-line">
            Close your eyes, make a wish from the bottom of your heart... May every single prayer & dream of yours come true this year! 💜
          </p>

          <div className="wish-friends-cheer">
            <Character type="cat" variant="party" size={55} />
            <img
              src={`${import.meta.env.BASE_URL}assets/stickers/whatsapp-sticker.webp`}
              alt="Cheering cute sticker"
              className="wish-cheer-sticker"
            />
            <span className="wish-cheer-badge">Yayyy!! Happy Birthday Chuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuba! 💜🎉</span>
            <Character type="penguin" variant="party-hat" size={55} />
          </div>

          <button
            className="btn-primary blessing-continue-btn"
            onClick={() => dispatch({ type: 'BLOW_CANDLES' })}
            autoFocus
          >
            I've Made My Wish! Receive Lord Perumal's Blessing 🙏✨
          </button>

          <button
            className="pill-button relight-btn"
            onClick={relightCandles}
            style={{
              fontSize: '0.88rem',
              color: '#DDD6FE',
              background: 'rgba(255, 255, 255, 0.08)',
              marginTop: '4px'
            }}
          >
            🕯️ Relight candles to blow again
          </button>
        </div>
      )}
    </main>
  );
};
