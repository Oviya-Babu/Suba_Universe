import React, { useState } from 'react';
import quotesData from '../content/quotes.json';
import { playSFX } from '../audio/sfx';
import { useJourney } from '../journey/JourneyProvider';
import './QuoteBreather.css';

interface QuoteBreatherProps {
  initialIndex?: number;
}

export const QuoteBreather: React.FC<QuoteBreatherProps> = ({ initialIndex = 0 }) => {
  const quotes = quotesData as string[];
  const [index, setIndex] = useState(initialIndex % quotes.length);
  const [fade, setFade] = useState(true);
  const { soundOn } = useJourney();

  const handleNextQuote = () => {
    playSFX('pop', soundOn);
    setFade(false);
    setTimeout(() => {
      let next = Math.floor(Math.random() * quotes.length);
      if (next === index && quotes.length > 1) {
        next = (next + 1) % quotes.length;
      }
      setIndex(next);
      setFade(true);
    }, 150);
  };

  return (
    <aside className="quote-breather-band" aria-label="Friendship reflection">
      <div className="quote-inner">
        <span className="quote-star-icon" aria-hidden="true">✨</span>
        <blockquote
          className="quote-text"
          style={{ opacity: fade ? 1 : 0 }}
        >
          “{quotes[index]}”
        </blockquote>
        <button
          className="quote-cycle-btn"
          onClick={handleNextQuote}
          aria-label="Show another quote"
        >
          another one 🔄
        </button>
      </div>
    </aside>
  );
};
