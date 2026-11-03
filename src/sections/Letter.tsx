import React, { useState, useEffect } from 'react';
import letterData from '../content/letter.json';
import { Letter as LetterType } from '../types/content';
import { playSFX } from '../audio/sfx';
import { useJourney } from '../journey/JourneyProvider';
import { Character } from '../components/Character';
import './Letter.css';

export const Letter: React.FC = () => {
  const letter = letterData as LetterType;
  const { soundOn } = useJourney();

  const [isOpen, setIsOpen] = useState(false);
  const [typedChars, setTypedChars] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);

  const fullLetterBody = letter.paragraphs.join('\n\n');

  const handleOpenEnvelope = () => {
    playSFX('whoosh', soundOn);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen || isTypingDone) return;

    if (typedChars < fullLetterBody.length) {
      const char = fullLetterBody[typedChars];
      const delay = char === '\n' ? 80 : 24;

      const timer = setTimeout(() => {
        setTypedChars(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setIsTypingDone(true);
    }
  }, [isOpen, typedChars, fullLetterBody, isTypingDone]);

  const showAllInstantly = () => {
    setTypedChars(fullLetterBody.length);
    setIsTypingDone(true);
  };

  return (
    <section id="letter" className="section-wrapper letter-section" aria-labelledby="letter-heading">
      <header className="section-header">
        <h2 id="letter-heading" className="section-title">
          Things I Probably Don't Say Enough... 💌
        </h2>
        <p className="section-subtitle">A letter straight from the heart.</p>
      </header>

      {/* Screen Reader Full Text */}
      <div className="sr-only">
        <p>{letter.greeting}</p>
        {letter.paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
        <p>{letter.closing}</p>
        <p>{letter.signature}</p>
      </div>

      <div className="letter-desk">
        {!isOpen ? (
          <div
            className="envelope-closed-container"
            onClick={handleOpenEnvelope}
            role="button"
            tabIndex={0}
            aria-label="Open birthday letter"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpenEnvelope();
              }
            }}
          >
            <div className="envelope-graphic">
              <div className="envelope-flap" />
              <span className="envelope-seal-heart">💜</span>
            </div>
            <button className="btn-primary" style={{ marginTop: 12 }}>
              Open Letter 💌
            </button>
          </div>
        ) : (
          <>
            <article className="letter-paper" aria-hidden="true">
              {/* Pressed Flower Doodle & Cat Stamp */}
              <div className="doodle-flower">
                <Character type="cat" variant="flower" size={42} />
              </div>

              <h3 className="letter-greeting">{letter.greeting}</h3>

              <div className="letter-body">
                {fullLetterBody.slice(0, typedChars)}
                {!isTypingDone && <span className="blinking-cursor">|</span>}
              </div>

              {isTypingDone && (
                <>
                  <p style={{ marginTop: 24, fontWeight: 700 }}>{letter.closing}</p>
                  <p className="letter-signature">{letter.signature}</p>
                </>
              )}
            </article>

            {!isTypingDone && (
              <div className="letter-controls">
                <button
                  className="pill-button"
                  onClick={showAllInstantly}
                  aria-label="Reveal full letter immediately"
                >
                  Show it all ✨
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
