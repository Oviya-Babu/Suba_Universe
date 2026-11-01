import fs from 'fs';
import path from 'path';

function checkAssets() {
  console.log('--- Checking Assets (Pre-deploy Verification) ---');
  let errors = 0;

  // 1. Divine image
  const perumal = 'public/assets/divine/perumal.png';
  if (!fs.existsSync(perumal)) {
    console.error('ERROR: Missing perumal.png at public/assets/divine/perumal.png');
    errors++;
  } else {
    console.log('✓ perumal.png found');
  }

  // 2. Photos
  const imgDir = 'public/assets/images/memories';
  if (!fs.existsSync(imgDir) || fs.readdirSync(imgDir).length === 0) {
    console.error('ERROR: No photos found in public/assets/images/memories');
    errors++;
  } else {
    const count = fs.readdirSync(imgDir).length;
    console.log(`✓ ${count} photos found`);
  }

  // 3. Songs
  const audioDir = 'public/assets/audio/playlist';
  if (!fs.existsSync(audioDir) || fs.readdirSync(audioDir).length === 0) {
    console.error('ERROR: No songs found in public/assets/audio/playlist');
    errors++;
  } else {
    const count = fs.readdirSync(audioDir).length;
    console.log(`✓ ${count} songs found`);
  }

  if (errors > 0) {
    console.error(`Asset check failed with ${errors} error(s).`);
    process.exit(1);
  }

  console.log('All required assets verified successfully! ✓');
}

checkAssets();
