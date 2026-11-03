import React, { useState } from 'react';
import poemsData from '../content/poems.json';
import { Poem } from '../types/content';
import { playSFX } from '../audio/sfx';
import { useJourney } from '../journey/JourneyProvider';
import { Character } from '../components/Character';
import './Kavithai.css';

export const Kavithai: React.FC = () => {
  const poems = poemsData as Poem[];
  const { soundOn } = useJourney();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEnglishTranslation, setShowEnglishTranslation] = useState(true);
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
        <h2 id="kavithai-heading" className="section-title">
          Verses Just for You 💜
        </h2>
        <p className="section-subtitle">
          1 Special Tamil Kavithai & Heartfelt Poems Written for Chuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuba
        </p>
      </header>

      <div className="kavithai-container">
        {/* Top Controls */}
        <div className="kavithai-controls-top">
          <div className="kavithai-badge-wrap">
            {poem.isTamil ? (
              <span className="special-tamil-pill">✨ The One & Only Tamil Kavithai 🌟</span>
            ) : (
              <span className="poem-lang-pill">📖 English Poem {currentIndex + 1} of {poems.length}</span>
            )}
          </div>

          {poem.isTamil && (
            <button
              className={`pill-button ${showEnglishTranslation ? 'active' : ''}`}
              onClick={() => setShowEnglishTranslation(prev => !prev)}
              aria-pressed={showEnglishTranslation}
            >
              {showEnglishTranslation ? 'Hide English Meaning' : 'Show English Meaning 📖'}
            </button>
          )}
        </div>

        {/* Poem Card */}
        <article
          className={`kavithai-card ${poem.isTamil ? 'is-tamil-special' : 'is-english-card'}`}
          style={{ opacity: fade ? 1 : 0 }}
        >
          {poem.isTamil ? (
            <>
              <div className="kavithai-card-header">
                <Character type="cat" variant="flower" size={48} />
                <div>
                  <h3 className="poem-title-ta" lang="ta">
                    {poem.titleTa}
                  </h3>
                  <p className="poem-title-en">{poem.titleEn}</p>
                </div>
              </div>

              <div className="poem-lines-ta" lang="ta">
                {poem.linesTa.map((line, idx) => (
                  <p key={idx} style={{ minHeight: line === '' ? '0.8em' : 'auto' }}>
                    {line}
                  </p>
                ))}
              </div>

              {showEnglishTranslation && (
                <div className="poem-translation-block">
                  <div className="translation-divider">
                    <span>✨ English Translation ✨</span>
                  </div>
                  <div className="poem-lines-en">
                    {poem.linesEn.map((line, idx) => (
                      <p key={idx} style={{ minHeight: line === '' ? '0.8em' : 'auto' }}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="kavithai-card-header">
                <Character type="cat" variant="party" size={44} />
                <h3 className="poem-title-en standalone-en-title">{poem.titleEn}</h3>
              </div>

              <div className="poem-lines-en standalone-en-lines">
                {poem.linesEn.map((line, idx) => (
                  <p key={idx} style={{ minHeight: line === '' ? '0.8em' : 'auto' }}>
                    {line}
                  </p>
                ))}
              </div>
            </>
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
            {poems.map((p, idx) => (
              <button
                key={idx}
                className={`kavithai-dot ${idx === currentIndex ? 'active' : ''} ${p.isTamil ? 'tamil-dot' : ''}`}
                onClick={() => goToPoem(idx)}
                aria-label={`Go to poem ${idx + 1}`}
                title={p.isTamil ? 'Tamil Kavithai' : p.titleEn}
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
