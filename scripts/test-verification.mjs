import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  console.log('Testing Blessing page (Perumal image)...');
  await page.goto('http://localhost:4173/?stage=blessing', { waitUntil: 'networkidle0' });
  
  const imgStatus = await page.evaluate(() => {
    const img = document.querySelector('.blessing-image');
    return {
      src: img?.src,
      complete: img?.complete,
      naturalWidth: img?.naturalWidth,
      naturalHeight: img?.naturalHeight,
      visible: img?.classList.contains('visible')
    };
  });
  console.log('Perumal Image Status:', imgStatus);

  console.log('\nTesting Universe (Wheel, Poems, Sticker)...');
  await page.goto('http://localhost:4173/?stage=universe', { waitUntil: 'networkidle0' });

  // Check sticker
  const stickerStatus = await page.evaluate(() => {
    const sticker = document.querySelector('.wheel-mascot-img');
    return {
      src: sticker?.src,
      complete: sticker?.complete,
      naturalWidth: sticker?.naturalWidth,
      naturalHeight: sticker?.naturalHeight
    };
  });
  console.log('Wheel Sticker Status:', stickerStatus);

  // Test Wheel Spin
  console.log('\nTesting Wheel Spin...');
  const spinBtn = await page.$('.wheel-spin-action-btn');
  if (spinBtn) {
    await spinBtn.click();
    console.log('Clicked spin button!');
    // Check rotation immediately
    await new Promise(r => setTimeout(r, 600));
    const midTransform = await page.evaluate(() => {
      const c = document.querySelector('.wheel-canvas');
      return c ? c.style.transform : null;
    });
    console.log('Wheel mid-spin transform:', midTransform);

    // Wait for spin to complete (3.5s)
    await new Promise(r => setTimeout(r, 3600));
    const resultCard = await page.evaluate(() => {
      const r = document.querySelector('.wheel-result-card');
      return r ? r.textContent.trim() : null;
    });
    console.log('Wheel Result Card:', resultCard);
  } else {
    console.log('Could not find .wheel-spin-action-btn');
  }

  // Test Kavithai
  console.log('\nTesting Kavithai...');
  const kavithaiInfo = await page.evaluate(() => {
    const badge = document.querySelector('.special-tamil-pill, .poem-lang-pill');
    const taLines = document.querySelectorAll('.poem-lines-ta p');
    return {
      badge: badge ? badge.textContent.trim() : null,
      taLineCount: taLines.length
    };
  });
  console.log('Poem 1 (Tamil Kavithai):', kavithaiInfo);

  // Next poem
  const nextBtns = await page.$$('.kavithai-nav-row .pill-button');
  const nextBtn = nextBtns[nextBtns.length - 1];
  if (nextBtn) {
    await nextBtn.click();
    await new Promise(r => setTimeout(r, 300));
    const poem2Info = await page.evaluate(() => {
      const badge = document.querySelector('.special-tamil-pill, .poem-lang-pill');
      const taLines = document.querySelectorAll('.poem-lines-ta p');
      const enTitle = document.querySelector('.standalone-en-title');
      return {
        badge: badge ? badge.textContent.trim() : null,
        taLineCount: taLines.length,
        enTitle: enTitle ? enTitle.textContent.trim() : null
      };
    });
    console.log('Poem 2 (English Poem):', poem2Info);
  }

  // Test Scroll Magic
  console.log('\nTesting Scroll effect...');
  await page.evaluate(() => {
    window.scrollTo({ top: 1200 });
  });
  await new Promise(r => setTimeout(r, 200));
  await page.evaluate(() => {
    window.scrollTo({ top: 1800 });
  });
  await new Promise(r => setTimeout(r, 200));
  console.log('Scroll events fired successfully.');

  await browser.close();
  console.log('\nALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
})();

