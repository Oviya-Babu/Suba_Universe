// High-performance canvas particle system with butterflies, purple/blue hearts & stardust

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  size: number;
  color: string;
  accentColor?: string;
  type: 'heart' | 'star' | 'circle' | 'sparkle' | 'petal' | 'butterfly';
  rotation: number;
  vRot: number;
  wingPhase?: number;
  wingSpeed?: number;
  wanderSpeed?: number;
}

// Gorgeous palette of purples, celestial blues, and fairy accents
const PURPLE_SHADES = [
  '#C4B5FD', // soft lavender
  '#A78BFA', // dreamy periwinkle
  '#8B5CF6', // royal violet
  '#DDD6FE', // pale lilac
  '#7C3AED', // rich amethyst
  '#E9D5FF', // pastel orchid
  '#F472B6'  // rose violet
];

const BLUE_SHADES = [
  '#60A5FA', // bright sky blue
  '#93C5FD', // baby soft blue
  '#38BDF8', // celestial aqua
  '#7DD3FC', // ice sparkle blue
  '#BAE6FD', // misty powder blue
  '#3B82F6', // sapphire aura
  '#BFDBFE'  // cloud blue
];

const BUTTERFLY_PAIRS = [
  { main: '#C4B5FD', accent: '#93C5FD' }, // lavender + baby blue
  { main: '#60A5FA', accent: '#DDD6FE' }, // sky blue + lilac
  { main: '#A78BFA', accent: '#7DD3FC' }, // violet + aqua
  { main: '#FBCFE8', accent: '#A78BFA' }, // rose + lavender
  { main: '#38BDF8', accent: '#C4B5FD' }, // cyan + soft purple
  { main: '#E9D5FF', accent: '#60A5FA' }  // orchid + sky blue
];

const SPARKLE_SHADES = ['#FDE68A', '#FFFFFF', '#EDE9FE', '#BAE6FD', '#FBCFE8'];

export class FXManager {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animId: number | null = null;
  private isRunning = false;
  private isCalm = false;
  private lastTime = 0;
  private dragCounter = 0;

  constructor() {}

  public init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.resize();
    window.addEventListener('resize', this.onResize);
  }

  public setCalm(calm: boolean) {
    this.isCalm = calm;
    if (calm) {
      this.particles = [];
    }
  }

  private onResize = () => {
    this.resize();
  };

  private resize() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop();
  }

  public pause() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  public destroy() {
    this.pause();
    window.removeEventListener('resize', this.onResize);
    this.particles = [];
  }

  /**
   * Primary Magic Touch Handler:
   * Spawns butterflies, various shades of purple & blue hearts, and stardust
   */
  public spawnMagicTouch(x: number, y: number, isDrag = false) {
    if (this.isCalm) return;
    if (this.particles.length > 95) return;

    if (isDrag) {
      this.dragCounter++;
      // On drag trail, spawn 1-2 graceful elements
      const isBlue = this.dragCounter % 2 === 0;
      const color = isBlue
        ? BLUE_SHADES[Math.floor(Math.random() * BLUE_SHADES.length)]
        : PURPLE_SHADES[Math.floor(Math.random() * PURPLE_SHADES.length)];

      if (this.dragCounter % 10 === 0) {
        // Occasional butterfly emerging from the swipe!
        this.spawnButterflies(x, y, 1);
      } else {
        // Floating heart
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
        const speed = 1.2 + Math.random() * 2.2;
        this.particles.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          alpha: 0.95,
          decay: 0.016 + Math.random() * 0.014,
          size: 9 + Math.random() * 7,
          color,
          type: 'heart',
          rotation: (Math.random() - 0.5) * 0.35,
          vRot: (Math.random() - 0.5) * 0.04
        });

        // Little sparkle companion
        if (Math.random() > 0.4) {
          this.particles.push({
            x: x + (Math.random() - 0.5) * 16,
            y: y + (Math.random() - 0.5) * 16,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5 - 0.5,
            alpha: 1,
            decay: 0.025 + Math.random() * 0.02,
            size: 4 + Math.random() * 4,
            color: SPARKLE_SHADES[Math.floor(Math.random() * SPARKLE_SHADES.length)],
            type: 'sparkle',
            rotation: Math.random() * Math.PI,
            vRot: (Math.random() - 0.5) * 0.1
          });
        }
      }
    } else {
      // Direct Tap / Click Burst: magical bloom!
      // 1. One or two fluttering butterflies
      this.spawnButterflies(x, y, 1);

      // 2. Purple Hearts (2)
      for (let i = 0; i < 2; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
        const speed = 1.8 + Math.random() * 2.5;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.6,
          alpha: 1,
          decay: 0.014 + Math.random() * 0.012,
          size: 11 + Math.random() * 8,
          color: PURPLE_SHADES[Math.floor(Math.random() * PURPLE_SHADES.length)],
          type: 'heart',
          rotation: (Math.random() - 0.5) * 0.4,
          vRot: (Math.random() - 0.5) * 0.05
        });
      }

      // 3. Blue Hearts (2)
      for (let i = 0; i < 2; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
        const speed = 1.8 + Math.random() * 2.5;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.6,
          alpha: 1,
          decay: 0.014 + Math.random() * 0.012,
          size: 11 + Math.random() * 8,
          color: BLUE_SHADES[Math.floor(Math.random() * BLUE_SHADES.length)],
          type: 'heart',
          rotation: (Math.random() - 0.5) * 0.4,
          vRot: (Math.random() - 0.5) * 0.05
        });
      }

      // 4. Stardust Sparkles (4)
      for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3.5;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.02 + Math.random() * 0.02,
          size: 4 + Math.random() * 5,
          color: SPARKLE_SHADES[Math.floor(Math.random() * SPARKLE_SHADES.length)],
          type: 'sparkle',
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.12
        });
      }
    }
  }

  public spawnButterflies(x: number, y: number, count = 1) {
    if (this.isCalm) return;
    for (let i = 0; i < count; i++) {
      const pair = BUTTERFLY_PAIRS[Math.floor(Math.random() * BUTTERFLY_PAIRS.length)];
      const drift = (Math.random() - 0.5) * 1.8;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 15,
        vx: drift,
        vy: -1.6 - Math.random() * 1.4, // gentle upward flight
        alpha: 1,
        decay: 0.009 + Math.random() * 0.006, // long graceful flight (~2.5s)
        size: 12 + Math.random() * 6,
        color: pair.main,
        accentColor: pair.accent,
        type: 'butterfly',
        rotation: 0,
        vRot: 0,
        wingPhase: Math.random() * Math.PI * 2,
        wingSpeed: 14 + Math.random() * 6,
        wanderSpeed: 1.2 + Math.random() * 0.8
      });
    }
  }

  public spawnHearts(x: number, y: number, count = 3) {
    this.spawnMagicTouch(x, y, false);
  }

  public spawnSparkles(x: number, y: number, count = 12) {
    if (this.isCalm) return;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.02 + Math.random() * 0.02,
        size: 4 + Math.random() * 5,
        color: SPARKLE_SHADES[Math.floor(Math.random() * SPARKLE_SHADES.length)],
        type: 'sparkle',
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.1
      });
    }
  }

  public spawnFireworks(x: number, y: number, count = 32) {
    if (this.isCalm) return;
    const colors = ['#A78BFA', '#C4B5FD', '#FBCFE8', '#60A5FA', '#93C5FD', '#F5D98B'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const speed = 2 + Math.random() * 4;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.012 + Math.random() * 0.01,
        size: 3 + Math.random() * 4,
        color,
        type: 'star',
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.2
      });
    }
  }

  public spawnPetals(x: number, y: number, count = 4) {
    if (this.isCalm) return;
    const colors = ['#FBCFE8', '#C4B5FD', '#EDE9FE', '#BFDBFE'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 40,
        y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 1 + Math.random() * 2,
        alpha: 0.9,
        decay: 0.008 + Math.random() * 0.006,
        size: 8 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'petal',
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.04
      });
    }
  }

  private loop = () => {
    if (!this.isRunning) return;
    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    this.update(dt);
    this.render();

    this.animId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      if (p.type === 'butterfly') {
        p.wingPhase = (p.wingPhase || 0) + (p.wingSpeed || 14) * dt;
        p.x += (p.vx + Math.sin(p.wingPhase * 0.4) * (p.wanderSpeed || 1.2)) * 60 * dt;
        p.y += p.vy * 60 * dt;
        p.rotation = Math.sin(p.wingPhase * 0.4) * 0.25;
      } else {
        p.x += p.vx * 60 * dt;
        p.y += p.vy * 60 * dt;
        p.rotation += p.vRot * 60 * dt;
      }

      p.alpha -= p.decay * 60 * dt;

      // Gentle upward drift or gravity depending on particle
      if (p.type === 'star' || p.type === 'petal') {
        p.vy += 0.06 * 60 * dt;
      }

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private render() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);

      if (p.type === 'butterfly') {
        const s = p.size;
        const flap = Math.abs(Math.sin(p.wingPhase || 0)) * 0.8 + 0.2; // 0.2 to 1.0 wing flap

        // Left top forewing
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.ellipse(-s * 0.5 * flap, -s * 0.35, s * 0.55 * flap, s * 0.45, -0.3, 0, Math.PI * 2);
        this.ctx.fill();

        // Left bottom hindwing
        this.ctx.fillStyle = p.accentColor || p.color;
        this.ctx.beginPath();
        this.ctx.ellipse(-s * 0.36 * flap, s * 0.25, s * 0.4 * flap, s * 0.32, 0.25, 0, Math.PI * 2);
        this.ctx.fill();

        // Right top forewing
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.ellipse(s * 0.5 * flap, -s * 0.35, s * 0.55 * flap, s * 0.45, 0.3, 0, Math.PI * 2);
        this.ctx.fill();

        // Right bottom hindwing
        this.ctx.fillStyle = p.accentColor || p.color;
        this.ctx.beginPath();
        this.ctx.ellipse(s * 0.36 * flap, s * 0.25, s * 0.4 * flap, s * 0.32, -0.25, 0, Math.PI * 2);
        this.ctx.fill();

        // White butterfly body
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, s * 0.1, s * 0.45, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Dainty white antennae
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(-1, -s * 0.38);
        this.ctx.quadraticCurveTo(-s * 0.25, -s * 0.7, -s * 0.38, -s * 0.75);
        this.ctx.moveTo(1, -s * 0.38);
        this.ctx.quadraticCurveTo(s * 0.25, -s * 0.7, s * 0.38, -s * 0.75);
        this.ctx.stroke();

      } else if (p.type === 'heart') {
        const s = p.size;
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, s * 0.3);
        this.ctx.bezierCurveTo(-s * 0.5, -s * 0.3, -s * 0.5, -s * 0.8, 0, -s * 0.4);
        this.ctx.bezierCurveTo(s * 0.5, -s * 0.8, s * 0.5, -s * 0.3, 0, s * 0.3);
        this.ctx.fill();

        // Cute glossy highlight spot
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        this.ctx.beginPath();
        this.ctx.arc(-s * 0.18, -s * 0.42, s * 0.12, 0, Math.PI * 2);
        this.ctx.fill();

      } else if (p.type === 'sparkle' || p.type === 'star') {
        const s = p.size;
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          this.ctx.lineTo(Math.cos((i * Math.PI) / 2) * s, Math.sin((i * Math.PI) / 2) * s);
          this.ctx.lineTo(Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (s * 0.26), Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (s * 0.26));
        }
        this.ctx.closePath();
        this.ctx.fill();

        // Center bright gleam
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, s * 0.25, 0, Math.PI * 2);
        this.ctx.fill();

      } else if (p.type === 'petal') {
        const s = p.size;
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, s * 0.6, s * 1.2, 0, 0, Math.PI * 2);
        this.ctx.fill();

      } else {
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }
  }
}

export const fxEngine = new FXManager();
