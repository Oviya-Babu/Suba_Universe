import React, { useState } from 'react';
import { useJourney } from '../journey/JourneyProvider';
import { playSFX } from '../audio/sfx';
import { CelestialAtmosphere } from '../components/CelestialAtmosphere';
import copyData from '../content/copy.json';
import siteConfig from '../content/site.json';
import './Blessing.css';

export const Blessing: React.FC = () => {
  const { dispatch, soundOn } = useJourney();
  const copy = copyData.blessing;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(`${import.meta.env.BASE_URL}assets/divine/perumal-fast.webp`);

  const handleOpenUniverse = () => {
    playSFX('chime', soundOn);
    dispatch({ type: 'OPEN_UNIVERSE' });
  };

  const handleImageError = () => {
    // Robust fallback ladder: fast.webp -> perumal.webp -> perumal.jpg -> perumal.png
    if (imgSrc.includes('perumal-fast.webp')) {
      setImgSrc(`${import.meta.env.BASE_URL}assets/divine/perumal.webp`);
    } else if (imgSrc.includes('perumal.webp')) {
      setImgSrc(`${import.meta.env.BASE_URL}assets/divine/perumal.jpg`);
    } else if (imgSrc.includes('perumal.jpg')) {
      setImgSrc(`${import.meta.env.BASE_URL}assets/divine/perumal.png`);
    }
  };

  return (
    <main className="blessing-container">
      {/* Serene Celestial Aurora & Gold Ambiance */}
      <CelestialAtmosphere variant="blessing" showMoon={false} showShootingStar={false} />

      {/* Warm Golden Glow Backdrop */}
      <div className="blessing-glow-backdrop" aria-hidden="true" />

      {/* Arched Frame with Perumal Image */}
      <div className={`blessing-frame ${imageLoaded ? 'is-loaded' : 'is-loading'}`}>
        {!imageLoaded && (
          <div className="blessing-placeholder" aria-hidden="true">
            <span className="blessing-shimmer" />
            <span className="blessing-om">🕉️</span>
          </div>
        )}
        <picture>
          <source
            type="image/webp"
            srcSet={`${import.meta.env.BASE_URL}assets/divine/perumal-fast.webp 420w, ${import.meta.env.BASE_URL}assets/divine/perumal.webp 736w`}
            sizes="(max-width: 480px) 280px, 320px"
          />
          <source
            type="image/jpeg"
            srcSet={`${import.meta.env.BASE_URL}assets/divine/perumal.jpg 736w`}
            sizes="(max-width: 480px) 280px, 320px"
          />
          <img
            src={imgSrc}
            alt={siteConfig.blessing.imageAlt}
            className={`blessing-image ${imageLoaded ? 'visible' : 'hidden'}`}
            loading="eager"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
          />
        </picture>
      </div>

      {/* Blessing Text */}
      <article className="blessing-text-card">
        {copy.paragraphs.map((p, idx) => (
          <p
            key={idx}
            className={`blessing-paragraph ${idx === 0 || idx === copy.paragraphs.length - 1 ? 'highlight' : ''}`}
          >
            {p}
          </p>
        ))}

        <div className="blessing-btn-wrapper">
          <button
            className="btn-primary"
            onClick={handleOpenUniverse}
            style={{
              background: 'linear-gradient(135deg, #F5D98B, #D97706)',
              color: '#1E1035',
              fontWeight: 800
            }}
          >
            {copy.continue}
          </button>
        </div>
      </article>
    </main>
  );
};
