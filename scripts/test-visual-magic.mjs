import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:4173/';
const SCREENSHOT_DIR = 'd:\\bday\\browser-test-output';

async function testVisualMagic() {
  console.log('Testing Enhanced Celestial Atmosphere & Touch Magic...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 }); // iPhone 12/13/14

  // 1. Entrance Stage
  console.log('Testing S1 Entrance with Celestial Atmosphere...');
  await page.goto(`${URL}?stage=entrance`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Perform a sequence of touches/clicks across the screen
  await page.mouse.click(195, 200);
  await page.mouse.click(100, 350);
  await page.mouse.click(280, 500);

  // Drag mouse to create fairy trail
  await page.mouse.move(80, 400);
  await page.mouse.down();
  await page.mouse.move(195, 300, { steps: 10 });
  await page.mouse.move(300, 420, { steps: 10 });
  await page.mouse.up();

  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 's1-entrance-celestial-390.png') });

  // 2. Countdown Stage
  console.log('Testing S2 Countdown with Celestial Atmosphere...');
  await page.goto(`${URL}?stage=countdown`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1400));
  await page.mouse.click(195, 422);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 's2-countdown-celestial-390.png') });

  // 3. Cake Stage
  console.log('Testing S3 Cake with Garland & Celestial Atmosphere...');
  await page.goto(`${URL}?stage=cake`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.mouse.click(150, 400);
  await page.mouse.click(240, 400);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 's3-cake-celestial-390.png') });

  // 4. Blessing Stage
  console.log('Testing S4 Blessing with Celestial Atmosphere...');
  await page.goto(`${URL}?stage=blessing`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 's4-blessing-celestial-390.png') });

  // Check canvas particle count in runtime
  const particleStats = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    return {
      hasCanvas: !!canvas,
      width: canvas ? canvas.width : 0,
      height: canvas ? canvas.height : 0
    };
  });
  console.log('Particle Canvas Stats:', particleStats);

  console.log('Visual magic test finished successfully!');
  await browser.close();
}

testVisualMagic().catch(err => {
  console.error('Visual magic test failed:', err);
  process.exit(1);
});

