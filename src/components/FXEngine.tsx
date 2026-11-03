import React, { useEffect, useRef } from 'react';
import { fxEngine } from '../fx/engine';
import { useJourney } from '../journey/JourneyProvider';

export const FXEngine: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { calmMode } = useJourney();

  useEffect(() => {
    if (!canvasRef.current) return;
    fxEngine.init(canvasRef.current);
    fxEngine.setCalm(calmMode);
    fxEngine.start();

    const handleVisibility = () => {
      if (document.hidden) {
        fxEngine.pause();
      } else {
        fxEngine.start();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      fxEngine.destroy();
    };
  }, []);

  useEffect(() => {
    fxEngine.setCalm(calmMode);
  }, [calmMode]);

  // Ambient gentle spawner (floating butterflies and hearts drifting up across the sky)
  useEffect(() => {
    if (calmMode) return;
    const interval = setInterval(() => {
      if (document.hidden) return;
      const startX = Math.random() * window.innerWidth;
      const startY = window.innerHeight + 10;
      // Alternate between a butterfly and a soft heart
      if (Math.random() > 0.4) {
        fxEngine.spawnButterflies(startX, startY, 1);
      } else {
        fxEngine.spawnScrollMagic(startX, startY, Math.floor(Math.random() * 10));
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [calmMode]);

  // Scroll listener: as user scrolls down or up, spawn floating purple/blue hearts, butterflies & stardust!
  useEffect(() => {
    if (calmMode) return;

    let lastScrollY = window.scrollY;
    let lastScrollTime = 0;
    let scrollCount = 0;

    const onScroll = () => {
      const now = performance.now();
      if (now - lastScrollTime < 70) return; // ~14 bursts per sec throttle for 60fps performance
      lastScrollTime = now;
      scrollCount++;

      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Spawn across the viewport width
      const x = Math.random() * window.innerWidth;
      const y = delta >= 0
        ? window.innerHeight - 40 - Math.random() * 100
        : 60 + Math.random() * 100;

      fxEngine.spawnScrollMagic(x, y, scrollCount);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [calmMode]);

  // Touch and pointer interactions: wherever user touches, spawn purple & blue hearts, butterflies & stardust!
  useEffect(() => {
    if (calmMode) return;

    let lastMove = 0;
    let lastTap = 0;

    // Handle single tap / click burst
    const handleTap = (clientX: number, clientY: number) => {
      const now = performance.now();
      if (now - lastTap < 100) return;
      lastTap = now;
      fxEngine.spawnMagicTouch(clientX, clientY, false);
    };

    // Handle drag / move trail
    const handleMove = (clientX: number, clientY: number) => {
      const now = performance.now();
      if (now - lastMove < 35) return;
      lastMove = now;
      fxEngine.spawnMagicTouch(clientX, clientY, true);
    };

    const onPointerDown = (e: PointerEvent) => {
      handleTap(e.clientX, e.clientY);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.buttons > 0 || window.matchMedia('(pointer: fine)').matches) {
        handleMove(e.clientX, e.clientY);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [calmMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999
      }}
      aria-hidden="true"
    />
  );
};
