import React, { useState, useRef } from 'react';
import photosData from '../content/photos.json';
import videosData from '../content/videos.json';
import copyData from '../content/copy.json';
import { Photo, Video } from '../types/content';
import { Lightbox } from '../components/Lightbox';
import { useAudio } from '../audio/AudioProvider';
import './Scrapbook.css';

// Deterministic rotation generator seeded by index
function getRotation(index: number): number {
  const angles = [-2, 1.8, -1.2, 2.2, -1.8, 1.2, -2.2, 1.5, -1.5, 2.0];
  return angles[index % angles.length];
}

const getBadge = (photoId: string): string | null => {
  switch (photoId) {
    case 'photo-01': return '✨ Birthday Girl';
    case 'photo-03': return '💜 Bestie Vibe';
    case 'photo-05': return '😂 Mood';
    case 'photo-08': return '🌸 The Girls';
    case 'photo-10': return '🕶️ Iconic AF';
    case 'photo-12': return '🐱 Cat Energy';
    case 'photo-16': return '💖 Pure Joy';
    case 'photo-21': return '👑 So Regal';
    case 'photo-25': return '🌈 Cozy Winter';
    case 'photo-28': return '🌴 Paradise';
    case 'photo-35': return '✌️ Peace & Love';
    default: return null;
  }
};

export const Scrapbook: React.FC = () => {
  const photos = photosData as Photo[];
  const videos = videosData as Video[];
  const copy = copyData.scrapbook;
  const { pauseMusic } = useAudio();

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const openLightbox = (index: number, e: React.MouseEvent<HTMLElement>) => {
    openerRef.current = e.currentTarget;
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  return (
    <section id="scrapbook" className="scrapbook-section" aria-labelledby="scrapbook-heading">
      <header className="section-header">
        <h2 id="scrapbook-heading" className="section-title">{copy.heading}</h2>
        <p className="section-subtitle">{copy.sub}</p>
      </header>

      {/* 37 Photos Masonry Scrapbook */}
      <div className="scrapbook-grid">
        {photos.map((photo, idx) => {
          const rotation = getRotation(idx);
          const hasTape = idx % 3 === 0;
          const isTapeAlt = idx % 6 === 0;
          const isLandscape = photo.size === 'large' && (photo.id === 'photo-28' || photo.id === 'photo-33');

          return (
            <figure
              key={photo.id}
              className={`polaroid-card ${isLandscape ? 'landscape' : ''}`}
              style={{ transform: `rotate(${rotation}deg)` }}
              onClick={(e) => openLightbox(idx, e)}
              tabIndex={0}
              role="button"
              aria-label={`View photo: ${photo.caption}. Tap to enlarge.`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openLightbox(idx, e as unknown as React.MouseEvent<HTMLElement>);
                }
              }}
            >
              {hasTape && (
                <div className={`washi-tape ${isTapeAlt ? 'tape-alt' : ''}`} aria-hidden="true" />
              )}

              {getBadge(photo.id) && (
                <span className="polaroid-sticker-badge" aria-hidden="true">
                  {getBadge(photo.id)}
                </span>
              )}

              <div className="polaroid-image-wrapper">
                <img
                  src={`${import.meta.env.BASE_URL}assets/${photo.src}`}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  className="polaroid-image"
                />
              </div>

              <figcaption className="polaroid-caption">
                {photo.caption}
              </figcaption>
            </figure>
          );
        })}
      </div>

      {/* Video Shelf */}
      <div className="video-shelf-container">
        <header className="section-header" style={{ marginBottom: 20 }}>
          <h3 className="section-title" style={{ fontSize: '1.6rem' }}>
            {copy.videoShelf}
          </h3>
        </header>

        <div className="video-grid">
          {videos.map((vid) => (
            <div key={vid.id} className="video-card">
              <div className="video-wrapper">
                <video
                  src={`${import.meta.env.BASE_URL}assets/${vid.src}`}
                  controls
                  playsInline
                  preload="metadata"
                  onPlay={pauseMusic}
                  className="memory-video"
                  aria-label={vid.alt}
                />
              </div>
              <div className="video-info">
                <h4 className="video-title">{vid.title}</h4>
                <p className="video-caption">{vid.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Lightbox
        photos={photos}
        currentIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={closeLightbox}
        onSelectIndex={(newIdx) => setLightboxIndex(newIdx)}
        openerRef={openerRef.current}
      />
    </section>
  );
};
