import React from 'react';

export type CatVariant = 'normal' | 'peeking' | 'sad' | 'flower' | 'party' | 'knocked' | 'waving';
export type PenguinVariant = 'party-hat' | 'gift' | 'scarf' | 'flower-crown' | 'crown' | 'sleepy' | 'crying' | 'waving';

interface CharacterProps {
  type: 'cat' | 'penguin';
  variant?: string;
  size?: number;
  className?: string;
  ariaLabel?: string;
}

export const Character: React.FC<CharacterProps> = ({
  type,
  variant = 'normal',
  size = 80,
  className = '',
  ariaLabel
}) => {
  const isAccessible = Boolean(ariaLabel);

  if (type === 'cat') {
    return (
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={className}
        role={isAccessible ? 'img' : 'presentation'}
        aria-label={ariaLabel}
        aria-hidden={!isAccessible}
        style={{ overflow: 'visible' }}
      >
        {/* Knocked over rotation wrapper if knocked */}
        <g transform={variant === 'knocked' ? 'rotate(90 50 60) translate(0, -10)' : undefined}>
          {/* Tail */}
          <path
            d="M75,65 Q92,50 82,40"
            stroke="#C4B5FD"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />

          {/* Body */}
          <ellipse cx="50" cy="62" rx="30" ry="25" fill="#E8D8FF" />

          {/* Belly highlight */}
          <ellipse cx="50" cy="66" rx="18" ry="15" fill="#FDF8FF" />

          {/* Head */}
          <circle cx="50" cy="36" r="26" fill="#E8D8FF" />

          {/* Ears */}
          <polygon points="26,20 16,6 36,14" fill="#E8D8FF" />
          <polygon points="74,20 84,6 64,14" fill="#E8D8FF" />
          {/* Inner ears */}
          <polygon points="27,19 19,10 34,15" fill="#FBCFE8" />
          <polygon points="73,19 81,10 66,15" fill="#FBCFE8" />

          {/* Eyes & Expressions */}
          {variant === 'sad' ? (
            <>
              {/* Sad arched eyes */}
              <path d="M38,36 Q42,32 46,36" stroke="#4B2E7A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M54,36 Q58,32 62,36" stroke="#4B2E7A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Tear drops */}
              <circle cx="37" cy="42" r="2" fill="#93C5FD" />
              <circle cx="63" cy="42" r="2" fill="#93C5FD" />
            </>
          ) : variant === 'knocked' ? (
            <>
              {/* Dizzy spiral / X eyes */}
              <text x="36" y="38" fontSize="12" fill="#4B2E7A" textAnchor="middle" fontWeight="bold">×</text>
              <text x="64" y="38" fontSize="12" fill="#4B2E7A" textAnchor="middle" fontWeight="bold">×</text>
            </>
          ) : (
            <>
              {/* Big happy eyes */}
              <circle cx="41" cy="34" r="4.5" fill="#3B1E6D" />
              <circle cx="59" cy="34" r="4.5" fill="#3B1E6D" />
              {/* Eye sparkle highlights */}
              <circle cx="43" cy="32" r="1.8" fill="#FFFFFF" />
              <circle cx="61" cy="32" r="1.8" fill="#FFFFFF" />
              <circle cx="39.5" cy="35.5" r="0.8" fill="#FFFFFF" />
              <circle cx="57.5" cy="35.5" r="0.8" fill="#FFFFFF" />
            </>
          )}

          {/* Blush Cheeks */}
          <ellipse cx="32" cy="41" rx="6" ry="3.5" fill="#FBCFE8" opacity="0.85" />
          <ellipse cx="68" cy="41" rx="6" ry="3.5" fill="#FBCFE8" opacity="0.85" />

          {/* Cute Nose */}
          <ellipse cx="50" cy="38" rx="2.5" ry="1.8" fill="#F472B6" />

          {/* Mouth */}
          {variant === 'sad' ? (
            <path d="M47,44 Q50,41 53,44" stroke="#4B2E7A" strokeWidth="2" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M46,41 Q50,45 54,41" stroke="#4B2E7A" strokeWidth="2" fill="none" strokeLinecap="round" />
          )}

          {/* Whiskers */}
          <line x1="22" y1="37" x2="33" y2="38" stroke="#C4B5FD" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="22" y1="42" x2="33" y2="41" stroke="#C4B5FD" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="78" y1="37" x2="67" y2="38" stroke="#C4B5FD" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="78" y1="42" x2="67" y2="41" stroke="#C4B5FD" strokeWidth="1.5" strokeLinecap="round" />

          {/* Accessories per variant */}
          {variant === 'party' && (
            <g transform="translate(42, -5)">
              <polygon points="8,16 0,36 16,36" fill="#F5D98B" />
              <circle cx="8" cy="14" r="3" fill="#FBCFE8" />
              <circle cx="4" cy="28" r="1.5" fill="#A78BFA" />
              <circle cx="12" cy="32" r="1.5" fill="#F472B6" />
            </g>
          )}

          {variant === 'flower' && (
            <g transform="translate(56, 52)">
              <path d="M0,0 Q6,6 8,16" stroke="#4ADE80" strokeWidth="2.5" fill="none" />
              <circle cx="0" cy="0" r="4.5" fill="#FBCFE8" />
              <circle cx="0" cy="0" r="2" fill="#F5D98B" />
            </g>
          )}

          {variant === 'peeking' && (
            <g transform="translate(30, 68)">
              {/* Envelope holding */}
              <rect x="0" y="0" width="40" height="26" rx="4" fill="#EDE9FE" stroke="#A78BFA" strokeWidth="1.5" />
              <path d="M0,0 L20,14 L40,0" stroke="#A78BFA" strokeWidth="1.5" fill="none" />
              {/* Wax heart seal */}
              <circle cx="20" cy="14" r="5" fill="#A78BFA" />
              <path d="M20,12 Q18,10 17,12 Q17,14 20,16 Q23,14 23,12 Q22,10 20,12" fill="#FFFFFF" />
            </g>
          )}

          {variant === 'waving' && (
            <g transform="translate(70, 48)">
              <ellipse cx="4" cy="0" rx="6" ry="4" fill="#E8D8FF" transform="rotate(-30)" />
            </g>
          )}

          {/* Paws */}
          <ellipse cx="40" cy="78" rx="7" ry="5" fill="#FDF8FF" />
          <ellipse cx="60" cy="78" rx="7" ry="5" fill="#FDF8FF" />
        </g>
      </svg>
    );
  }

  // Penguin
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role={isAccessible ? 'img' : 'presentation'}
      aria-label={ariaLabel}
      aria-hidden={!isAccessible}
      style={{ overflow: 'visible' }}
    >
      {/* Flippers */}
      <ellipse cx="23" cy="58" rx="7" ry="15" fill="#2E1B4E" transform="rotate(20 23 58)" />
      {variant === 'waving' ? (
        <ellipse cx="77" cy="46" rx="7" ry="15" fill="#2E1B4E" transform="rotate(-55 77 46)" />
      ) : (
        <ellipse cx="77" cy="58" rx="7" ry="15" fill="#2E1B4E" transform="rotate(-20 77 58)" />
      )}

      {/* Feet */}
      <ellipse cx="38" cy="85" rx="8" ry="4.5" fill="#F5D98B" />
      <ellipse cx="62" cy="85" rx="8" ry="4.5" fill="#F5D98B" />

      {/* Body */}
      <ellipse cx="50" cy="54" rx="29" ry="32" fill="#2E1B4E" />

      {/* White Belly */}
      <ellipse cx="50" cy="58" rx="19" ry="24" fill="#FDF8FF" />

      {/* Cheeks */}
      <ellipse cx="35" cy="45" rx="5" ry="3" fill="#FBCFE8" opacity="0.8" />
      <ellipse cx="65" cy="45" rx="5" ry="3" fill="#FBCFE8" opacity="0.8" />

      {/* Eyes */}
      {variant === 'sleepy' ? (
        <>
          <path d="M38,39 Q42,43 46,39" stroke="#2E1B4E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M54,39 Q58,43 62,39" stroke="#2E1B4E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      ) : variant === 'crying' ? (
        <>
          <path d="M38,40 Q42,36 46,40" stroke="#2E1B4E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M54,40 Q58,36 62,40" stroke="#2E1B4E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="36" cy="45" r="2.5" fill="#93C5FD" />
          <circle cx="64" cy="45" r="2.5" fill="#93C5FD" />
        </>
      ) : (
        <>
          <circle cx="41" cy="38" r="4" fill="#1E1035" />
          <circle cx="59" cy="38" r="4" fill="#1E1035" />
          <circle cx="42.5" cy="36.5" r="1.5" fill="#FFFFFF" />
          <circle cx="60.5" cy="36.5" r="1.5" fill="#FFFFFF" />
        </>
      )}

      {/* Beak */}
      <polygon points="45,41 55,41 50,48" fill="#F5D98B" />

      {/* Accessories */}
      {variant === 'party-hat' && (
        <g transform="translate(42, 6)">
          <polygon points="8,0 0,22 16,22" fill="#A78BFA" />
          <circle cx="8" cy="-1" r="3.5" fill="#F5D98B" />
          <circle cx="6" cy="12" r="1.5" fill="#FBCFE8" />
          <circle cx="11" cy="18" r="1.5" fill="#BFDBFE" />
        </g>
      )}

      {variant === 'crown' && (
        <g transform="translate(40, 14)">
          <polygon points="0,10 4,2 10,7 16,2 20,10" fill="#F5D98B" stroke="#D97706" strokeWidth="0.8" />
          <circle cx="4" cy="2" r="1.2" fill="#F43F5E" />
          <circle cx="10" cy="7" r="1.2" fill="#3B82F6" />
          <circle cx="16" cy="2" r="1.2" fill="#10B981" />
        </g>
      )}

      {variant === 'flower-crown' && (
        <g transform="translate(34, 22)">
          <circle cx="6" cy="2" r="4" fill="#FBCFE8" />
          <circle cx="16" cy="0" r="4" fill="#C4B5FD" />
          <circle cx="26" cy="2" r="4" fill="#FDE047" />
          <circle cx="6" cy="2" r="1.5" fill="#FFFFFF" />
          <circle cx="16" cy="0" r="1.5" fill="#FFFFFF" />
          <circle cx="26" cy="2" r="1.5" fill="#FFFFFF" />
        </g>
      )}

      {variant === 'scarf' && (
        <g transform="translate(32, 47)">
          <path d="M0,0 Q18,6 36,0 Q38,5 34,7 Q18,11 2,7 Z" fill="#F472B6" />
          <rect x="24" y="6" width="7" height="18" rx="2" fill="#F472B6" />
          <line x1="24" y1="24" x2="31" y2="24" stroke="#EDE9FE" strokeWidth="2" strokeDasharray="1,1" />
        </g>
      )}

      {variant === 'gift' && (
        <g transform="translate(36, 56)">
          <rect x="0" y="4" width="28" height="22" rx="3" fill="#A78BFA" />
          <rect x="-2" y="1" width="32" height="5" rx="1.5" fill="#C4B5FD" />
          {/* Ribbon */}
          <rect x="11" y="1" width="6" height="25" fill="#F5D98B" />
          {/* Bow */}
          <ellipse cx="10" cy="0" rx="4" ry="2.5" fill="#F5D98B" transform="rotate(-20 10 0)" />
          <ellipse cx="18" cy="0" rx="4" ry="2.5" fill="#F5D98B" transform="rotate(20 18 0)" />
        </g>
      )}

      {variant === 'sleepy' && (
        <g transform="translate(45, 10)">
          {/* Nightcap */}
          <path d="M-8,14 Q2,-5 16,10" fill="#BFDBFE" />
          <circle cx="18" cy="11" r="3.5" fill="#FFFFFF" />
        </g>
      )}
    </svg>
  );
};
