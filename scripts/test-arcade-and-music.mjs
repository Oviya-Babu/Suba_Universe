import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:4173/';
const SCREENSHOT_DIR = 'd:\\bday\\browser-test-output';

async function testArcadeAndMusic() {
  console.log('--- Testing Mystery Boxes, Autoplay & Stop Music Button, and Birthday Entrance ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto(URL, { waitUntil: 'networkidle0' });

  // 1. Verify First Page is Entrance and has HAPPY BIRTHDAY ribbon
  console.log('1. Verifying Entrance header ribbon and birthday wish...');
  const subhead = await page.$eval('.entrance-card-subhead', el => el.textContent);
  console.log('Subhead ribbon:', subhead);
  if (subhead.includes('TO: MY BEST FRIEND')) {
    throw new Error('Ribbon still contains "TO: MY BEST FRIEND"!');
  }
  if (!subhead.includes('HAPPY BIRTHDAY')) {
    throw new Error('Ribbon missing "HAPPY BIRTHDAY"!');
  }

  // 2. Verify Music Control Button in Top-Right
  console.log('2. Verifying Music Control Button in Top-Right...');
  const musicBtn = await page.$('.music-control-btn');
  if (!musicBtn) {
    throw new Error('Missing .music-control-btn in Top Navigation!');
  }

  // Trigger user gesture on page to start music
  console.log('Triggering gesture to start music...');
  await page.click('.entrance-card');
  await new Promise(r => setTimeout(r, 600));

  // Check music button state
  const musicBtnText = await page.$eval('.music-control-btn', el => el.textContent);
  console.log('Music button text after gesture:', musicBtnText);
  const isMusicPlaying = await page.$eval('.music-control-btn', el => el.classList.contains('playing'));
  console.log('Is music button showing playing / Stop Music state?', isMusicPlaying, musicBtnText);

  // Test toggling stop / play music
  console.log('Clicking Stop Music button...');
  await page.click('.music-control-btn');
  await new Promise(r => setTimeout(r, 400));
  const musicBtnTextAfterStop = await page.$eval('.music-control-btn', el => el.textContent);
  console.log('Music button text after clicking stop:', musicBtnTextAfterStop);
  if (!musicBtnTextAfterStop.includes('Play Music')) {
    throw new Error('Music button failed to toggle to Play Music!');
  }

  // Click again to resume music
  console.log('Clicking to resume music...');
  await page.click('.music-control-btn');
  await new Promise(r => setTimeout(r, 400));
  const musicBtnTextResumed = await page.$eval('.music-control-btn', el => el.textContent);
  console.log('Music button text resumed:', musicBtnTextResumed);

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'test-new-1-entrance-music.png') });

  // 3. Navigate directly to Universe stage to test Mystery Boxes in Arcade
  console.log('3. Navigating to Universe to inspect Mystery Boxes in Surprise Arcade...');
  await page.goto(`${URL}?stage=universe`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  await page.evaluate(() => {
    const el = document.getElementById('arcade');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));

  // Verify the 3 gift box buttons exist
  const giftButtons = await page.$$('.gift-box-btn');
  console.log(`Found ${giftButtons.length} gift box buttons.`);
  if (giftButtons.length < 3) throw new Error('Expected 3 gift boxes!');

  // Test Box 1: Stella Wishing Star
  console.log('Testing Mystery Box 1 (Stella Star of Optimism & Hope)...');
  await giftButtons[0].click();
  await new Promise(r => setTimeout(r, 600));

  const hasStellaBox = await page.$eval('.stella-box', el => !!el);
  const stellaTitle = await page.$eval('.stella-title', el => el.textContent);
  const stellaFaithText = await page.$eval('.stella-faith-card', el => el.textContent);
  console.log('Stella Title:', stellaTitle);
  console.log('Stella Faith sample:', stellaFaithText.slice(0, 80));

  if (!stellaFaithText.includes('optimism') || !stellaFaithText.includes('hope')) {
    throw new Error('Stella faith card missing optimism and hope message!');
  }

  // Click Stella Wish Button
  const stellaWishBtn = await page.$('.stella-wish-btn');
  await stellaWishBtn.click();
  await new Promise(r => setTimeout(r, 500));
  console.log('Stella wish button clicked successfully! ✨');

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'test-new-2-stella-box.png') });

  // Test Box 2: A Song For You Babe + YouTube link
  console.log('Testing Mystery Box 2 (A Song For You Babe + YouTube Link)...');
  await giftButtons[1].click();
  await new Promise(r => setTimeout(r, 600));

  const hasSongBox = await page.$eval('.song-box', el => !!el);
  const songLyrics = await page.$eval('.song-lyrics-text', el => el.textContent);
  const youtubeHref = await page.$eval('.song-youtube-link', el => el.href);
  console.log('Song Lyrics:\n', songLyrics);
  console.log('YouTube Link:', youtubeHref);

  if (!songLyrics.includes('My baby, I love you voice') || !songLyrics.includes('Oh my le-e-e-lady')) {
    throw new Error('Song lyrics missing expected lines!');
  }
  if (!youtubeHref.includes('https://www.youtube.com/watch?v=m9ezpAUvMC8')) {
    throw new Error('YouTube link does not match required URL!');
  }

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'test-new-3-song-box.png') });

  // Test Box 3: Top Secret Surprise
  console.log('Testing Mystery Box 3 (Top Secret Surprise)...');
  await giftButtons[2].click();
  await new Promise(r => setTimeout(r, 600));

  const hasSecretBox = await page.$eval('.secret-box', el => !!el);
  const secretText = await page.$eval('.secret-message-card', el => el.textContent);
  console.log('Secret Box Text:', secretText);

  if (!secretText.includes('when I meet you, babe')) {
    throw new Error('Secret box text missing "when I meet you, babe"!');
  }

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'test-new-4-secret-box.png') });

  // 4. Mobile Responsiveness Check
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  console.log(`Mobile width check: scrollWidth=${scrollWidth}, clientWidth=${clientWidth}`);
  if (scrollWidth > clientWidth + 1) {
    throw new Error(`Horizontal overflow! scrollWidth=${scrollWidth} > clientWidth=${clientWidth}`);
  }

  console.log('ALL MYSTERY BOX, MUSIC, & ENTRANCE TESTS PASSED WITH 100% SUCCESS! ✨🎉');
  await browser.close();
}

testArcadeAndMusic().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

