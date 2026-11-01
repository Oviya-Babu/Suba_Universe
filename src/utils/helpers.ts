// Asset URL helper — ensures correct base path in all environments
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL ?? './';
  // Remove leading slash if present to avoid double slashes with base
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const cleanBase = base.endsWith('/') ? base : base + '/';
  return `${cleanBase}assets/${cleanPath}`;
}

// Seed a pseudo-random number from a string (deterministic)
export function seededRandom(seed: string, index: number): number {
  let hash = 0;
  const str = seed + index;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return (Math.abs(hash) % 1000) / 1000;
}

// Get a deterministic rotation for polaroid cards (-4 to +4 degrees)
export function getPolaroidRotation(id: string): number {
  const r = seededRandom(id, 42);
  return (r * 8 - 4); // -4 to +4
}

// Format seconds to mm:ss
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Check if we're on iOS
export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// Check if reduced motion is preferred
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Throttle a function
export function throttle<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let last = 0;
  return function (...args: unknown[]) {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  } as T;
}

