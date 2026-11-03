import React, { useEffect, useRef } from 'react';
import { rainASMR } from '../audio/rainASMR';
import { useJourney } from '../journey/JourneyProvider';
import './CozyRainEffect.css';

interface RainStreak {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

interface GlassDrop {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  isMoving: boolean;
  trail: { x: number; y: number; alpha: number; radius: number }[];
  pauseTimer: number;
  pauseDuration: number;
}

interface WarmBokeh {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  opacity: number;
}

export const CozyRainEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { soundOn } = useJourney();

  // Auto-start Rain ASMR audio softly when sound is enabled
  useEffect(() => {
    if (soundOn) {
      // Start after first interaction or automatically
      const startRain = () => {
        rainASMR.start();
        cleanup();
      };
      const cleanup = () => {
        window.removeEventListener('pointerdown', startRain);
        window.removeEventListener('touchstart', startRain);
        window.removeEventListener('click', startRain);
      };

      rainASMR.start();
      window.addEventListener('pointerdown', startRain, { once: true, passive: true });
      window.addEventListener('touchstart', startRain, { once: true, passive: true });
      window.addEventListener('click', startRain, { once: true });

      return () => {
        cleanup();
      };
    } else {
      rainASMR.stop();
    }
  }, [soundOn]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let lastTime = performance.now();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth || document.documentElement.clientWidth || 360;
      height = window.innerHeight || document.documentElement.clientHeight || 640;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // 1. Warm Glowing Bokeh Orbs (Cozy amber, peach, lavender glowing behind the wet glass)
    const bokehColors = [
      'rgba(251, 191, 36, ', // warm amber
      'rgba(245, 158, 11, ', // golden honey
      'rgba(244, 114, 182, ', // cozy rose
      'rgba(167, 139, 250, ', // lavender glow
      'rgba(253, 230, 138, '  // pale candlelight
    ];

    const bokehCount = width < 480 ? 7 : 12;
    const bokehs: WarmBokeh[] = [];
    for (let i = 0; i < bokehCount; i++) {
      bokehs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 40 + Math.random() * 85,
        color: bokehColors[i % bokehColors.length],
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        opacity: 0.08 + Math.random() * 0.12
      });
    }

    // 2. Distant Falling Rain Streaks (slanted, fast, semi-transparent)
    const streakCount = width < 480 ? 45 : 80;
    const streaks: RainStreak[] = [];
    for (let i = 0; i < streakCount; i++) {
      streaks.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 22 + Math.random() * 35,
        speed: 16 + Math.random() * 14,
        opacity: 0.12 + Math.random() * 0.22
      });
    }

    // 3. Foreground Glass Window Droplets (Trickling, condensation, ASMR water streams)
    const dropCount = width < 480 ? 55 : 95;
    const drops: GlassDrop[] = [];

    const createDrop = (initialY?: number): GlassDrop => {
      const isMoving = Math.random() > 0.45; // ~55% trickle down, rest sit as condensation
      const radius = isMoving
        ? 2.5 + Math.random() * 3.5 // 2.5px - 6px tricklers
        : 1.2 + Math.random() * 2.2; // 1.2px - 3.4px static condensation beads
      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : Math.random() * height,
        radius,
        speedY: isMoving ? 0.4 + Math.random() * 1.8 : 0,
        isMoving,
        trail: [],
        pauseTimer: 0,
        pauseDuration: 40 + Math.random() * 120 // Occasional pause on glass due to surface tension
      };
    };

    for (let i = 0; i < dropCount; i++) {
      drops.push(createDrop());
    }

    // Main animation loop
    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // A. Render Warm Ambient Bokeh
      for (const b of bokehs) {
        b.x += b.vx * 60 * dt;
        b.y += b.vy * 60 * dt;
        if (b.x < -b.radius) b.x = width + b.radius;
        if (b.x > width + b.radius) b.x = -b.radius;
        if (b.y < -b.radius) b.y = height + b.radius;
        if (b.y > height + b.radius) b.y = -b.radius;

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        grad.addColorStop(0, `${b.color}${b.opacity})`);
        grad.addColorStop(0.5, `${b.color}${b.opacity * 0.4})`);
        grad.addColorStop(1, `${b.color}0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // B. Render Distant Slanted Rain Streaks
      ctx.lineWidth = 1.2;
      for (const s of streaks) {
        s.y += s.speed * 60 * dt;
        s.x += (s.speed * 0.22) * 60 * dt; // gentle ~12 degree slant

        if (s.y > height + s.length) {
          s.y = -s.length - Math.random() * 50;
          s.x = Math.random() * (width + 100) - 50;
        }

        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.length * 0.22, s.y - s.length);
        grad.addColorStop(0, `rgba(196, 181, 253, ${s.opacity})`);
        grad.addColorStop(0.7, `rgba(221, 214, 254, ${s.opacity * 0.5})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.length * 0.22, s.y - s.length);
        ctx.stroke();
      }

      // C. Render Glass Window Droplets & Water Trails
      for (const d of drops) {
        // Draw trailing water stream if moving
        if (d.trail.length > 0) {
          for (let t = 0; t < d.trail.length; t++) {
            const tr = d.trail[t];
            tr.alpha -= 0.012 * 60 * dt; // Slow natural fading of wet streak on glass
            if (tr.alpha > 0) {
              ctx.fillStyle = `rgba(221, 214, 254, ${tr.alpha * 0.22})`;
              ctx.beginPath();
              ctx.arc(tr.x, tr.y, tr.radius * 0.75, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          d.trail = d.trail.filter(tr => tr.alpha > 0);
        }

        if (d.isMoving) {
          d.pauseTimer += 60 * dt;
          if (d.pauseTimer > d.pauseDuration) {
            // Drop pauses, collects water, then trickles again!
            if (d.pauseTimer > d.pauseDuration + 30) {
              d.pauseTimer = 0;
              d.pauseDuration = 50 + Math.random() * 140;
            }
          } else {
            // Trickle down with slight wobble
            d.y += d.speedY * 60 * dt;
            d.x += Math.sin(d.y * 0.05) * 0.2;

            // Leave wet trail point
            if (Math.random() > 0.4) {
              d.trail.push({ x: d.x, y: d.y, alpha: 0.65, radius: d.radius });
            }
          }

          if (d.y > height + 20) {
            // Reset drop to top
            d.y = -10 - Math.random() * 40;
            d.x = Math.random() * width;
            d.trail = [];
            d.speedY = 0.4 + Math.random() * 1.8;
          }
        }

        // Render Water Droplet Body with Glistening Specular & Shadow
        const r = d.radius;

        // 1. Soft droplet shadow (underneath)
        ctx.fillStyle = 'rgba(10, 4, 20, 0.35)';
        ctx.beginPath();
        ctx.ellipse(d.x + 0.8, d.y + 1.2, r * 1.05, r * 0.95, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Liquid Glass Body (translucent lavender/crystal water)
        const dropGrad = ctx.createRadialGradient(
          d.x - r * 0.3, d.y - r * 0.3, r * 0.1,
          d.x, d.y, r
        );
        dropGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        dropGrad.addColorStop(0.35, 'rgba(196, 181, 253, 0.45)');
        dropGrad.addColorStop(0.85, 'rgba(139, 92, 246, 0.3)');
        dropGrad.addColorStop(1, 'rgba(46, 16, 101, 0.4)');

        ctx.fillStyle = dropGrad;
        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fill();

        // 3. Bright Specular Reflection Glint (Warm Amber / Diamond white glint on top-left)
        ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
        ctx.beginPath();
        ctx.arc(d.x - r * 0.38, d.y - r * 0.38, Math.max(0.7, r * 0.28), 0, Math.PI * 2);
        ctx.fill();

        // 4. Subtle Bottom Refraction Rim (cozy warm bounce)
        ctx.fillStyle = 'rgba(244, 114, 182, 0.35)';
        ctx.beginPath();
        ctx.arc(d.x + r * 0.25, d.y + r * 0.3, Math.max(0.5, r * 0.2), 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        lastTime = performance.now();
        animId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div className="cozy-rain-wrapper" aria-hidden="true">
      <canvas ref={canvasRef} className="cozy-rain-canvas" />
      {/* Soft warm mist glass overlay */}
      <div className="cozy-rain-mist" />
    </div>
  );
};
