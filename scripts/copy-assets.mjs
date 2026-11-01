import fs from 'fs';
import path from 'path';

fs.mkdirSync('public/assets/images/memories', { recursive: true });
fs.mkdirSync('public/assets/videos/memories', { recursive: true });
fs.mkdirSync('public/assets/audio/playlist', { recursive: true });
fs.mkdirSync('public/assets/divine', { recursive: true });

fs.copyFileSync('perumal2.jpeg', 'public/assets/divine/perumal.png');
console.log('Copied perumal2.jpeg -> public/assets/divine/perumal.png');

for (let i = 1; i <= 7; i++) {
  const pad = String(i).padStart(2, '0');
  fs.copyFileSync(`song ${i}.mpeg`, `public/assets/audio/playlist/song-${pad}.mp3`);
}

const vids = [
  'WhatsApp Video 2026-11-01 at 1.28.36 PM.mp4',
  'WhatsApp Video 2026-11-01 at 1.28.46 PM.mp4',
  'WhatsApp Video 2026-11-01 at 1.28.49 PM.mp4',
  'WhatsApp Video 2026-11-01 at 1.28.50 PM.mp4'
];
vids.forEach((v, idx) => {
  const pad = String(idx + 1).padStart(2, '0');
  fs.copyFileSync(path.join('us photos', v), `public/assets/videos/memories/video-${pad}.mp4`);
});

const orderedPhotos = [
  'suba.jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.32 PM.jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.33 PM.jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.33 PM (1).jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.37 PM.jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.37 PM (1).jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.37 PM (2).jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.38 PM.jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.38 PM (1).jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.38 PM (2).jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.39 PM.jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.39 PM (1).jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.39 PM (2).jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.40 PM.jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.40 PM (1).jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.46 PM.jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.47 PM.jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.47 PM (1).jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.50 PM.jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.50 PM (1).jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.50 PM (2).jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.51 PM.jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.51 PM (1).jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.51 PM (2).jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.52 PM.jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.52 PM (1).jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.53 PM.jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.53 PM (1).jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.54 PM.jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.54 PM (1).jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.54 PM (2).jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.55 PM.jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.55 PM (1).jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.56 PM.jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.58 PM.jpeg',
  'WhatsApp Image 2026-11-01 at 1.28.58 PM (1).jpeg',
  'WhatsApp Image 2026-11-01 at 1.59.21 PM (2).jpeg'
];

orderedPhotos.forEach((p, idx) => {
  const pad = String(idx + 1).padStart(2, '0');
  const srcPath = idx === 36 ? p : path.join('us photos', p);
  fs.copyFileSync(srcPath, `public/assets/images/memories/photo-${pad}.jpg`);
});

console.log(`Assets re-mapped: 37 photos in exact PRD order.`);
