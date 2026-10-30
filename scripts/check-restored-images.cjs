const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE || 'playwright');
let browser;
(async () => {
    browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.addInitScript(() => localStorage.setItem('aana-consent-v1', 'rejected'));
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:3200/', { waitUntil: 'networkidle', timeout: 90000 });
    await page.locator('main img').evaluateAll(async images => {
        await Promise.all(images.map(async img => { img.loading = 'eager'; if (!img.complete) await new Promise(resolve => { img.onload = resolve; img.onerror = resolve; setTimeout(resolve, 25000); }); }));
    });
    const images = await page.locator('main img').evaluateAll(images => images.map(img => ({ url: img.currentSrc, loaded: img.complete && img.naturalWidth > 0 })));
    const branded = images.filter(img => /social-default|default-blog-cover|\/logo\./.test(decodeURIComponent(img.url)));
    await page.screenshot({ path: 'audit/restored-home-desktop.png', fullPage: false });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: 'audit/restored-home-mobile.png' });
    const first = await page.locator('main a[href^="/blog/"]').first().getAttribute('href');
    await page.goto('http://127.0.0.1:3200' + first, { waitUntil: 'networkidle', timeout: 90000 });
    const shareImage = await page.locator('meta[property="og:image"]').first().getAttribute('content');
    const report = { images, brandedPostCovers: branded.length, shareImage, checks: { coversLoaded: images.length > 0 && images.every(img => img.loaded), noBrandedPostCover: branded.length === 0, originalSharingImage: Boolean(shareImage && !/aanaa\.blog\/(social-default|blog\/.*opengraph-image)/.test(shareImage)) } };
    fs.writeFileSync('audit/restored-image-check.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    await browser.close();
    if (Object.values(report.checks).some(value => !value)) process.exitCode = 1;
})().catch(async error => { console.error(error); await browser?.close(); process.exitCode = 1; });
