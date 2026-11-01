import React, { useState } from 'react';
import poemsData from '../content/poems.json';
import { Poem } from '../types/content';
import { playSFX } from '../audio/sfx';
import { useJourney } from '../journey/JourneyProvider';
import './Kavithai.css';

export const Kavithai: React.FC = () => {
  const poems = poemsData as Poem[];
  const { soundOn } = useJourney();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEnglish, setShowEnglish] = useState(true);
  const [fade, setFade] = useState(true);

  const poem = poems[currentIndex];

  const goToPoem = (index: number) => {
    playSFX('pop', soundOn);
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setFade(true);
    }, 150);
  };

  const handlePrev = () => {
    const prev = (currentIndex - 1 + poems.length) % poems.length;
    goToPoem(prev);
  };

  const handleNext = () => {
    const next = (currentIndex + 1) % poems.length;
    goToPoem(next);
  };

  return (
    <section id="kavithai" className="section-wrapper kavithai-section" aria-labelledby="kavithai-heading">
      <header className="section-header">
        <h2 id="kavithai-heading" className="section-title tamil-text" lang="ta" style={{ textAlign: 'center' }}>
          உனக்காக சில வரிகள்... 💜
        </h2>
        <p className="section-subtitle">Original verses written just for you.</p>
      </header>

      <div className="kavithai-container">
        {/* Top Controls: English Toggle */}
        <div className="kavithai-controls-top">
          <span style={{ fontSize: '0.88rem', color: 'var(--color-lavender)' }}>
            Poem {currentIndex + 1} of {poems.length}
          </span>
          <button
            className={`pill-button ${showEnglish ? 'active' : ''}`}
            onClick={() => setShowEnglish(prev => !prev)}
            aria-pressed={showEnglish}
          >
            {showEnglish ? 'Hide English 📖' : 'Show English 📖'}
          </button>
        </div>

        {/* Poem Card */}
        <article
          className="kavithai-card"
          style={{ opacity: fade ? 1 : 0 }}
        >
          <h3 className="poem-title-ta" lang="ta">
            {poem.titleTa}
          </h3>
          <p className="poem-title-en">({poem.titleEn})</p>

          <div className="poem-lines-ta" lang="ta">
            {poem.linesTa.map((line, idx) => (
              <p key={idx} style={{ minHeight: line === '' ? '1em' : 'auto' }}>
                {line}
              </p>
            ))}
          </div>

          {showEnglish && (
            <div className="poem-lines-en">
              {poem.linesEn.map((line, idx) => (
                <p key={idx} style={{ minHeight: line === '' ? '1em' : 'auto' }}>
                  {line}
                </p>
              ))}
            </div>
          )}
        </article>

        {/* Navigation & Dots */}
        <div className="kavithai-nav-row">
          <button
            onClick={handlePrev}
            className="pill-button"
            aria-label="Previous poem"
          >
            ‹ Prev
          </button>

          <div className="kavithai-dots">
            {poems.map((_, idx) => (
              <button
                key={idx}
                className={`kavithai-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => goToPoem(idx)}
                aria-label={`Go to poem ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="pill-button"
            aria-label="Next poem"
          >
            Next ›
          </button>
        </div>
      </div>
    </section>
  );
};
