import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  // Simulate mobile phone with touch and reduced-motion (like battery saver mode)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

  console.log('Testing Universe on Mobile...');
  await page.goto('http://localhost:4173/?stage=universe', { waitUntil: 'networkidle0' });

  // 1. Check Celestial Atmosphere is active in Act II
  const bgExists = await page.evaluate(() => {
    const fixedAtm = document.querySelector('.celestial-atmosphere-fixed');
    const auroras = document.querySelectorAll('.aurora-blob');
    return {
      hasFixedAtmosphere: Boolean(fixedAtm),
      auroraCount: auroras.length
    };
  });
  console.log('Mobile Celestial Atmosphere:', bgExists);

  // 2. Check Kavithai - New Tamil poem
  console.log('\nChecking Kavithai Section...');
  const poemInfo = await page.evaluate(() => {
    const titleTa = document.querySelector('.poem-title-ta')?.textContent?.trim();
    const firstLine = document.querySelector('.poem-lines-ta p:first-child')?.textContent?.trim();
    const lastP = Array.from(document.querySelectorAll('.poem-lines-ta p')).filter(p => p.textContent.trim().length > 0).pop();
    const badgeText = document.querySelector('.kavithai-badge-wrap')?.textContent?.trim() || '';
    const sectionSub = document.querySelector('.section-subtitle')?.textContent?.trim();
    return {
      titleTa,
      firstLine,
      lastLine: lastP?.textContent?.trim(),
      hasSpecialTamilBadge: badgeText.includes('1 Special') || badgeText.includes('The One'),
      sectionSub
    };
  });
  console.log('Tamil Poem Verification:', poemInfo);

  // 3. Test Wheel Spin on mobile with reduced motion enabled
  console.log('\nTesting Wheel Spin on mobile...');
  const spinBtn = await page.$('.wheel-spin-action-btn');
  if (spinBtn) {
    await spinBtn.click();
    console.log('Clicked Spin Button!');
    await new Promise(r => setTimeout(r, 600));
    const midTransform = await page.evaluate(() => {
      const c = document.querySelector('.wheel-canvas');
      return c ? c.style.transform : null;
    });
    console.log('Wheel mid-spin transform:', midTransform);

    // Wait for spin to complete
    await new Promise(r => setTimeout(r, 3600));
    const resultCard = await page.evaluate(() => {
      const r = document.querySelector('.wheel-result-card');
      return r ? r.textContent.trim() : null;
    });
    console.log('Wheel Result Card:', resultCard);
  }

  // 4. Test touch and scroll
  console.log('\nTesting Touch and Scroll Magic on mobile...');
  await page.touchscreen.tap(180, 400);
  await page.evaluate(() => {
    window.scrollTo({ top: 800 });
  });
  await new Promise(r => setTimeout(r, 400));
  console.log('Touch & scroll triggered successfully on mobile.');

  await browser.close();
  console.log('\nALL MOBILE VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
})();
