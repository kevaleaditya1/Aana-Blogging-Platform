const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE || 'playwright');
(async () => {
    const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    const checks = [];
    try {
        const context = await browser.newContext();
        await context.addInitScript(() => localStorage.setItem('aana-consent-v1', 'rejected'));
        const page = await context.newPage();
        const data = JSON.parse(fs.readFileSync('audit/post-seo-all-posts.json')).rows;
        const selected = [data.find(p => p.slug.startsWith('from-displacement-films')), ...data.filter(p => /headphones-and-now|jessica-alba-s-trainer|denzel-washington/.test(p.slug))].filter(Boolean);
        for (const post of selected) {
            const response = await page.goto('http://127.0.0.1:3201/blog/' + post.slug, { waitUntil: 'domcontentloaded' });
            assert.equal(response.status(), 200);
            assert.equal(await page.locator('h1').count(), 1);
            assert.equal(await page.title(), post.title + ' | Aana');
            assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), post.description);
            const schema = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.map(n => JSON.parse(n.textContent)));
            assert.equal(schema.find(s => s['@type'] === 'Article').author['@type'], 'Organization');
            checks.push({ slug: post.slug, metadata: true, singleH1: true, organization: true });
        }
        for (const width of [320, 390, 768, 1440]) {
            await page.setViewportSize({ width, height: 900 });
            assert(await page.locator('h1').isVisible());
            assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
            checks.push({ width, layout: true });
        }
        await page.screenshot({ path: 'audit/post-seo-fixed-desktop.png' });
        fs.writeFileSync('audit/post-seo-browser.json', JSON.stringify(checks, null, 2));
        console.log(`PASS ${selected.length} rendered articles and four viewport widths`);
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
