import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:4173/';
const SCREENSHOT_DIR = 'd:\\bday\\browser-test-output';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'mobile-360', width: 360, height: 780 },
  { name: 'iphone-390', width: 390, height: 844 },
  { name: 'iphone-max-430', width: 430, height: 932 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 900 }
];

async function checkOverlaps(page, selector, label) {
  return await page.evaluate((sel, name) => {
    const elements = Array.from(document.querySelectorAll(sel));
    const overlaps = [];
    const clientWidth = document.documentElement.clientWidth;

    // Check boundary overflows
    const overflows = [];
    elements.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      if (r.left < -2 || r.right > clientWidth + 2) {
        overflows.push({
          index: i,
          rect: { left: r.left, right: r.right, width: r.width, clientWidth }
        });
      }
    });

    // Check pairwise overlap
    for (let i = 0; i < elements.length; i++) {
      const r1 = elements[i].getBoundingClientRect();
      if (r1.width === 0 || r1.height === 0) continue;

      for (let j = i + 1; j < elements.length; j++) {
        const r2 = elements[j].getBoundingClientRect();
        if (r2.width === 0 || r2.height === 0) continue;

        // Intersection check
        const overlapX = Math.max(0, Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left));
        const overlapY = Math.max(0, Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top));

        // Overlap area threshold > 10 pixels to ignore subpixel edge touch
        if (overlapX > 3 && overlapY > 3) {
          overlaps.push({
            i,
            j,
            overlapWidth: overlapX,
            overlapHeight: overlapY,
            rect1: { top: r1.top, left: r1.left, right: r1.right, bottom: r1.bottom },
            rect2: { top: r2.top, left: r2.left, right: r2.right, bottom: r2.bottom }
          });
        }
      }
    }
    return { name, count: elements.length, overlaps, overflows };
  }, selector, label);
}

async function run() {
  console.log(`Starting headless Chrome from: ${CHROME_PATH}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  // Enable act I complete in localStorage so we can inspect Act II / Scrapbook / Universe
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    localStorage.setItem('subashree_bday_act_i_done', 'true');
  });

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto(URL, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Scroll through the entire page so lazy images load
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 400;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    await new Promise(r => setTimeout(r, 1000));

    // Check Scrapbook polaroids
    const scrapbookCheck = await checkOverlaps(page, '.polaroid-card', 'Scrapbook Polaroids');
    console.log(`Scrapbook Polaroids (${scrapbookCheck.count}): Overlaps: ${scrapbookCheck.overlaps.length}, Horizontal Overflows: ${scrapbookCheck.overflows.length}`);
    if (scrapbookCheck.overlaps.length > 0) {
      console.log('  Scrapbook Overlaps details:', JSON.stringify(scrapbookCheck.overlaps.slice(0, 5), null, 2));
    }
    if (scrapbookCheck.overflows.length > 0) {
      console.log('  Scrapbook Overflows details:', JSON.stringify(scrapbookCheck.overflows.slice(0, 5), null, 2));
    }

    // Check Final Universe Constellation Polaroids
    const finalCheck = await checkOverlaps(page, '.planet-polaroid', 'Final Constellation Polaroids');
    console.log(`Final Polaroids (${finalCheck.count}): Overlaps: ${finalCheck.overlaps.length}, Horizontal Overflows: ${finalCheck.overflows.length}`);
    if (finalCheck.overlaps.length > 0) {
      console.log('  Final Overlaps details:', JSON.stringify(finalCheck.overlaps.slice(0, 5), null, 2));
    }

    // Take screenshot of Scrapbook
    const scrapbookEl = await page.$('#scrapbook');
    if (scrapbookEl) {
      await scrapbookEl.screenshot({ path: path.join(SCREENSHOT_DIR, `scrapbook-${vp.name}.png`) });
    }

    // Take screenshot of Final Universe
    const finalEl = await page.$('#final-universe');
    if (finalEl) {
      await finalEl.screenshot({ path: path.join(SCREENSHOT_DIR, `final-${vp.name}.png`) });
    }

    // Full page screenshot for mobile-390
    if (vp.name === 'iphone-390') {
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `fullpage-iphone-390.png`), fullPage: true });
    }
  }

  console.log(`\nBrowser testing completed! Console errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log('Errors:', consoleErrors);
  }

  await browser.close();
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});

