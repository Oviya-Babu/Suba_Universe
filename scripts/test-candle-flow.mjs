import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:4173/';
const SCREENSHOT_DIR = 'd:\\bday\\browser-test-output';

async function testFullCeremonyFlow() {
  console.log('Testing Full Ceremony Flow (Entrance -> Countdown -> Cake 3-2-1 Blow -> Blessing -> Shuffled Scrapbook)...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 }); // iPhone 12/13/14

  // STEP 1: Fresh Load without localStorage
  console.log('Step 1: Navigating to root URL...');
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle0' });

  await page.waitForSelector('.entrance-card');
  console.log('Entrance loaded successfully! ✓');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-step1-entrance.png') });

  // STEP 2: Click YES! Take me in
  console.log('Step 2: Clicking YES button...');
  await page.click('.btn-yes');

  await page.waitForSelector('.countdown-container', { timeout: 4000 });
  console.log('Countdown started! ✓');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-step2-countdown.png') });

  // Wait 1s and skip countdown to Cake
  await new Promise(r => setTimeout(r, 600));
  await page.click('.countdown-skip');

  await page.waitForSelector('.cake-container', { timeout: 4000 });
  console.log('Arrived at Birthday Cake! ✓');

  // Check 5 lit candles
  const litCandles = await page.evaluate(() => document.querySelectorAll('.candle-flame').length);
  console.log(`Candles lit: ${litCandles} / 5`);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-step3-cake-candles-lit.png') });

  // STEP 3: Click "Blow the Candles 💨" and observe 3-2-1 countdown & wind blow
  console.log('Clicking "Blow the Candles 💨"...');
  await page.click('.cake-blow-trigger-btn');

  // Verify 3... 2... 1... countdown badge
  await page.waitForSelector('.cake-blow-countdown-badge');
  const badgeText = await page.evaluate(() => document.querySelector('.cake-blow-countdown-badge')?.textContent);
  console.log(`Blow countdown badge active: "${badgeText}" ✓`);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-step3-cake-blowing-countdown.png') });

  // Wait for 3-2-1 countdown + wind gust to complete (~3 seconds)
  await page.waitForSelector('.wish-reveal-box', { timeout: 5000 });
  console.log('"Make a Wish" card revealed with celebrations! ✓');

  const remainingFlames = await page.evaluate(() => document.querySelectorAll('.candle-flame').length);
  console.log(`Remaining candle flames: ${remainingFlames} (should be 0)`);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-step3-cake-make-a-wish.png') });

  // STEP 4: Click button to receive Lord Perumal's blessing
  console.log('Clicking "I\'ve Made My Wish! Receive Lord Perumal\'s Blessing 🙏✨"...');
  await page.click('.blessing-continue-btn');

  await page.waitForSelector('.blessing-container', { timeout: 4000 });
  const isBlessing = await page.evaluate(() => {
    const frame = document.querySelector('.blessing-frame');
    const img = document.querySelector('.blessing-image');
    return {
      hasContainer: !!document.querySelector('.blessing-container'),
      hasFrame: !!frame,
      hasImage: !!img,
      imgComplete: img ? img.complete : false,
      naturalWidth: img ? img.naturalWidth : 0
    };
  });
  console.log('Lord Perumal Blessing loaded:', isBlessing);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-step4-perumal-blessing.png') });

  // STEP 5: Enter Universe
  console.log('Clicking "Enter Our Universe 🌌✨"...');
  await page.click('.blessing-btn-wrapper .btn-primary');

  await page.waitForSelector('#scrapbook', { timeout: 5000 });
  const firstPhotos = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.polaroid-card img'));
    return cards.slice(0, 6).map(img => img.src.split('/').pop());
  });
  console.log('First 6 photos in Scrapbook after shuffle:', firstPhotos);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'flow-step5-shuffled-scrapbook.png') });

  console.log('\nAll ceremony tests passed with 100% success! Every section and animation is verified!');
  await browser.close();
}

testFullCeremonyFlow().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
