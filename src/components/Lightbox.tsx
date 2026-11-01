import React, { useEffect, useRef, useCallback } from 'react';
import { Photo } from '../types/content';

interface LightboxProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
  openerRef: HTMLElement | null;
}

export const Lightbox: React.FC<LightboxProps> = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onSelectIndex,
  openerRef
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const photo = photos[currentIndex];

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onSelectIndex(currentIndex - 1);
    } else {
      onSelectIndex(photos.length - 1);
    }
  }, [currentIndex, photos.length, onSelectIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      onSelectIndex(currentIndex + 1);
    } else {
      onSelectIndex(0);
    }
  }, [currentIndex, photos.length, onSelectIndex]);

  // Dialog open/close & Focus trap
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
      openerRef?.focus();
    }
  }, [isOpen, openerRef]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Tab') {
        // Focus trap inside dialog
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Touch swipe support (≥50px)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  if (!isOpen || !photo) return null;

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-modal="true"
      aria-label="Photo viewer"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        margin: 0,
        padding: 0,
        border: 'none',
        background: 'rgba(15, 8, 28, 0.96)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FBF7FF',
        zIndex: 10000
      }}
    >
      {/* Top Bar with Counter and Close */}
      <header
        style={{
          position: 'absolute',
          top: 'max(16px, env(safe-area-inset-top))',
          left: 16,
          right: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}
      >
        <span style={{ fontSize: '0.95rem', color: 'var(--color-lavender)', fontWeight: 600 }}>
          {currentIndex + 1} of {photos.length}
        </span>
        <button
          onClick={onClose}
          aria-label="Close photo viewer"
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            width: 44,
            height: 44,
            color: '#FFFFFF',
            fontSize: '1.4rem',
            lineHeight: 1
          }}
        >
          ×
        </button>
      </header>

      {/* Main Image Container */}
      <div
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 16px 16px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}assets/${photo.src}`}
          alt={photo.alt}
          style={{
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: 'min(calc(100dvh - 210px), 75vh)',
            objectFit: 'contain',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
          }}
        />

        {/* Previous Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous photo"
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(36, 20, 63, 0.75)',
            border: '1px solid var(--color-card-border)',
            borderRadius: '50%',
            width: 48,
            height: 48,
            fontSize: '1.5rem',
            color: 'var(--color-lavender)'
          }}
        >
          ‹
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          aria-label="Next photo"
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(36, 20, 63, 0.75)',
            border: '1px solid var(--color-card-border)',
            borderRadius: '50%',
            width: 48,
            height: 48,
            fontSize: '1.5rem',
            color: 'var(--color-lavender)'
          }}
        >
          ›
        </button>
      </div>

      {/* Caption footer */}
      <footer
        style={{
          width: '100%',
          maxWidth: 600,
          padding: '12px 20px max(24px, env(safe-area-inset-bottom))',
          textAlign: 'center'
        }}
      >
        <p
          className="handwriting"
          style={{
            fontSize: '1.35rem',
            color: 'var(--color-lavender-50)',
            margin: 0
          }}
        >
          {photo.caption}
        </p>
      </footer>
    </dialog>
  );
};
