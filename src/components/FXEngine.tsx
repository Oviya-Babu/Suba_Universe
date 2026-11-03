import React, { useEffect, useRef } from 'react';
import { fxEngine } from '../fx/engine';

export const FXEngine: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    fxEngine.init(canvasRef.current);
    fxEngine.setCalm(false);
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

  // Ambient lively spawner (floating butterflies and hearts drifting up across the sky)
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.hidden) return;
      const w = window.innerWidth || document.documentElement.clientWidth || 360;
      const h = window.innerHeight || document.documentElement.clientHeight || 640;
      const startX = Math.random() * w;
      const startY = h + 10;

      // Spawns fluttering butterflies & floating hearts continuously
      if (Math.random() > 0.45) {
        fxEngine.spawnButterflies(startX, startY, 1);
      } else {
        fxEngine.spawnScrollMagic(startX, startY, Math.floor(Math.random() * 10));
      }
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  // Scroll listener: as user scrolls down or up, spawn floating purple/blue hearts, butterflies & stardust!
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastScrollTime = 0;
    let scrollCount = 0;

    const onScroll = () => {
      const now = performance.now();
      if (now - lastScrollTime < 50) return; // Super responsive ~20fps spawn rate on mobile
      lastScrollTime = now;
      scrollCount++;

      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      const w = window.innerWidth || document.documentElement.clientWidth || 360;
      const h = window.innerHeight || document.documentElement.clientHeight || 640;
      const x = Math.random() * w;
      const y = delta >= 0
        ? h - 35 - Math.random() * 90
        : 50 + Math.random() * 90;

      fxEngine.spawnScrollMagic(x, y, scrollCount);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Touch and pointer interactions: wherever user touches or drags, spawn purple & blue hearts, butterflies & stardust!
  useEffect(() => {
    let lastMove = 0;
    let lastTap = 0;

    // Handle single tap / touch burst
    const handleTap = (clientX: number, clientY: number) => {
      const now = performance.now();
      if (now - lastTap < 80) return;
      lastTap = now;
      fxEngine.spawnMagicTouch(clientX, clientY, false);
    };

    // Handle drag / move trail
    const handleMove = (clientX: number, clientY: number) => {
      const now = performance.now();
      if (now - lastMove < 30) return;
      lastMove = now;
      fxEngine.spawnMagicTouch(clientX, clientY, true);
    };

    // Desktop pointer events
    const onPointerDown = (e: PointerEvent) => {
      handleTap(e.clientX, e.clientY);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.buttons > 0 || window.matchMedia('(pointer: fine)').matches) {
        handleMove(e.clientX, e.clientY);
      }
    };

    // Mobile touch events (guarantees touches work on all phones)
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        handleTap(touch.clientX, touch.clientY);
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
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        pointerEvents: 'none',
        zIndex: 9999
      }}
      aria-hidden="true"
    />
  );
};
