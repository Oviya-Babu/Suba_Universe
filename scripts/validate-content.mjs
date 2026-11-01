import fs from 'fs';
import path from 'path';

function validate() {
  console.log('--- Validating Content JSON Files ---');
  let errors = 0;
  let warnings = 0;

  const requiredFiles = [
    'site.json',
    'copy.json',
    'playlist.json',
    'photos.json',
    'videos.json',
    'letter.json',
    'poems.json',
    'penguins.json',
    'flowers.json',
    'surprises.json',
    'quotes.json',
    'wish.json',
    'final.json'
  ];

  const contents = {};

  for (const file of requiredFiles) {
    const p = path.join('src', 'content', file);
    if (!fs.existsSync(p)) {
      console.error(`ERROR: Missing required content file: ${p}`);
      errors++;
      continue;
    }
    try {
      const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
      contents[file] = data;
      console.log(`✓ ${file} is valid JSON`);
    } catch (e) {
      console.error(`ERROR: Invalid JSON in ${p}:`, e.message);
      errors++;
    }
  }

  // Check playlist assets
  if (contents['playlist.json']) {
    for (const song of contents['playlist.json']) {
      const assetPath = path.join('public', 'assets', song.src);
      if (!fs.existsSync(assetPath)) {
        console.error(`ERROR: Playlist asset missing: ${assetPath}`);
        errors++;
      }
    }
  }

  // Check photos assets
  if (contents['photos.json']) {
    for (const photo of contents['photos.json']) {
      const assetPath = path.join('public', 'assets', photo.src);
      if (!fs.existsSync(assetPath)) {
        console.error(`ERROR: Photo asset missing: ${assetPath}`);
        errors++;
      }
      if (!photo.alt || photo.alt.trim() === '' || photo.alt.toUpperCase() === 'TODO') {
        console.warn(`WARNING: Photo ${photo.id} has empty or TODO alt text.`);
        warnings++;
      }
    }
  }

  // Check videos assets
  if (contents['videos.json']) {
    for (const video of contents['videos.json']) {
      const assetPath = path.join('public', 'assets', video.src);
      if (!fs.existsSync(assetPath)) {
        console.error(`ERROR: Video asset missing: ${assetPath}`);
        errors++;
      }
    }
  }

  if (errors > 0) {
    console.error(`Validation failed with ${errors} error(s) and ${warnings} warning(s).`);
    process.exit(1);
  }

  console.log(`Validation successful! 0 errors, ${warnings} warning(s). ✓`);
}

validate();
