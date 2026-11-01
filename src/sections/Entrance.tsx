import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useJourney } from '../journey/JourneyProvider';
import { playSFX, getAudioContext } from '../audio/sfx';
import { Character, CatVariant } from '../components/Character';
import { CelestialAtmosphere } from '../components/CelestialAtmosphere';
import copyData from '../content/copy.json';
import './Entrance.css';

export const Entrance: React.FC = () => {
  const { dispatch, soundOn } = useJourney();
  const copy = copyData.entrance;

  const fullText = copy.lines.join('\n\n');
  const [typedLength, setTypedLength] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const typeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // NO button dodge state
  const [noCount, setNoCount] = useState(0);
  const [noMsg, setNoMsg] = useState<string | null>(null);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [catVariant, setCatVariant] = useState<CatVariant>('peeking');
  const [yesScale, setYesScale] = useState(1);

  const yesBtnRef = useRef<HTMLButtonElement | null>(null);
  const noBtnRef = useRef<HTMLButtonElement | null>(null);

  // Typewriter effect (28ms per char)
  useEffect(() => {
    if (isTypingDone) return;

    if (typedLength < fullText.length) {
      typeTimerRef.current = setTimeout(() => {
        setTypedLength(prev => prev + 1);
      }, 28);
      return () => {
        if (typeTimerRef.current) clearTimeout(typeTimerRef.current);
      };
    } else {
      setIsTypingDone(true);
    }
  }, [typedLength, fullText.length, isTypingDone]);

  const completeTyping = () => {
    if (typeTimerRef.current) clearTimeout(typeTimerRef.current);
    setTypedLength(fullText.length);
    setIsTypingDone(true);
  };

  // Dodge NO button
  const handleNoDodge = (isKeyboard = false) => {
    playSFX('pop', soundOn);
    const nextCount = noCount + 1;
    setNoCount(nextCount);

    const msgIndex = (nextCount - 1) % copy.noMessages.length;
    setNoMsg(copy.noMessages[msgIndex]);
    setCatVariant('sad');
    setYesScale(prev => Math.min(1.4, prev + 0.08));

    if (nextCount >= 5 || (isKeyboard && nextCount >= 3)) {
      // Morphs to YES
      return;
    }

    if (!isKeyboard && typeof window !== 'undefined') {
      const padding = 20;
      const btnW = noBtnRef.current?.offsetWidth || 100;
      const btnH = noBtnRef.current?.offsetHeight || 44;
      const maxX = window.innerWidth - btnW - padding;
      const maxY = window.innerHeight - btnH - padding;

      let x = padding;
      let y = padding;

      // Try random positions that don't overlap the YES button
      const yesRect = yesBtnRef.current?.getBoundingClientRect();

      for (let i = 0; i < 15; i++) {
        x = padding + Math.random() * (maxX - padding);
        y = padding + Math.random() * (maxY - padding);

        if (yesRect) {
          const overlapsYes =
            x < yesRect.right + 20 &&
            x + btnW > yesRect.left - 20 &&
            y < yesRect.bottom + 20 &&
            y + btnH > yesRect.top - 20;
          if (!overlapsYes) break;
        }
      }

      setNoPos({ x, y });
    }
  };

  const handleYes = () => {
    getAudioContext();
    playSFX('sparkle', soundOn);

    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#A78BFA', '#C4B5FD', '#FBCFE8', '#F5D98B', '#60A5FA']
      });
    } catch (e) {}

    setTimeout(() => {
      dispatch({ type: 'START_COUNTDOWN' });
    }, 600);
  };

  const isNoMorphed = noCount >= 5;

  return (
    <main className="entrance-container">
      {/* Living Celestial Nebula, Moon & Ambient Butterflies */}
      <CelestialAtmosphere variant="entrance" showMoon={true} showShootingStar={true} />

      <div className="entrance-card" onClick={completeTyping}>
        {/* Washi Tape Strip on Top */}
        <div className="entrance-card-washi" aria-hidden="true" />

        {/* Vintage Postal Stamp Badge */}
        <div className="entrance-card-stamp" aria-hidden="true">
          <span>AIR MAIL · 4 NOV 💌</span>
        </div>

        {/* Cute Subheading Ribbon */}
        <div className="entrance-card-subhead">
          <span>✨ HAPPY BIRTHDAY CHUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUBA 💜 ✨</span>
        </div>

        <div className="typed-text" aria-live="polite">
          {fullText.slice(0, typedLength)}
          {!isTypingDone && <span className="blinking-cursor">|</span>}
        </div>

        {!isTypingDone && (
          <span className="tap-hint">Tap anywhere on letter to reveal instantly ✨</span>
        )}

        {/* Character Peeking */}
        <div className="entrance-character">
          <Character type="cat" variant={catVariant} size={90} />
          {noCount >= 2 && !isNoMorphed && (
            <div style={{ marginTop: -10 }}>
              <Character type="penguin" variant="crying" size={65} />
            </div>
          )}
        </div>

        {/* NO Message Live Region */}
        {noMsg && (
          <div className="no-message-bubble" role="status" aria-live="polite">
            {noMsg}
          </div>
        )}

        {/* Buttons */}
        <div className="entrance-buttons">
          <button
            ref={yesBtnRef}
            className="btn-yes"
            onClick={handleYes}
            style={{ transform: `scale(${yesScale})` }}
          >
            {copy.yesButton}
          </button>

          {!isNoMorphed ? (
            <button
              ref={noBtnRef}
              className={`btn-no ${noPos ? 'btn-no-dodging' : ''}`}
              style={
                noPos
                  ? { left: `${noPos.x}px`, top: `${noPos.y}px` }
                  : undefined
              }
              onPointerDown={(e) => {
                e.preventDefault();
                handleNoDodge(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNoDodge(true);
                }
              }}
            >
              {copy.noButton}
            </button>
          ) : (
            <button
              className="btn-yes"
              onClick={handleYes}
              style={{ background: 'linear-gradient(135deg, #EC4899, #8B5CF6)' }}
            >
              {copy.noMorph}
            </button>
          )}
        </div>
      </div>
    </main>
  );
};
