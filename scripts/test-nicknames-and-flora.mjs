import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:4173/';
const SCREENSHOT_DIR = 'd:\\bday\\browser-test-output';

async function testNicknames() {
  console.log('--- Testing Nicknames, Flora, and Mobile Layout ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  await page.goto(URL, { waitUntil: 'networkidle0' });

  // 1. Check Entrance
  console.log('1. Checking Entrance text & subhead ribbon...');
  const entranceText = await page.$eval('.typed-text', el => el.textContent);
  const entranceSubhead = await page.$eval('.entrance-card-subhead', el => el.textContent);
  console.log('Entrance text sample:', entranceText.slice(0, 60));
  console.log('Entrance subhead:', entranceSubhead);

  if (!entranceSubhead.includes('CHUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUBA')) {
    throw new Error('Entrance subhead missing nickname!');
  }

  // Check no horizontal scroll on mobile
  const scrollWidth1 = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth1 = await page.evaluate(() => document.documentElement.clientWidth);
  console.log(`Mobile Viewport Entrance width check: scrollWidth=${scrollWidth1}, clientWidth=${clientWidth1}`);
  if (scrollWidth1 > clientWidth1 + 1) {
    throw new Error(`Horizontal overflow detected in Entrance! scrollWidth=${scrollWidth1} > clientWidth=${clientWidth1}`);
  }

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'nicknames-1-entrance.png') });

  // 2. Click YES to go to countdown
  console.log('2. Clicking YES button...');
  const yesBtn = await page.$('.btn-yes');
  await yesBtn.click();

  // Wait for countdown 3 -> 2 -> 1 -> burst
  console.log('Waiting for countdown burst...');
  await page.waitForSelector('.countdown-burst-text', { timeout: 6000 });

  // Check burst text
  const burstText = await page.$eval('.countdown-burst-text', el => el.textContent);
  console.log('Countdown burst text:', burstText);
  if (!burstText.includes('CHUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUBA')) {
    throw new Error('Countdown burst missing ultra long nickname!');
  }

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'nicknames-2-countdown-burst.png') });

  // 3. Continue to cake
  console.log('3. Advancing to Cake...');
  await page.waitForSelector('.btn-primary', { timeout: 4000 });
  const toCakeBtn = await page.$('.btn-primary');
  await toCakeBtn.click();
  await new Promise(r => setTimeout(r, 1000));

  // Blow cake candles
  console.log('Clicking Blow Candles...');
  const blowBtn = await page.$('.cake-blow-trigger-btn');
  await blowBtn.click();
  await new Promise(r => setTimeout(r, 4800)); // wait for 3.. 2.. 1.. blow animation

  // Check wish reveal title & cheer badge
  const wishTitle = await page.$eval('.wish-title', el => el.textContent);
  const wishCheer = await page.$eval('.wish-cheer-badge', el => el.textContent);
  console.log('Wish title:', wishTitle);
  console.log('Wish cheer:', wishCheer);

  if (!wishTitle.includes('CHUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUBA')) {
    throw new Error('Wish title missing ultra long nickname!');
  }
  if (!wishCheer.includes('Chuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuba')) {
    throw new Error('Wish cheer badge missing nickname!');
  }

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'nicknames-3-cake-wish.png') });

  // 4. Click blessing continue button
  console.log('4. Advancing to Blessing...');
  const blessingBtn = await page.$('.blessing-continue-btn');
  await blessingBtn.click();
  await new Promise(r => setTimeout(r, 800));

  console.log('Advancing from Blessing to Universe...');
  const enterUniverseBtn = await page.$('.blessing-continue-btn');
  await enterUniverseBtn.click();
  await new Promise(r => setTimeout(r, 1200));

  // 5. Check Penguins
  console.log('5. Checking Penguin Corner...');
  await page.evaluate(() => {
    const el = document.getElementById('penguins');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));

  // Click Flora (penguin-4, 4th card)
  const penguinCards = await page.$$('.penguin-card');
  console.log(`Found ${penguinCards.length} penguin cards`);
  await penguinCards[3].click(); // Penguin 4 is Flora
  await new Promise(r => setTimeout(r, 400));

  const floraBubble = await page.$eval('.penguin-speech-bubble', el => el.textContent);
  console.log('Flora speech bubble:', floraBubble);

  if (!floraBubble.includes('I would even share my last bite of the ice cream with you')) {
    throw new Error('Flora penguin missing ice cream quote!');
  }
  if (!floraBubble.includes('Chuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuba')) {
    throw new Error('Flora penguin missing nickname!');
  }

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'nicknames-4-penguin-flora.png') });

  // Click Snoozy Sam (penguin-6, 6th card)
  await penguinCards[5].click();
  await new Promise(r => setTimeout(r, 400));
  const snoozyBubble = await page.$eval('.penguin-speech-bubble', el => el.textContent);
  console.log('Snoozy Sam bubble:', snoozyBubble);
  if (!snoozyBubble.includes('Subaaaaaaaaa')) {
    throw new Error('Snoozy Sam missing Subaaaaaaaaa nickname!');
  }

  // 6. Check Flowers
  console.log('6. Checking Flowers Garden...');
  await page.evaluate(() => {
    const el = document.getElementById('flowers');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));

  const flowerBtns = await page.$$('.flower-interactive-btn');
  console.log(`Found ${flowerBtns.length} flowers`);
  // Click tulip (2nd flower)
  await flowerBtns[1].click();
  await new Promise(r => setTimeout(r, 400));
  const flowerMsg = await page.$eval('.flower-message-text', el => el.textContent);
  console.log('Tulip message:', flowerMsg);
  if (!flowerMsg.includes('Subaaaaaaaaa') || !flowerMsg.includes('I would even share my last bite of the ice cream with you')) {
    throw new Error('Flower message missing expected quote or nickname!');
  }

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'nicknames-5-flower-flora.png') });

  // 7. Check Letter
  console.log('7. Checking Letter section...');
  await page.evaluate(() => {
    const el = document.getElementById('letter');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));

  const openLetterBtn = await page.$('.envelope-closed-container');
  if (openLetterBtn) {
    await openLetterBtn.click();
    await new Promise(r => setTimeout(r, 500));
  }

  const showAllBtn = await page.$('.letter-controls .pill-button');
  if (showAllBtn) {
    await showAllBtn.click();
    await new Promise(r => setTimeout(r, 400));
  }

  const letterGreeting = await page.$eval('.letter-greeting', el => el.textContent);
  const letterBody = await page.$eval('.letter-body', el => el.textContent);
  console.log('Letter greeting:', letterGreeting);
  if (!letterGreeting.includes('Chuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuba')) {
    throw new Error('Letter greeting missing ultra long nickname!');
  }
  if (!letterBody.includes('Chuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuba 💙')) {
    throw new Error('Letter body missing nickname with blue heart!');
  }

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'nicknames-6-letter.png') });

  // Final check: Mobile horizontal overflow across the whole page
  const finalScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const finalClientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  console.log(`Final Mobile page width check: scrollWidth=${finalScrollWidth}, clientWidth=${finalClientWidth}`);
  if (finalScrollWidth > finalClientWidth + 1) {
    throw new Error(`Horizontal overflow on page! scrollWidth=${finalScrollWidth} > clientWidth=${finalClientWidth}`);
  }

  console.log('ALL TESTS PASSED WITH 100% SUCCESS! ✨🎉');
  await browser.close();
}

testNicknames().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});