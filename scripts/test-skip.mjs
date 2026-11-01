import puppeteer from 'puppeteer-core';

async function test() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  await page.goto('http://localhost:4173/?stage=countdown', { waitUntil: 'networkidle0' });
  console.log('Page loaded');
  const skipBtn = await page.$('.countdown-skip');
  console.log('Found skip button?', !!skipBtn);
  if (skipBtn) {
    await skipBtn.click();
    console.log('Clicked skip button');
  }
  await new Promise(r => setTimeout(r, 600));
  const stageCheck = await page.evaluate(() => {
    return {
      hasCake: !!document.querySelector('.cake-container'),
      hasCountdown: !!document.querySelector('.countdown-container'),
      hasEntrance: !!document.querySelector('.entrance-container')
    };
  });
  console.log('Stage check result:', stageCheck);
  await browser.close();
}

test();

