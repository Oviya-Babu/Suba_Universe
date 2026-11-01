import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:4173/';
const SCREENSHOT_DIR = 'd:\\bday\\browser-test-output';

async function testCleanBackAndEdits() {
  console.log('--- Testing Clean Top-Left Arrow Back Button & Content Edits ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  // 1. Test Entrance: Back button is present, simple <- arrow only
  console.log('1. Checking Entrance stage top-left back button...');
  await page.goto(`${URL}?stage=entrance`, { waitUntil: 'networkidle0' });
  
  const backBtnTextEntrance = await page.$eval('.top-back-btn', el => el.textContent.trim());
  console.log('Entrance back button text:', backBtnTextEntrance);
  if (backBtnTextEntrance !== '←') {
    throw new Error(`Expected only "←", got: "${backBtnTextEntrance}"`);
  }

  // 2. Test Countdown: Back button is present, simple <- arrow only
  console.log('2. Checking Countdown stage top-left back button...');
  await page.goto(`${URL}?stage=countdown`, { waitUntil: 'networkidle0' });
  const backBtnTextCountdown = await page.$eval('.top-back-btn', el => el.textContent.trim());
  if (backBtnTextCountdown !== '←') {
    throw new Error(`Expected only "←", got: "${backBtnTextCountdown}"`);
  }

  // 3. Test Cake: Back button is present, simple <- arrow only
  console.log('3. Checking Cake stage top-left back button...');
  await page.goto(`${URL}?stage=cake`, { waitUntil: 'networkidle0' });
  const backBtnTextCake = await page.$eval('.top-back-btn', el => el.textContent.trim());
  if (backBtnTextCake !== '←') {
    throw new Error(`Expected only "←", got: "${backBtnTextCake}"`);
  }

  // 4. Test Blessing: Back button is present, simple <- arrow only
  console.log('4. Checking Blessing stage top-left back button...');
  await page.goto(`${URL}?stage=blessing`, { waitUntil: 'networkidle0' });
  const backBtnTextBlessing = await page.$eval('.top-back-btn', el => el.textContent.trim());
  if (backBtnTextBlessing !== '←') {
    throw new Error(`Expected only "←", got: "${backBtnTextBlessing}"`);
  }

  // 5. Test Universe: Back button is present, simple <- arrow only (NO "Blessing" word!)
  console.log('5. Checking Universe stage top-left back button...');
  await page.goto(`${URL}?stage=universe`, { waitUntil: 'networkidle0' });
  const backBtnTextUniverse = await page.$eval('.top-back-btn', el => el.textContent.trim());
  const leftNavHtml = await page.$eval('.top-nav-left', el => el.innerHTML);
  console.log('Universe back button text:', backBtnTextUniverse);
  if (backBtnTextUniverse !== '←') {
    throw new Error(`Expected only "←", got: "${backBtnTextUniverse}"`);
  }
  if (leftNavHtml.includes('Blessing') || leftNavHtml.includes('Cake') || leftNavHtml.includes('Chapters')) {
    throw new Error(`Extra cluttered words found in top-left navigation: ${leftNavHtml}`);
  }

  // Test clicking <- from Universe -> steps back to Blessing!
  console.log('Clicking ← from Universe...');
  await page.click('.top-back-btn');
  await new Promise(r => setTimeout(r, 600));
  const isNowBlessing = await page.evaluate(() => !!document.querySelector('.blessing-container'));
  console.log('Stepped back to Blessing?', isNowBlessing);
  if (!isNowBlessing) throw new Error('Clicking back button from Universe failed to step back to Blessing!');

  // 6. Check Spin the wheel in Arcade: "Pick the next movie" must NOT be in the wheel
  console.log('6. Checking Wheel in Surprise Arcade...');
  await page.goto(`${URL}?stage=universe`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const el = document.getElementById('arcade');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));

  const wheelDesc = await page.$eval('#arcade', el => el.textContent);
  if (wheelDesc.includes('Pick the next movie')) {
    throw new Error('Found "Pick the next movie" in Arcade text!');
  }
  console.log('Verified: "Pick the next movie" removed from wheel! ✓');

  // 7. Check Photo 27: Rainbow word and rainbow symbol must NOT be present
  console.log('7. Checking Scrapbook for rainbow word/symbol...');
  const scrapbookText = await page.$eval('#scrapbook', el => el.textContent);
  const scrapbookHtml = await page.$eval('#scrapbook', el => el.innerHTML);
  if (scrapbookText.includes('Rainbow') || scrapbookText.includes('rainbow') || scrapbookHtml.includes('🌈')) {
    throw new Error('Rainbow word or rainbow emoji found in scrapbook!');
  }
  console.log('Verified: Rainbow word and 🌈 symbol removed from photos! ✓');

  // 8. Mobile horizontal overflow check
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  console.log(`Mobile width check (390px): scrollWidth=${scrollWidth}, clientWidth=${clientWidth}`);
  if (scrollWidth > clientWidth + 1) {
    throw new Error(`Horizontal overflow! scrollWidth=${scrollWidth} > clientWidth=${clientWidth}`);
  }

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'clean-back-arrow-test.png') });
  console.log('ALL CLEAN BACK BUTTON AND CONTENT EDITS PASSED WITH 100% SUCCESS! ✨🎉');
  await browser.close();
}

testCleanBackAndEdits().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

