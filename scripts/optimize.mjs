import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function optimize() {
  console.log('--- Optimizing Assets (Stripping EXIF & Generating Placeholders) ---');
  const imgDir = 'public/assets/images/memories';
  if (!fs.existsSync(imgDir)) {
    console.log('No images directory found.');
    return;
  }

  const files = fs.readdirSync(imgDir).filter(f => /\.jpe?g$/i.test(f)).sort();
  const placeholders = {};

  for (const f of files) {
    const fullPath = path.join(imgDir, f);
    try {
      const inputBuffer = fs.readFileSync(fullPath);
      // 1. Strip EXIF by re-saving with sharp without exif
      const buffer = await sharp(inputBuffer).rotate().jpeg({ quality: 85, mozjpeg: true }).toBuffer();
      fs.writeFileSync(fullPath, buffer);

      // 2. Generate tiny base64 placeholder (20px width)
      const tiny = await sharp(inputBuffer).resize(20).jpeg({ quality: 40 }).toBuffer();
      placeholders[f] = `data:image/jpeg;base64,${tiny.toString('base64')}`;
    } catch (e) {
      console.warn(`Error optimizing ${f}:`, e.message);
    }
  }

  // Also strip divine perumal
  const perumalPath = 'public/assets/divine/perumal.png';
  if (fs.existsSync(perumalPath)) {
    try {
      const inputBuffer = fs.readFileSync(perumalPath);
      const buffer = await sharp(inputBuffer).png({ compressionLevel: 8 }).toBuffer();
      fs.writeFileSync(perumalPath, buffer);
      console.log('Optimized divine perumal image.');
    } catch (e) {
      console.warn('Error optimizing perumal:', e.message);
    }
  }

  fs.mkdirSync('src/generated', { recursive: true });
  fs.writeFileSync('src/generated/placeholders.json', JSON.stringify(placeholders, null, 2));
  console.log(`Optimization complete! ${files.length} images processed successfully.`);
}

optimize().catch(err => {
  console.error(err);
  process.exit(1);
});
