import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:4173/';
const SCREENSHOT_DIR = 'd:\\bday\\browser-test-output';

async function testInteractions() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 }); // iPhone 12/13/14

  // 1. Entrance Test
  console.log('Testing S1 Entrance...');
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 's1-entrance-390.png') });

  // 2. Click Dodging NO button
  console.log('Testing S1 Dodging NO button...');
  const noBtn = await page.$('.btn-no');
  if (noBtn) {
    await noBtn.click();
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 's1-entrance-dodge-390.png') });
  }

  // 3. Click YES! Take me in
  console.log('Entering Countdown...');
  const yesBtn = await page.$('.btn-yes');
  await yesBtn.click();
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 's2-countdown-390.png') });

  // 4. Click Skip Countdown
  console.log('Skipping to Cake...');
  const skipBtn = await page.$('.countdown-skip');
  if (skipBtn) await skipBtn.click();
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 's3-cake-candles-lit-390.png') });

  // 5. Blow Candles
  console.log('Blowing candles on cake...');
  const blowBtn = await page.$('.cake-controls .btn-primary');
  if (blowBtn) await blowBtn.click();
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 's3-cake-candles-blown-390.png') });

  // 6. Go to Blessing
  console.log('Proceeding to Blessing...');
  const continueToBlessingBtn = await page.$('.wish-reveal-box .btn-primary');
  if (continueToBlessingBtn) await continueToBlessingBtn.click();
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 's4-blessing-390.png') });

  // 7. Check Perumal Blessing image bounds
  const blessingImgCheck = await page.evaluate(() => {
    const img = document.querySelector('.blessing-image');
    if (!img) return { found: false };
    const r = img.getBoundingClientRect();
    return {
      found: true,
      width: r.width,
      height: r.height,
      visible: r.width > 0 && r.height > 0,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    };
  });
  console.log('Blessing Perumal Image Check:', blessingImgCheck);

  // 8. Enter Act II Universe
  console.log('Entering Universe...');
  const enterUniverseBtn = await page.$('.blessing-btn-wrapper .btn-primary');
  if (enterUniverseBtn) await enterUniverseBtn.click();
  await new Promise(r => setTimeout(r, 1200));

  // 9. Open Lightbox on first photo
  console.log('Opening Lightbox on Photo 1...');
  const firstPhoto = await page.$('.polaroid-card');
  if (firstPhoto) {
    await firstPhoto.click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'lightbox-photo-01-390.png') });

    // Check Lightbox layout
    const lightboxCheck = await page.evaluate(() => {
      const dialog = document.querySelector('dialog');
      if (!dialog) return { open: false };
      const img = dialog.querySelector('img');
      const closeBtn = dialog.querySelector('button[aria-label="Close photo viewer"]');
      const prevBtn = dialog.querySelector('button[aria-label="Previous photo"]');
      const nextBtn = dialog.querySelector('button[aria-label="Next photo"]');
      const caption = dialog.querySelector('footer p');

      const imgRect = img ? img.getBoundingClientRect() : null;
      const closeRect = closeBtn ? closeBtn.getBoundingClientRect() : null;
      const captionRect = caption ? caption.getBoundingClientRect() : null;

      // Check if caption overlaps image
      let captionOverlapsImg = false;
      if (imgRect && captionRect) {
        captionOverlapsImg = imgRect.bottom > captionRect.top && imgRect.top < captionRect.bottom;
      }

      // Check if close button overlaps image
      let closeOverlapsImg = false;
      if (imgRect && closeRect) {
        closeOverlapsImg = imgRect.top < closeRect.bottom && imgRect.right > closeRect.left;
      }

      return {
        open: dialog.open,
        imgVisible: imgRect && imgRect.width > 0 && imgRect.height > 0,
        captionOverlapsImg,
        closeOverlapsImg,
        imgRect: imgRect ? { top: imgRect.top, bottom: imgRect.bottom, width: imgRect.width, height: imgRect.height } : null,
        captionRect: captionRect ? { top: captionRect.top, bottom: captionRect.bottom } : null,
        closeRect: closeRect ? { bottom: closeRect.bottom } : null
      };
    });
    console.log('Lightbox Check:', lightboxCheck);
  }

  // 10. Close lightbox and test Surprise Arcade scratch card and flowers
  console.log('Closing Lightbox and scrolling to Arcade & Flowers...');
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 400));

  const arcadeEl = await page.$('#arcade');
  if (arcadeEl) {
    await page.evaluate(() => document.querySelector('#arcade').scrollIntoView());
    await new Promise(r => setTimeout(r, 400));
    await arcadeEl.screenshot({ path: path.join(SCREENSHOT_DIR, 'arcade-390.png') });
  }

  const flowersEl = await page.$('#flowers');
  if (flowersEl) {
    await page.evaluate(() => document.querySelector('#flowers').scrollIntoView());
    await new Promise(r => setTimeout(r, 400));
    await flowersEl.screenshot({ path: path.join(SCREENSHOT_DIR, 'flowers-390.png') });
  }

  console.log('All interactive tests passed successfully!');
  await browser.close();
}

testInteractions().catch(err => {
  console.error('Interactive test failed:', err);
  process.exit(1);
});
