import React from 'react';
import { useJourney } from '../journey/JourneyProvider';
import { playSFX } from '../audio/sfx';
import { CelestialAtmosphere } from '../components/CelestialAtmosphere';
import copyData from '../content/copy.json';
import siteConfig from '../content/site.json';
import './Blessing.css';

export const Blessing: React.FC = () => {
  const { dispatch, soundOn } = useJourney();
  const copy = copyData.blessing;

  const handleOpenUniverse = () => {
    playSFX('chime', soundOn);
    dispatch({ type: 'OPEN_UNIVERSE' });
  };

  return (
    <main className="blessing-container">
      {/* Serene Celestial Aurora & Gold Ambiance */}
      <CelestialAtmosphere variant="blessing" showMoon={false} showShootingStar={false} />

      {/* Warm Golden Glow Backdrop */}
      <div className="blessing-glow-backdrop" aria-hidden="true" />

      {/* Arched Frame with Perumal Image */}
      <div className="blessing-frame">
        <img
          src={`${import.meta.env.BASE_URL}assets/divine/perumal.png`}
          alt={siteConfig.blessing.imageAlt}
          className="blessing-image"
        />
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
