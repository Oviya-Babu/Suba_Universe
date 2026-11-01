import React, { useState } from 'react';
import penguinsData from '../content/penguins.json';
import copyData from '../content/copy.json';
import { Penguin } from '../types/content';
import { Character, CatVariant } from '../components/Character';
import { playSFX } from '../audio/sfx';
import { useJourney } from '../journey/JourneyProvider';
import './PenguinCorner.css';

export const PenguinCorner: React.FC = () => {
  const penguins = penguinsData as Penguin[];
  const copy = copyData.penguins;
  const { soundOn } = useJourney();

  const [activePenguinId, setActivePenguinId] = useState<string | null>(null);
  const [visitedIds, setVisitedIds] = useState<Set<string>>(new Set());
  const [hoppingId, setHoppingId] = useState<string | null>(null);

  const handlePenguinClick = (p: Penguin) => {
    playSFX('pop', soundOn);
    setActivePenguinId(p.id);
    setVisitedIds(prev => new Set(prev).add(p.id));

    setHoppingId(p.id);
    setTimeout(() => {
      setHoppingId(null);
    }, 450);
  };

  const activePenguin = penguins.find(p => p.id === activePenguinId);
  const allFound = visitedIds.size === penguins.length;

  const catCameoVariants: CatVariant[] = ['normal', 'flower', 'waving'];
  const [pettedCatIdx, setPettedCatIdx] = useState<number | null>(null);

  const handlePetCat = (idx: number) => {
    playSFX('meow', soundOn);
    setPettedCatIdx(idx);
    setTimeout(() => setPettedCatIdx(null), 500);
  };

  return (
    <section id="penguins" className="section-wrapper penguins-section" aria-labelledby="penguins-heading">
      <header className="section-header">
        <h2 id="penguins-heading" className="section-title">Penguin & Cat Corner 🐧🐱</h2>
        <p className="section-subtitle">{copy.heading}</p>
      </header>

      {/* Counter Pill */}
      <div style={{ textAlign: 'center' }}>
        <div className="penguin-counter-pill">
          <span>🐧</span>
          <span>You've met {visitedIds.size} of {penguins.length} penguins</span>
        </div>
      </div>

      {/* Bonus All Found Badge */}
      {allFound && (
        <div style={{ textAlign: 'center' }}>
          <div className="all-found-badge">
            {copy.allFound}
          </div>
        </div>
      )}

      {/* Speech Bubble */}
      {activePenguin && (
        <div className="penguin-speech-bubble" role="status" aria-live="polite">
          <p>{activePenguin.message}</p>
        </div>
      )}

      {/* Penguins Grid */}
      <div className="penguin-grid">
        {penguins.map((p) => {
          const isActive = p.id === activePenguinId;
          const isHopping = p.id === hoppingId;
          const isVisited = visitedIds.has(p.id);

          return (
            <button
              key={p.id}
              onClick={() => handlePenguinClick(p)}
              className={`penguin-card ${isActive ? 'active' : ''} ${isHopping ? 'hopping' : ''}`}
              aria-label={`${p.name}, variant ${p.variant}. ${isVisited ? 'Already visited.' : 'Not yet visited.'}`}
            >
              <div className="penguin-svg">
                <Character type="penguin" variant={p.variant} size={70} />
              </div>
              <span className="penguin-name">{p.name}</span>
              {isVisited && (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>
                  ✓ visited
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3 Cat Cameos */}
      <div className="cat-cameos-shelf">
        <h3 style={{ fontSize: '1.25rem', color: 'var(--color-lavender-50)', marginBottom: 4 }}>
          The Cat Council 🐾
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
          They demanded their own section.
        </p>

        <div className="cat-cameos-grid">
          {copy.catCameos.map((line, idx) => (
            <button
              key={idx}
              className={`cat-cameo-card ${pettedCatIdx === idx ? 'petted' : ''}`}
              onClick={() => handlePetCat(idx)}
              aria-label={`Pet this cat: ${line}`}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(196, 181, 253, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'transform 0.25s var(--ease-bounce)',
                transform: pettedCatIdx === idx ? 'scale(1.08)' : 'scale(1)'
              }}
            >
              <Character type="cat" variant={catCameoVariants[idx % catCameoVariants.length]} size={65} />
              <p className="cat-cameo-line" style={{ margin: 0 }}>"{line}"</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', opacity: 0.8 }}>
                {pettedCatIdx === idx ? 'Purr... 💜' : 'Tap to pet 🐾'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
