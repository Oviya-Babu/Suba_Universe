import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import surprisesData from '../content/surprises.json';
import copyData from '../content/copy.json';
import { Surprises } from '../types/content';
import { Character } from '../components/Character';
import { playSFX } from '../audio/sfx';
import { fxEngine } from '../fx/engine';
import { useJourney } from '../journey/JourneyProvider';
import './SurpriseArcade.css';

export const SurpriseArcade: React.FC = () => {
  const surprises = surprisesData as Surprises;
  const copy = copyData.arcade;
  const { soundOn, calmMode } = useJourney();

  // 1. Gift boxes
  const [openedBoxes, setOpenedBoxes] = useState<number[]>([]);
  const [activeBoxIdx, setActiveBoxIdx] = useState<number | null>(null);
  const [stellaWishCount, setStellaWishCount] = useState<number>(0);

  const handleOpenBox = (idx: number) => {
    setActiveBoxIdx(idx);
    if (!openedBoxes.includes(idx)) {
      setOpenedBoxes(prev => [...prev, idx]);
    }

    if (idx === 0) {
      playSFX('sparkle', soundOn);
      try {
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.65 },
          colors: ['#FEF08A', '#FDE68A', '#A78BFA', '#38BDF8', '#F472B6']
        });
      } catch (e) {}
    } else if (idx === 1) {
      playSFX('harp', soundOn);
      try {
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#C4B5FD', '#F472B6', '#FEF08A']
        });
      } catch (e) {}
    } else {
      playSFX('pop', soundOn);
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#FBCFE8', '#DDD6FE', '#F5D98B']
        });
      } catch (e) {}
    }
  };

  const handleStellaWish = () => {
    playSFX('sparkle', soundOn);
    setStellaWishCount(prev => prev + 1);
    try {
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { y: 0.55 },
        colors: ['#FEF08A', '#FDE68A', '#A78BFA', '#38BDF8', '#FFFFFF']
      });
    } catch (e) {}
    if (typeof window !== 'undefined') {
      fxEngine.spawnFireworks(window.innerWidth * 0.5, window.innerHeight * 0.4, 35);
    }
  };

  // 2. Scratch Cards
  const [revealedCards, setRevealedCards] = useState<boolean[]>([false, false, false]);

  const initScratchCanvas = (canvas: HTMLCanvasElement | null, idx: number) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Fill with glittery lilac foil
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#C4B5FD');
    grad.addColorStop(0.5, '#A78BFA');
    grad.addColorStop(1, '#8B5CF6');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle sparkles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 20; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, 3, 3);
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Scratch Here ✨', w / 2, h / 2 + 5);

    let isDrawing = false;

    const scratch = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fill();

      // Check percentage cleared
      checkCleared();
    };

    const checkCleared = () => {
      try {
        const imgData = ctx.getImageData(0, 0, w, h);
        let transparent = 0;
        const total = imgData.data.length / 4;
        for (let i = 3; i < imgData.data.length; i += 16) {
          if (imgData.data[i] === 0) transparent++;
        }
        if (transparent / (total / 4) >= 0.5) {
          revealInstant(idx);
        }
      } catch (e) {}
    };

    const onPointerDown = (e: PointerEvent) => {
      isDrawing = true;
      scratch(e.clientX, e.clientY);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDrawing) return;
      scratch(e.clientX, e.clientY);
    };

    const onPointerUp = () => {
      isDrawing = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const revealInstant = (idx: number) => {
    playSFX('sparkle', soundOn);
    setRevealedCards(prev => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  // 3. Wheel
  const wheelCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);

  const drawWheel = () => {
    const canvas = wheelCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = w / 2 - 4;
    const segments = surprises.wheel;
    const segAngle = (Math.PI * 2) / segments.length;

    ctx.clearRect(0, 0, w, h);

    const colors = ['#8B5CF6', '#EC4899', '#A78BFA', '#38BDF8', '#C4B5FD', '#F472B6', '#7C3AED', '#6D28D9'];

    for (let i = 0; i < segments.length; i++) {
      const start = i * segAngle;
      const end = start + segAngle;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.strokeStyle = '#24143F';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + segAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px Nunito, sans-serif';
      ctx.fillText(segments[i], r - 16, 4);
      ctx.restore();
    }

    // Center pin
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#F5D98B';
    ctx.fill();
    ctx.strokeStyle = '#24143F';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  };

  useEffect(() => {
    drawWheel();
  }, []);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWheelResult(null);
    playSFX('whoosh', soundOn);

    const segments = surprises.wheel;
    const segCount = segments.length;
    const segDeg = 360 / segCount;
    // 5 to 8 full spins + a random offset
    const extraRounds = 5 + Math.floor(Math.random() * 4);
    const extraDegrees = Math.floor(Math.random() * 360);
    const nextTotalDeg = rotationDegrees + extraRounds * 360 + extraDegrees;

    setRotationDegrees(nextTotalDeg);

    setTimeout(() => {
      setIsSpinning(false);
      // Top pointer is at 270 deg (12 o'clock)
      const effectiveDeg = (270 - (nextTotalDeg % 360) + 360) % 360;
      const winningIndex = Math.floor(effectiveDeg / segDeg) % segCount;
      setWheelResult(segments[winningIndex]);
      playSFX('sparkle', soundOn);
      try {
        confetti({
          particleCount: 55,
          spread: 85,
          origin: { y: 0.7 },
          colors: ['#A78BFA', '#F472B6', '#FEF08A', '#38BDF8']
        });
      } catch (e) {}
    }, 3200);
  };

  // 4. Tolerance Meter
  const [tolerance, setTolerance] = useState<number>(75);

  const getToleranceLabel = (val: number) => {
    const labels = surprises.toleranceLabels;
    let current = labels[0].label;
    for (const l of labels) {
      if (val >= l.min) current = l.label;
    }
    return current;
  };

  const isOver100 = tolerance > 100;

  return (
    <section id="arcade" className="section-wrapper arcade-section" aria-labelledby="arcade-heading">
      <header className="section-header">
        <h2 id="arcade-heading" className="section-title">{copy.heading}</h2>
      </header>

      <div className="arcade-grid">
        {/* 1. Gift Boxes */}
        <article className="arcade-card">
          <h3 className="arcade-card-title">Mystery Gift Boxes 🎁</h3>
          <p className="arcade-card-desc">Tap a gift box to open your birthday coupon!</p>

          <div className="gift-boxes-row">
            {surprises.giftBoxes.map((_, idx) => {
              const isOpened = openedBoxes.includes(idx);
              const isSelected = activeBoxIdx === idx;
              const boxTitles = ['⭐ Box 1: Stella Star', '🎶 Box 2: A Song', '🤫 Box 3: Secret'];
              return (
                <button
                  key={idx}
                  onClick={() => handleOpenBox(idx)}
                  className={`gift-box-btn ${isOpened ? 'opened' : ''} ${isSelected ? 'active-box' : ''}`}
                  aria-label={`Mystery Box ${idx + 1}, ${isOpened ? 'opened' : 'tap to unwrap'}`}
                >
                  <span className="gift-box-icon">
                    {idx === 0 ? (isOpened ? '🌟' : '🎁') : idx === 1 ? (isOpened ? '🎵' : '🎁') : (isOpened ? '🤫' : '🎁')}
                  </span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                    {boxTitles[idx]}
                  </span>
                  {isOpened && (
                    <span style={{ fontSize: '0.75rem', color: '#FEF08A' }}>
                      ✓ Opened
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Box 1: The Stella Wishing Star */}
          {activeBoxIdx === 0 && (
            <div className="gift-reveal-box stella-box" role="status" aria-live="polite">
              <div className="stella-star-visual" aria-hidden="true">
                <svg viewBox="0 0 200 200" width="160" height="160" className="stella-svg">
                  <defs>
                    <radialGradient id="stellaGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FEF08A" stopOpacity="1" />
                      <stop offset="35%" stopColor="#F472B6" stopOpacity="0.75" />
                      <stop offset="70%" stopColor="#8B5CF6" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Outer Cosmic Halo */}
                  <circle cx="100" cy="100" r="85" fill="url(#stellaGlow)" className="stella-aura" />

                  {/* 8-pointed Cosmic Wishing Star */}
                  <g className="stella-rays" filter="url(#glowFilter)">
                    <polygon
                      points="100,12 112,76 178,88 122,118 144,184 100,138 56,184 78,118 22,88 88,76"
                      fill="#FEF08A"
                    />
                    <polygon
                      points="100,34 118,100 100,166 82,100"
                      fill="#FFFFFF"
                      opacity="0.95"
                    />
                    <polygon
                      points="34,100 100,118 166,100 100,82"
                      fill="#FFFFFF"
                      opacity="0.95"
                    />
                  </g>

                  {/* Orbiting Stardust Pearls */}
                  <circle cx="52" cy="52" r="3.5" fill="#FDE68A" className="stella-pearl p1" />
                  <circle cx="148" cy="52" r="3" fill="#C4B5FD" className="stella-pearl p2" />
                  <circle cx="155" cy="142" r="4" fill="#38BDF8" className="stella-pearl p3" />
                  <circle cx="45" cy="144" r="3" fill="#F472B6" className="stella-pearl p4" />

                  {/* Core Star Node */}
                  <circle cx="100" cy="100" r="14" fill="#FFFFFF" />
                  <circle cx="100" cy="100" r="7" fill="#FEF08A" />
                </svg>
              </div>

              <div className="stella-badge">🌟 THE STELLA WISHING STAR 🌟</div>
              <h4 className="stella-title">Your Miracle is Already on Its Way</h4>

              <p className="stella-message">
                Close your eyes for three seconds, take a deep gentle breath, and hold your wish quietly in your heart, <strong className="highlight-name">Chuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuba 💜</strong>.
              </p>

              <div className="stella-faith-card">
                <p>
                  In this infinite universe of billions of galaxies, this star was lit specifically for you today. Whatever heavy days or quiet worries you have carried in your mind—let them dissolve into light right now.
                </p>
                <p style={{ marginTop: '12px' }}>
                  Believe with complete optimism and high hope: <strong>something so much better, happier, peaceful, and filled with genuine love is arriving in your life.</strong> Every single prayer your heart made is being granted.
                </p>
                <p style={{ marginTop: '12px', color: '#FEF08A', fontWeight: 800 }}>
                  The best chapters of your journey begin today. You are so deeply loved, and the universe has your back! ✨💫
                </p>
              </div>

              <button
                className="btn-primary stella-wish-btn"
                onClick={handleStellaWish}
              >
                ✨ Make a Wish to Stella & Release to the Sky 🌟
                {stellaWishCount > 0 && <span style={{ marginLeft: 6 }}>({stellaWishCount} wishes blessed!)</span>}
              </button>
            </div>
          )}

          {/* Box 2: A Song For You Babe */}
          {activeBoxIdx === 1 && (
            <div className="gift-reveal-box song-box" role="status" aria-live="polite">
              <div className="song-badge">🎶 A SONG FOR YOU BABE 🎶</div>
              <h4 className="song-box-title">Dedicated to your sweet voice 💜</h4>

              <div className="song-lyrics-card">
                <div className="song-cassette-decor" aria-hidden="true">
                  <span className="cassette-tape">📼 TRACK 02 · SPECIAL DEDICATION 💜</span>
                  <div className="cassette-reels">
                    <span className="reel">⚙️</span>
                    <span className="tape-line" />
                    <span className="reel">⚙️</span>
                  </div>
                </div>

                <div className="song-lyrics-text">
                  <p>My baby, I love</p>
                  <p>My baby, I love you voice</p>
                  <p>Oh, my baby, I love</p>
                  <p>Oh my le-e-e-lady</p>
                  <div className="lyrics-divider">✨ 🎵 ✨</div>
                  <p>My baby, I love</p>
                  <p>Oh my baby I love your voice</p>
                  <p>Oh, my baby, I love</p>
                  <p>Oh my le-e-e-lady</p>
                </div>
              </div>

              <a
                href="https://www.youtube.com/watch?v=m9ezpAUvMC8&list=RDm9ezpAUvMC8&start_radio=1"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary song-youtube-link"
                onClick={() => {
                  playSFX('sparkle', soundOn);
                  try {
                    confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
                  } catch (e) {}
                }}
              >
                <span className="yt-play-icon">▶️</span>
                <span>Listen to This Song on YouTube 🎵</span>
              </a>
            </div>
          )}

          {/* Box 3: Top Secret Surprise */}
          {activeBoxIdx === 2 && (
            <div className="gift-reveal-box secret-box" role="status" aria-live="polite">
              <div className="secret-lock-icon">
                <div className="secret-box-visual">
                  <img
                    src={`${import.meta.env.BASE_URL}assets/stickers/whatsapp-sticker.webp`}
                    alt="Cute animated sticker"
                    className="secret-animated-sticker"
                  />
                  <span className="secret-lock-badge">🔒 TOP SECRET 🤫</span>
                  <Character type="penguin" variant="gift" size={70} />
                </div>
              </div>

              <h4 className="secret-title">Surprise #3 is a Secret! 🎁</h4>

              <div className="secret-message-card">
                <p>
                  Some surprises are too precious, too special, and too personal to put on a website screen...
                </p>
                <p className="secret-highlight">
                  ✨ This surprise is locked away with love and will be revealed <strong>when I meet you, babe!</strong> 💜
                </p>
                <p style={{ marginTop: '10px' }}>
                  Until then, keep smiling, keep guessing, and get ready for a big warm hug! 🫂💌
                </p>
              </div>

              <div className="secret-footer-badge">
                <span>🤫 Shhh... See you soon, babe! ✨</span>
              </div>
            </div>
          )}
        </article>

        {/* 2. Scratch Cards */}
        <article className="arcade-card">
          <h3 className="arcade-card-title">Lucky Scratch Cards ✨</h3>
          <p className="arcade-card-desc">Scratch the foil or click reveal for a secret note!</p>

          <div className="scratch-cards-row">
            {surprises.scratchCards.map((secret, idx) => {
              const isRevealed = revealedCards[idx];
              return (
                <div key={idx} className="scratch-card-item">
                  <div className="scratch-secret-text" aria-hidden={!isRevealed}>
                    {secret}
                  </div>

                  {!isRevealed && (
                    <>
                      <canvas
                        ref={(el) => initScratchCanvas(el, idx)}
                        width={200}
                        height={120}
                        className="scratch-canvas"
                      />
                      <button
                        className="scratch-reveal-btn"
                        onClick={() => revealInstant(idx)}
                      >
                        Reveal
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </article>

        {/* 3. Friendship Wheel */}
        <article className="arcade-card">
          <h3 className="arcade-card-title">The Wheel of Friendship 🎡</h3>
          <p className="arcade-card-desc">Spin the wheel to decide our next activity!</p>

          <div className="wheel-container">
            <div className="wheel-cheerleader-badge">
              <img
                src={`${import.meta.env.BASE_URL}assets/stickers/whatsapp-sticker.webp`}
                alt="Cute cheerleader"
                className="wheel-mascot-img"
              />
              <span className="wheel-mascot-speech">Spin for our next adventure! 🎡💜</span>
            </div>

            <div className="wheel-stage">
              <div className="wheel-pointer" aria-hidden="true" />
              <canvas
                ref={wheelCanvasRef}
                width={260}
                height={260}
                className="wheel-canvas"
                style={{
                  transform: `rotate(${rotationDegrees}deg)`,
                  WebkitTransform: `rotate(${rotationDegrees}deg)`,
                  transition: isSpinning ? 'transform 3.2s cubic-bezier(0.12, 0.8, 0.2, 1)' : 'none',
                  WebkitTransition: isSpinning ? '-webkit-transform 3.2s cubic-bezier(0.12, 0.8, 0.2, 1)' : 'none',
                  willChange: 'transform'
                }}
              />
            </div>

            <button
              className="btn-primary wheel-spin-action-btn"
              onClick={spinWheel}
              disabled={isSpinning}
            >
              {isSpinning ? 'Spinning... 💫' : 'Spin the Wheel 🎯'}
            </button>

            {wheelResult && (
              <div className="wheel-result-card" role="status" aria-live="polite">
                ✨ Result: <strong>{wheelResult}</strong>
              </div>
            )}
          </div>
        </article>

        {/* 4. Tolerance Meter */}
        <article className="arcade-card">
          <h3 className="arcade-card-title">{copy.toleranceHeading}</h3>
          <p className="arcade-card-desc">Slide to measure your daily patience level with Oviya:</p>

          <div className="tolerance-meter-box">
            <span className="tolerance-value-display">{tolerance}%</span>
            <input
              type="range"
              min={0}
              max={110}
              value={tolerance}
              onChange={(e) => setTolerance(Number(e.target.value))}
              className="tolerance-slider"
              aria-label="Tolerance meter for Oviya"
              aria-valuetext={`${tolerance}%: ${getToleranceLabel(tolerance)}`}
            />

            <div className="tolerance-label-badge" role="status">
              {getToleranceLabel(tolerance)}
            </div>

            {/* Knocked cat when pushed beyond 100% */}
            {isOver100 ? (
              <div style={{ marginTop: 12 }}>
                <Character type="cat" variant="knocked" size={85} />
                <p style={{ fontSize: '0.88rem', color: 'var(--color-pink)', marginTop: 4 }}>
                  (Cat knocked out by your infinite patience!)
                </p>
              </div>
            ) : (
              <div style={{ marginTop: 8 }}>
                <Character type="cat" variant="normal" size={65} />
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
};
