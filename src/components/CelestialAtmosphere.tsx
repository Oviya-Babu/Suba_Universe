import React from 'react';
import './CelestialAtmosphere.css';

interface CelestialAtmosphereProps {
  showMoon?: boolean;
  showShootingStar?: boolean;
  variant?: 'entrance' | 'countdown' | 'cake' | 'blessing' | 'universe';
}

export const CelestialAtmosphere: React.FC<CelestialAtmosphereProps> = ({
  showMoon = true,
  showShootingStar = true,
  variant = 'entrance'
}) => {
  return (
    <div className={`celestial-atmosphere ${variant}`} aria-hidden="true">
      {/* 1. Dreamy Aurora Blobs */}
      <div className="aurora-blob blob-purple" />
      <div className="aurora-blob blob-blue" />
      <div className="aurora-blob blob-pink" />

      {/* 2. Paper Stardust Texture Overlay */}
      <div className="stardust-texture-overlay" />

      {/* 3. Shooting Star Streak */}
      {showShootingStar && <div className="shooting-star-streak" />}

      {/* 4. Handcrafted Doodle Moon (with cute sleeping smile & halo) */}
      {showMoon && (
        <div className="doodle-moon-wrapper">
          <svg viewBox="0 0 100 100" className="doodle-moon-svg">
            <defs>
              <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#F5D98B" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#F5D98B" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Halo */}
            <circle cx="50" cy="50" r="44" fill="url(#moonGlow)" />
            {/* Moon Crescent */}
            <path
              d="M56,22 C40,22 26,35 26,52 C26,69 40,82 56,82 C44,78 36,66 36,52 C36,38 44,26 56,22 Z"
              fill="#FEF08A"
              stroke="#FDE047"
              strokeWidth="1.5"
            />
            {/* Cute sleeping eye & rosy cheek */}
            <path
              d="M38,50 Q41,54 44,50"
              stroke="#854D0E"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="39" cy="56" r="2.5" fill="#F472B6" opacity="0.75" />
            {/* Tiny companion star */}
            <path
              d="M68,36 L70,41 L75,41 L71,44 L73,49 L68,46 L63,49 L65,44 L61,41 L66,41 Z"
              fill="#FFFFFF"
              className="twinkle-slow"
            />
          </svg>
        </div>
      )}

      {/* 5. Scrapbook Constellation Doodles */}
      <svg className="constellation-doodles" viewBox="0 0 600 400" preserveAspectRatio="none">
        {/* Soft connecting constellation lines */}
        <path
          d="M 60,80 L 120,50 L 180,95 L 240,65"
          stroke="rgba(196, 181, 253, 0.28)"
          strokeWidth="1"
          strokeDasharray="3,4"
          fill="none"
        />
        <path
          d="M 380,80 L 450,110 L 520,70"
          stroke="rgba(147, 197, 253, 0.28)"
          strokeWidth="1"
          strokeDasharray="3,4"
          fill="none"
        />
        {/* Constellation Star Nodes */}
        <circle cx="60" cy="80" r="2.5" fill="#C4B5FD" />
        <circle cx="120" cy="50" r="3" fill="#93C5FD" />
        <circle cx="180" cy="95" r="2.5" fill="#FBCFE8" />
        <circle cx="240" cy="65" r="3" fill="#FDE68A" />
        <circle cx="380" cy="80" r="2.5" fill="#93C5FD" />
        <circle cx="450" cy="110" r="3" fill="#C4B5FD" />
        <circle cx="520" cy="70" r="2.5" fill="#FEF08A" />
      </svg>

      {/* 6. Cute Dreamy Cloud with rosy cheeks */}
      <div className="doodle-cloud cloud-left">
        <svg viewBox="0 0 120 70" width="100%" height="100%">
          <path
            d="M20,55 Q5,55 10,40 Q12,25 30,25 Q35,10 55,12 Q75,10 82,25 Q98,25 102,40 Q110,55 95,55 Z"
            fill="rgba(255, 255, 255, 0.08)"
            stroke="rgba(221, 214, 254, 0.25)"
            strokeWidth="1.2"
          />
          {/* Sleeping face */}
          <path d="M48,36 Q52,40 56,36" stroke="rgba(221, 214, 254, 0.6)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M64,36 Q68,40 72,36" stroke="rgba(221, 214, 254, 0.6)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <circle cx="46" cy="42" r="2.5" fill="rgba(244, 114, 182, 0.45)" />
          <circle cx="74" cy="42" r="2.5" fill="rgba(244, 114, 182, 0.45)" />
        </svg>
      </div>

      <div className="doodle-cloud cloud-right">
        <svg viewBox="0 0 110 65" width="100%" height="100%">
          <path
            d="M18,50 Q4,50 8,36 Q10,22 28,22 Q32,8 50,10 Q68,8 74,22 Q88,22 92,36 Q100,50 86,50 Z"
            fill="rgba(255, 255, 255, 0.06)"
            stroke="rgba(191, 219, 254, 0.22)"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      {/* 7. Twinkling Scrapbook Stars */}
      <div className="ambient-stars-container">
        {[...Array(28)].map((_, i) => (
          <div
            key={i}
            className={`scrapbook-star star-variant-${i % 4}`}
            style={{
              top: `${(i * 17 + 8) % 92}%`,
              left: `${(i * 29 + 5) % 94}%`,
              animationDelay: `${(i * 0.35) % 4}s`,
              animationDuration: `${2.4 + (i % 3) * 0.8}s`
            }}
          >
            {i % 3 === 0 ? '✦' : i % 3 === 1 ? '✧' : '⋆'}
          </div>
        ))}
      </div>

      {/* 8. Floating Aesthetic Background Butterflies */}
      <div className="ambient-butterfly butterfly-1">
        <svg viewBox="0 0 40 35" width="28" height="24">
          <path d="M20,17 Q8,4 3,11 Q-1,17 9,23 Q16,21 20,17 Z" fill="#C4B5FD" opacity="0.75" />
          <path d="M20,17 Q32,4 37,11 Q41,17 31,23 Q24,21 20,17 Z" fill="#C4B5FD" opacity="0.75" />
          <path d="M20,17 Q12,23 10,28 Q9,33 16,30 Q19,26 20,17 Z" fill="#93C5FD" opacity="0.8" />
          <path d="M20,17 Q28,23 30,28 Q31,33 24,30 Q21,26 20,17 Z" fill="#93C5FD" opacity="0.8" />
          <ellipse cx="20" cy="18" rx="1.8" ry="6" fill="#FFFFFF" />
        </svg>
      </div>

      <div className="ambient-butterfly butterfly-2">
        <svg viewBox="0 0 40 35" width="24" height="20">
          <path d="M20,17 Q8,4 3,11 Q-1,17 9,23 Q16,21 20,17 Z" fill="#93C5FD" opacity="0.75" />
          <path d="M20,17 Q32,4 37,11 Q41,17 31,23 Q24,21 20,17 Z" fill="#93C5FD" opacity="0.75" />
          <path d="M20,17 Q12,23 10,28 Q9,33 16,30 Q19,26 20,17 Z" fill="#FBCFE8" opacity="0.8" />
          <path d="M20,17 Q28,23 30,28 Q31,33 24,30 Q21,26 20,17 Z" fill="#FBCFE8" opacity="0.8" />
          <ellipse cx="20" cy="18" rx="1.5" ry="5" fill="#FFFFFF" />
        </svg>
      </div>
    </div>
  );
};

