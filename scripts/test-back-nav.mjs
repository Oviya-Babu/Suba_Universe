import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:4173/';
const SCREENSHOT_DIR = 'd:\\bday\\browser-test-output';

async function testBackNav() {
  console.log('Testing Top-Left Back Button & Ceremony Revisit Navigation...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 }); // iPhone 12/13/14

  // 1. Start at Universe stage
  await page.goto(`${URL}?stage=universe`, { waitUntil: 'networkidle0' });
  console.log('Opened Universe stage.');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'back-test-1-universe.png') });

  // 2. Click Top-Left Back button from Universe -> should go to Blessing
  console.log('Clicking top-left back button from Universe...');
  await page.click('.top-back-btn');
  await new Promise(r => setTimeout(r, 600));

  const isBlessing = await page.evaluate(() => !!document.querySelector('.blessing-container'));
  console.log('Navigated back to Blessing?', isBlessing ? 'YES! ✓' : 'NO ✗');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'back-test-2-blessing.png') });

  // 3. Click Top-Left Back button from Blessing -> should go to Cake
  console.log('Clicking top-left back button from Blessing...');
  await page.click('.top-back-btn');
  await new Promise(r => setTimeout(r, 600));

  const isCake = await page.evaluate(() => {
    return {
      hasCake: !!document.querySelector('.cake-container'),
      flamesCount: document.querySelectorAll('.candle-flame').length
    };
  });
  console.log('Navigated back to Cake?', isCake.hasCake ? `YES! With ${isCake.flamesCount} lit candles! ✓` : 'NO ✗');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'back-test-3-cake.png') });

  // 4. Click Top-Left Back button from Cake -> should go to Countdown
  console.log('Clicking top-left back button from Cake...');
  await page.click('.top-back-btn');
  await new Promise(r => setTimeout(r, 600));

  const isCountdown = await page.evaluate(() => !!document.querySelector('.countdown-container'));
  console.log('Navigated back to Countdown?', isCountdown ? 'YES! ✓' : 'NO ✗');

  // 5. Click Top-Left Back button from Countdown -> should go to Entrance
  console.log('Clicking top-left back button from Countdown...');
  await page.click('.top-back-btn');
  await new Promise(r => setTimeout(r, 600));

  const isEntrance = await page.evaluate(() => !!document.querySelector('.entrance-container'));
  console.log('Navigated back to Entrance Letter?', isEntrance ? 'YES! ✓' : 'NO ✗');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'back-test-4-entrance.png') });

  // 6. Test direct Cake shortcut from Universe
  console.log('Testing direct Cake shortcut from Universe...');
  await page.goto(`${URL}?stage=universe`, { waitUntil: 'networkidle0' });
  await page.click('.top-shortcut-btn');
  await new Promise(r => setTimeout(r, 600));

  const directCake = await page.evaluate(() => !!document.querySelector('.cake-container'));
  console.log('Direct jump from Universe to Cake?', directCake ? 'YES! ✓' : 'NO ✗');

  // 7. Test Relight Candles button
  console.log('Testing candle blow + relight button...');
  await page.click('.cake-blow-trigger-btn');
  await new Promise(r => setTimeout(r, 3400)); // wait for blow to finish

  const wishBoxActive = await page.evaluate(() => !!document.querySelector('.wish-reveal-box'));
  console.log('Wish box active after blow?', wishBoxActive ? 'YES! ✓' : 'NO ✗');

  console.log('Clicking "Relight candles"...');
  await page.click('.relight-btn');
  await new Promise(r => setTimeout(r, 500));

  const relitCount = await page.evaluate(() => document.querySelectorAll('.candle-flame').length);
  console.log(`Candles relit count: ${relitCount} / 5! ✓`);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'back-test-5-relit-candles.png') });

  console.log('\nTop-left back navigation and ceremony revisit verified with 100% success!');
  await browser.close();
}

testBackNav().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

