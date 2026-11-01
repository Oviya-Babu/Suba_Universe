import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import flowersData from '../content/flowers.json';
import copyData from '../content/copy.json';
import { Flower } from '../types/content';
import { Character } from '../components/Character';
import { playSFX } from '../audio/sfx';
import { fxEngine } from '../fx/engine';
import { useJourney } from '../journey/JourneyProvider';
import './Flowers.css';

export const Flowers: React.FC = () => {
  const flowers = flowersData as Flower[];
  const copy = copyData.flowers;
  const { soundOn } = useJourney();

  const [activeFlowerId, setActiveFlowerId] = useState<string | null>(null);
  const [bloomingId, setBloomingId] = useState<string | null>(null);
  const [showBouquet, setShowBouquet] = useState(false);

  const handleCollectBouquet = () => {
    playSFX('harp', soundOn);
    setShowBouquet(true);
    try {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FBCFE8', '#C4B5FD', '#F5D98B', '#EDE9FE', '#BFDBFE']
      });
    } catch {}
  };

  const handleFlowerTap = (flower: Flower, e: React.MouseEvent<HTMLButtonElement>) => {
    playSFX('sparkle', soundOn);
    setActiveFlowerId(flower.id);
    setBloomingId(flower.id);

    // Spawn petals and hearts at click position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;
    fxEngine.spawnPetals(x, y, 5);
    fxEngine.spawnHearts(x, y - 20, 2);

    setTimeout(() => {
      setBloomingId(null);
    }, 500);
  };

  const activeFlower = flowers.find(f => f.id === activeFlowerId);

  // Render SVG Flower based on type
  const renderFlowerSVG = (type: Flower['type'], color: string) => {
    switch (type) {
      case 'lavender':
        return (
          <svg viewBox="0 0 50 110" width="40" height="90" className="flower-sway">
            <path d="M25,110 Q24,60 25,20" stroke="#4ADE80" strokeWidth="3" fill="none" />
            {/* Florets */}
            {[20, 32, 44, 56, 68].map((y, idx) => (
              <g key={idx}>
                <ellipse cx="20" cy={y} rx="5" ry="3.5" fill={color} />
                <ellipse cx="30" cy={y - 4} rx="5" ry="3.5" fill={color} />
                <ellipse cx="25" cy={y - 8} rx="4" ry="3" fill="#EDE9FE" />
              </g>
            ))}
          </svg>
        );

      case 'tulip':
        return (
          <svg viewBox="0 0 50 110" width="40" height="90" className="flower-sway">
            <path d="M25,110 Q28,70 25,35" stroke="#4ADE80" strokeWidth="3" fill="none" />
            <path d="M25,80 Q40,65 35,50" stroke="#4ADE80" strokeWidth="2.5" fill="none" />
            {/* Tulip cup */}
            <path
              d="M14,38 C14,54 36,54 36,38 C36,25 31,18 25,28 C19,18 14,25 14,38 Z"
              fill={color}
              stroke="#DB2777"
              strokeWidth="1"
            />
          </svg>
        );

      case 'rose':
        return (
          <svg viewBox="0 0 50 110" width="40" height="90" className="flower-sway">
            <path d="M25,110 Q22,70 25,35" stroke="#4ADE80" strokeWidth="3" fill="none" />
            {/* Rose petals */}
            <circle cx="25" cy="30" r="16" fill={color} />
            <circle cx="25" cy="30" r="11" fill="#F43F5E" />
            <circle cx="25" cy="30" r="6" fill="#BE123C" />
            <circle cx="25" cy="30" r="2.5" fill="#FFE4E6" />
          </svg>
        );

      case 'daisy':
        return (
          <svg viewBox="0 0 50 110" width="40" height="90" className="flower-sway">
            <path d="M25,110 Q26,70 25,35" stroke="#4ADE80" strokeWidth="3" fill="none" />
            {/* Daisy Petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <ellipse
                key={angle}
                cx="25"
                cy="30"
                rx="4.5"
                ry="12"
                fill="#FFFFFF"
                transform={`rotate(${angle} 25 30)`}
              />
            ))}
            {/* Center */}
            <circle cx="25" cy="30" r="6.5" fill="#F59E0B" />
          </svg>
        );

      case 'lily':
        return (
          <svg viewBox="0 0 50 110" width="40" height="90" className="flower-sway">
            <path d="M25,110 Q23,65 25,35" stroke="#4ADE80" strokeWidth="3" fill="none" />
            {/* Star-flare Lily petals */}
            <polygon points="25,14 29,26 40,28 31,34 34,46 25,38 16,46 19,34 10,28 21,26" fill={color} />
            <circle cx="25" cy="30" r="3.5" fill="#FCD34D" />
          </svg>
        );

      case 'wildflower':
      default:
        return (
          <svg viewBox="0 0 50 110" width="40" height="90" className="flower-sway">
            <path d="M25,110 Q27,70 25,35" stroke="#4ADE80" strokeWidth="3" fill="none" />
            {/* Wildflower rounded petals */}
            {[0, 72, 144, 216, 288].map((angle) => (
              <circle
                key={angle}
                cx={25 + Math.cos((angle * Math.PI) / 180) * 10}
                cy={30 + Math.sin((angle * Math.PI) / 180) * 10}
                r="6"
                fill={color}
              />
            ))}
            <circle cx="25" cy="30" r="4.5" fill="#FEF08A" />
          </svg>
        );
    }
  };

  return (
    <section id="flowers" className="section-wrapper flowers-section" aria-labelledby="flowers-heading">
      <header className="section-header">
        <h2 id="flowers-heading" className="section-title">{copy.heading}</h2>
      </header>

      <p className="flowers-intro-text">
        {copy.intro}
      </p>

      {/* Garden Scene */}
      <div className="garden-scene">
        {/* Cat holding flower at side */}
        <div style={{ position: 'absolute', bottom: 10, right: 12, zIndex: 5 }}>
          <Character type="cat" variant="flower" size={60} />
        </div>

        <div className="garden-flowers-row">
          {flowers.map((fl) => {
            const isBlooming = fl.id === bloomingId;
            return (
              <button
                key={fl.id}
                onClick={(e) => handleFlowerTap(fl, e)}
                className={`flower-interactive-btn ${isBlooming ? 'blooming' : ''}`}
                aria-label={`${fl.label}, tap for a message`}
              >
                {renderFlowerSVG(fl.type, fl.color)}
                <span className="flower-label">{fl.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Flower Message Card */}
      {activeFlower && !showBouquet && (
        <div className="flower-message-card" role="status" aria-live="polite">
          <h3 className="flower-message-title">🌸 {activeFlower.label}</h3>
          <p className="flower-message-text">{activeFlower.message}</p>
        </div>
      )}

      {/* Gather Bouquet Action */}
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button
          className="pill-button"
          onClick={handleCollectBouquet}
          style={{
            background: 'linear-gradient(135deg, rgba(251, 207, 232, 0.25), rgba(196, 181, 253, 0.25))',
            border: '1px solid rgba(251, 207, 232, 0.5)',
            padding: '10px 22px',
            fontSize: '0.95rem'
          }}
        >
          💐 Gather My Birthday Bouquet
        </button>
      </div>

      {/* Bouquet Reveal Modal Card */}
      {showBouquet && (
        <div
          className="flower-message-card"
          role="status"
          aria-live="polite"
          style={{
            marginTop: 20,
            background: 'linear-gradient(145deg, rgba(36, 20, 63, 0.85), rgba(75, 46, 122, 0.75))',
            border: '1.5px solid var(--color-gold)'
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>💐✨</div>
          <h3 className="flower-message-title" style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-hand)', fontSize: '1.8rem' }}>
            A Bouquet of Pure Love
          </h3>
          <p className="flower-message-text" style={{ fontSize: '1.15rem', lineHeight: 1.7, color: 'var(--color-text-on-dark)' }}>
            Every flower in this little universe carries a piece of gratitude: for your kindness, your patience, your non-judgmental heart, and the magic of having you as my person. You deserve all the beauty in this world! 💜
          </p>
          <button
            className="pill-button"
            onClick={() => setShowBouquet(false)}
            style={{ marginTop: 12, fontSize: '0.82rem' }}
          >
            Close Bouquet 🌸
          </button>
        </div>
      )}
    </section>
  );
};
