import React, { useState, useEffect, useRef } from 'react';
import finalData from '../content/final.json';
import photosData from '../content/photos.json';
import { FinalContent, Photo } from '../types/content';
import { Character } from '../components/Character';
import { Lightbox } from '../components/Lightbox';
import { playSFX } from '../audio/sfx';
import { fxEngine } from '../fx/engine';
import { useJourney } from '../journey/JourneyProvider';
import './FinalUniverse.css';

export const FinalUniverse: React.FC = () => {
  const content = finalData as FinalContent;
  const allPhotos = photosData as Photo[];
  const featuredPhotos = allPhotos.filter(p => p.featured);
  const { dispatch, soundOn } = useJourney();

  // Moon secret taps
  const [moonTaps, setMoonTaps] = useState(0);
  const [showPS, setShowPS] = useState(false);

  // Line by line reveal
  const [revealedLinesCount, setRevealedLinesCount] = useState(0);
  const [showEndSubtitle, setShowEndSubtitle] = useState(false);

  // Lightbox for planet polaroids
  const [lightboxPhotoIdx, setLightboxPhotoIdx] = useState<number | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // Staged text reveal
  useEffect(() => {
    if (revealedLinesCount < content.lines.length) {
      const timer = setTimeout(() => {
        setRevealedLinesCount(prev => prev + 1);
      }, 900);
      return () => clearTimeout(timer);
    } else {
      // After all lines, trigger THE END? subtitle after 1.5s
      const timer = setTimeout(() => {
        setShowEndSubtitle(true);
        playSFX('sparkle', soundOn);
        if (typeof window !== 'undefined') {
          fxEngine.spawnFireworks(window.innerWidth * 0.5, window.innerHeight * 0.5, 40);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [revealedLinesCount, content.lines.length, soundOn]);

  const handleMoonTap = () => {
    playSFX('pop', soundOn);
    const next = moonTaps + 1;
    setMoonTaps(next);
    if (next >= 5) {
      setShowPS(true);
      playSFX('sparkle', soundOn);
    }
  };

  const handleReplay = () => {
    playSFX('whoosh', soundOn);
    dispatch({ type: 'REPLAY_UNIVERSE' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const openPlanetLightbox = (photo: Photo, e: React.MouseEvent<HTMLElement>) => {
    openerRef.current = e.currentTarget;
    const origIndex = allPhotos.findIndex(p => p.id === photo.id);
    setLightboxPhotoIdx(origIndex >= 0 ? origIndex : 0);
  };

  return (
    <footer id="final-universe" className="final-universe-section" aria-labelledby="final-heading">
      {/* Star Field Background */}
      <div className="final-universe-stars" aria-hidden="true">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="final-star"
            style={{
              top: `${(i * 17) % 98}%`,
              left: `${(i * 31) % 98}%`,
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              animationDelay: `${(i * 0.3) % 4}s`
            }}
          />
        ))}
      </div>

      {/* Secret Moon */}
      <button
        className="hidden-moon-btn"
        onClick={handleMoonTap}
        aria-label="A glowing moon in the night sky"
        title="Moon"
      >
        🌙
      </button>

      {/* Secret P.S. Card */}
      {showPS && (
        <div className="secret-ps-card" role="status" aria-live="polite">
          {content.hiddenMessage}
        </div>
      )}

      <header className="section-header">
        <h2 id="final-heading" className="section-title">{content.heading} 🌌</h2>
      </header>

      {/* Constellation Photo Planets */}
      <div className="constellation-collage" aria-label="Constellation of memorable photos">
        {featuredPhotos.map((photo, idx) => {
          const angles = [-3, 2.5, -2, 3, -2.5, 2, -3.5, 2.5, -2, 3];
          const rot = angles[idx % angles.length];
          return (
            <div
              key={photo.id}
              className="planet-polaroid"
              style={{
                transform: `rotate(${rot}deg)`,
                animationDelay: `${(idx * 0.4) % 2}s`
              }}
              onClick={(e) => openPlanetLightbox(photo, e)}
              role="button"
              tabIndex={0}
              aria-label={`Featured memory: ${photo.caption}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openPlanetLightbox(photo, e as unknown as React.MouseEvent<HTMLElement>);
                }
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}assets/${photo.src}`}
                alt={photo.alt}
                loading="lazy"
                className="planet-img"
              />
            </div>
          );
        })}
      </div>

      {/* Line by line text card */}
      <article className="final-text-card">
        {content.lines.slice(0, revealedLinesCount).map((line, idx) => (
          <p key={idx} className="final-line">
            {line}
          </p>
        ))}

        {revealedLinesCount >= content.lines.length && (
          <p className="final-signature">{content.signature}</p>
        )}
      </article>

      {/* THE END? Nahhh */}
      {revealedLinesCount >= content.lines.length && (
        <div className="the-end-box">
          <span className="the-end-title">{content.endTitle}</span>
          {showEndSubtitle && (
            <span className="the-end-subtitle">{content.endSubtitle}</span>
          )}
        </div>
      )}

      {/* Waving Characters */}
      <div className="waving-friends-row">
        <Character type="cat" variant="waving" size={75} />
        <img
          src={`${import.meta.env.BASE_URL}assets/stickers/whatsapp-sticker.webp`}
          alt="Cute waving animated sticker"
          className="final-waving-sticker"
        />
        <Character type="penguin" variant="waving" size={75} />
      </div>

      {/* Action Navigation Buttons */}
      <div className="final-buttons-row">
        <button className="btn-primary" onClick={handleReplay}>
          {content.buttons.replay}
        </button>
        <button className="pill-button" onClick={() => scrollToSection('scrapbook')}>
          {content.buttons.memories}
        </button>
        <button className="pill-button" onClick={() => scrollToSection('letter')}>
          {content.buttons.letter}
        </button>
      </div>

      {/* Lightbox */}
      <Lightbox
        photos={allPhotos}
        currentIndex={lightboxPhotoIdx ?? 0}
        isOpen={lightboxPhotoIdx !== null}
        onClose={() => setLightboxPhotoIdx(null)}
        onSelectIndex={(idx) => setLightboxPhotoIdx(idx)}
        openerRef={openerRef.current}
      />
    </footer>
  );
};
