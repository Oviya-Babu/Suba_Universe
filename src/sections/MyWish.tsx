import React, { useEffect, useRef, useState } from 'react';
import wishData from '../content/wish.json';
import { Wish as WishType } from '../types/content';
import { Character } from '../components/Character';
import './MyWish.css';

export const MyWish: React.FC = () => {
  const wish = wishData as WishType;
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              setRevealedIndices((prev) => new Set(prev).add(index));
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [wish.paragraphs.length]);

  return (
    <section id="my-wish" className="section-wrapper my-wish-section" aria-labelledby="wish-heading">
      <header className="section-header">
        <h2 id="wish-heading" className="section-title">{wish.heading} 🌟</h2>
        <p className="section-subtitle">A few wishes whispered to the stars.</p>
      </header>

      <div className="wish-card-container">
        {wish.paragraphs.map((p, idx) => {
          const isRevealed = revealedIndices.has(idx);
          const isLast = idx === wish.paragraphs.length - 1;

          if (isLast) {
            return (
              <div
                key={idx}
                ref={(el) => { itemRefs.current[idx] = el; }}
                data-index={idx}
                className="wish-closing-box"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Character type="cat" variant="flower" size={60} />
                  <span className="wish-bday-line">{p}</span>
                  <Character type="penguin" variant="flower-crown" size={60} />
                </div>
              </div>
            );
          }

          return (
            <div
              key={idx}
              ref={(el) => { itemRefs.current[idx] = el; }}
              data-index={idx}
              className={`wish-paragraph-item ${isRevealed ? 'revealed' : ''}`}
            >
              <span className="wish-star" aria-hidden="true">★</span>
              <p className="wish-paragraph-text">{p}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
