import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import * as mm from 'music-metadata';

async function scan() {
  console.log('--- Scanning Assets ---');
  fs.mkdirSync('docs', { recursive: true });

  const inventory = {
    scannedAt: new Date().toISOString(),
    photos: [],
    videos: [],
    songs: [],
    divine: []
  };

  // 1. Photos in public/assets/images/memories
  const imgDir = 'public/assets/images/memories';
  if (fs.existsSync(imgDir)) {
    const files = fs.readdirSync(imgDir).filter(f => /\.jpe?g|\.png|\.webp$/i.test(f)).sort();
    for (const f of files) {
      const fullPath = path.join(imgDir, f);
      const stat = fs.statSync(fullPath);
      let metadata = {};
      try {
        metadata = await sharp(fullPath).metadata();
      } catch (e) {
        console.warn(`Could not read metadata for ${f}:`, e.message);
      }
      inventory.photos.push({
        file: f,
        path: `images/memories/${f}`,
        sizeBytes: stat.size,
        sizeKb: Math.round(stat.size / 1024),
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        hasExif: Boolean(metadata.exif)
      });
    }
  }

  // 2. Videos in public/assets/videos/memories
  const vidDir = 'public/assets/videos/memories';
  if (fs.existsSync(vidDir)) {
    const files = fs.readdirSync(vidDir).filter(f => /\.mp4|\.webm$/i.test(f)).sort();
    for (const f of files) {
      const fullPath = path.join(vidDir, f);
      const stat = fs.statSync(fullPath);
      inventory.videos.push({
        file: f,
        path: `videos/memories/${f}`,
        sizeBytes: stat.size,
        sizeKb: Math.round(stat.size / 1024)
      });
    }
  }

  // 3. Audio in public/assets/audio/playlist
  const audioDir = 'public/assets/audio/playlist';
  if (fs.existsSync(audioDir)) {
    const files = fs.readdirSync(audioDir).filter(f => /\.mp3|\.m4a|\.mpeg$/i.test(f)).sort();
    for (const f of files) {
      const fullPath = path.join(audioDir, f);
      const stat = fs.statSync(fullPath);
      let meta = {};
      try {
        const parsed = await mm.parseFile(fullPath);
        meta = {
          title: parsed.common.title,
          artist: parsed.common.artist,
          duration: parsed.format.duration
        };
      } catch (e) {
        // Fallback
      }
      inventory.songs.push({
        file: f,
        path: `audio/playlist/${f}`,
        sizeBytes: stat.size,
        sizeKb: Math.round(stat.size / 1024),
        ...meta
      });
    }
  }

  // 4. Divine
  const divineDir = 'public/assets/divine';
  if (fs.existsSync(divineDir)) {
    const files = fs.readdirSync(divineDir).sort();
    for (const f of files) {
      const fullPath = path.join(divineDir, f);
      const stat = fs.statSync(fullPath);
      let metadata = {};
      try {
        metadata = await sharp(fullPath).metadata();
      } catch (e) {}
      inventory.divine.push({
        file: f,
        path: `divine/${f}`,
        sizeBytes: stat.size,
        sizeKb: Math.round(stat.size / 1024),
        width: metadata.width,
        height: metadata.height
      });
    }
  }

  fs.writeFileSync('docs/asset-inventory.json', JSON.stringify(inventory, null, 2));

  // Generate markdown table
  let md = `# Asset Inventory (Generated)\n\nScanned at: ${inventory.scannedAt}\n\n`;
  md += `## Divine\n| File | Path | Size | Dimensions |\n|---|---|---|---|\n`;
  for (const d of inventory.divine) {
    md += `| ${d.file} | ${d.path} | ${d.sizeKb} KB | ${d.width}x${d.height} |\n`;
  }

  md += `\n## Songs (${inventory.songs.length})\n| File | Path | Size | Title | Artist | Duration (s) |\n|---|---|---|---|---|---|\n`;
  for (const s of inventory.songs) {
    md += `| ${s.file} | ${s.path} | ${s.sizeKb} KB | ${s.title || 'Unknown'} | ${s.artist || 'Unknown'} | ${s.duration ? Math.round(s.duration) : 'N/A'} |\n`;
  }

  md += `\n## Videos (${inventory.videos.length})\n| File | Path | Size |\n|---|---|---|\n`;
  for (const v of inventory.videos) {
    md += `| ${v.file} | ${v.path} | ${v.sizeKb} KB |\n`;
  }

  md += `\n## Photos (${inventory.photos.length})\n| File | Path | Size | Dimensions | Format |\n|---|---|---|---|---|\n`;
  for (const p of inventory.photos) {
    md += `| ${p.file} | ${p.path} | ${p.sizeKb} KB | ${p.width}x${p.height} | ${p.format} |\n`;
  }

  fs.writeFileSync('docs/ASSET_INVENTORY.generated.md', md);
  console.log(`Scan complete! Photos: ${inventory.photos.length}, Videos: ${inventory.videos.length}, Songs: ${inventory.songs.length}, Divine: ${inventory.divine.length}`);
}

scan().catch(err => {
  console.error(err);
  process.exit(1);
});
