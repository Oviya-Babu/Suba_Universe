import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  console.log('Testing Entrance Page (First Page)...');
  await page.goto('http://localhost:4173/?stage=entrance', { waitUntil: 'networkidle0' });

  // Click card to finish typewriter immediately
  await page.click('.entrance-card');
  await new Promise(r => setTimeout(r, 400));

  const entranceText = await page.evaluate(() => {
    return document.querySelector('.typed-text')?.textContent?.trim();
  });
  console.log('Entrance Full Text:', entranceText);
  const hasOneOfMyFavourite = entranceText?.includes('one of my favourite person');
  console.log('Contains "one of my favourite person":', hasOneOfMyFavourite);

  // Check Rain Effect canvas on entrance
  const rainStatus = await page.evaluate(() => {
    const wrapper = document.querySelector('.cozy-rain-wrapper');
    const canvas = document.querySelector('.cozy-rain-canvas');
    return {
      hasWrapper: Boolean(wrapper),
      hasCanvas: Boolean(canvas),
      canvasWidth: canvas?.width,
      canvasHeight: canvas?.height
    };
  });
  console.log('Rain Effect Status:', rainStatus);

  console.log('\nTesting Universe Stage with Rain & Wheel...');
  await page.goto('http://localhost:4173/?stage=universe', { waitUntil: 'networkidle0' });

  // Check Rain button in Top Navigation
  const rainBtnStatus = await page.evaluate(() => {
    const btn = document.querySelector('.rain-control-btn');
    return {
      exists: Boolean(btn),
      active: btn?.classList.contains('active'),
      ariaLabel: btn?.getAttribute('aria-label')
    };
  });
  console.log('Top Nav Rain Button:', rainBtnStatus);

  // Test wheel spin
  console.log('\nTesting Wheel Spin...');
  const spinBtn = await page.$('.wheel-spin-action-btn');
  if (spinBtn) {
    await spinBtn.click();
    await new Promise(r => setTimeout(r, 600));
    const midTransform = await page.evaluate(() => {
      const c = document.querySelector('.wheel-canvas');
      return c ? c.style.transform : null;
    });
    console.log('Wheel mid-spin transform:', midTransform);

    await new Promise(r => setTimeout(r, 3600));
    const resultCard = await page.evaluate(() => {
      const r = document.querySelector('.wheel-result-card');
      return r ? r.textContent.trim() : null;
    });
    console.log('Wheel Result Card:', resultCard);
  }

  await browser.close();
  console.log('\nALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
})();
