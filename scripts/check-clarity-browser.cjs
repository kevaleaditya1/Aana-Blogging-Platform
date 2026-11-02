// Clarity is mocked: these checks send no recordings or analytics to Microsoft.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE || 'playwright');
(async () => {
    const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    const checks = [];
    const contexts = [];
    const check = (name, value) => { assert(value, name); checks.push(name); };
    async function visit(path = '/', choice, legacy) {
        const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
        context.setDefaultNavigationTimeout(60000);
        contexts.push(context);
        let requests = 0;
        await context.route('https://www.clarity.ms/tag/**', async route => {
            requests++;
            check('Configured project URL', route.request().url() === 'https://www.clarity.ms/tag/z7kfshhcq0');
            await route.fulfill({ contentType: 'application/javascript', body: 'window.__clarityCalls=window.clarity.q||[];window.clarity=function(){window.__clarityCalls.push(Array.from(arguments))};' });
        });
        await context.route(/https:\/\/.*clarity\.ms\/(?!tag\/)/, route => route.abort());
        await context.route('**/*', route => {
            const url = route.request().url();
            if (url.startsWith('http://127.0.0.1:3202/')) return route.continue();
            if (url.startsWith('https://www.clarity.ms/tag/')) return route.fallback();
            return route.abort();
        });
        await context.addInitScript(({ choice, legacy }) => {
            if (choice) localStorage.setItem('aana-consent-v2', choice);
            if (legacy) localStorage.setItem('aana-consent-v1', legacy);
        }, { choice, legacy });
        const page = await context.newPage();
        await page.goto('http://127.0.0.1:3202' + path, { waitUntil: 'networkidle' });
        return { page, requests: () => requests };
    }
    try {
        const fresh = await visit();
        check('No tracker before consent', fresh.requests() === 0);
        for (const width of [320, 390, 768, 1440]) {
            await fresh.page.setViewportSize({ width, height: 900 });
            check(`Consent controls visible at ${width}`, await fresh.page.getByRole('button', { name: 'Accept analytics', exact: true }).isVisible());
            check(`No horizontal overflow at ${width}`, await fresh.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        }
        await fresh.page.getByRole('button', { name: 'Accept analytics', exact: true }).click();
        await fresh.page.waitForFunction(() => Boolean(window.__clarityCalls));
        check('One load after acceptance', fresh.requests() === 1);
        check('Masked page content', await fresh.page.locator('body').getAttribute('data-clarity-mask') === 'true');
        const calls = await fresh.page.evaluate(() => window.__clarityCalls);
        check('Explicit analytics grant without advertising', calls.some(c => c[0] === 'consentv2' && c[1].analytics_Storage === 'granted' && c[1].ad_Storage === 'denied'));
        await fresh.page.evaluate(() => { document.cookie = '_clck=test; path=/'; document.cookie = '_clsk=test; path=/'; });
        await fresh.page.getByRole('button', { name: 'Cookie preferences', exact: true }).click();
        await fresh.page.getByRole('button', { name: 'Reject optional', exact: true }).click();
        await fresh.page.waitForLoadState('networkidle');
        check('Withdrawal stays rejected', await fresh.page.evaluate(() => localStorage.getItem('aana-consent-v2')) === 'rejected');
        check('Withdrawal removes first-party Clarity cookies', !(await fresh.page.context().cookies()).some(c => /^_cl[cs]k$/.test(c.name)));
        check('Withdrawal does not reload tracker', fresh.requests() === 1);
        const oldAccepted = await visit('/', undefined, 'accepted');
        check('Old acceptance requires new recording consent', oldAccepted.requests() === 0 && await oldAccepted.page.getByRole('button', { name: 'Accept analytics', exact: true }).isVisible());
        const oldRejected = await visit('/', undefined, 'rejected');
        check('Old rejection is respected', oldRejected.requests() === 0 && await oldRejected.page.evaluate(() => localStorage.getItem('aana-consent-v2')) === 'rejected');
        for (const path of ['/contact', '/search?q=private-search', '/newsletter/confirm/not-a-real-token', '/?email=private-value', '/#private-fragment']) {
            const excluded = await visit(path, 'accepted');
            check(`No initialization on excluded URL ${path.split('?')[0]}`, excluded.requests() === 0);
        }
        const navigated = await visit('/', 'accepted');
        await navigated.page.getByRole('link', { name: 'Contact', exact: true }).click();
        await navigated.page.waitForURL('**/contact');
        await navigated.page.waitForLoadState('networkidle');
        check('Public-to-contact transition unloads recorder', navigated.requests() === 1 && await navigated.page.evaluate(() => !window.clarity));
        const programmatic = await visit('/', 'accepted');
        await programmatic.page.evaluate(() => history.pushState({}, '', '/search?q=private-test'));
        await programmatic.page.waitForURL('**/search?q=private-test');
        await programmatic.page.waitForLoadState('networkidle');
        check('Programmatic search navigation unloads recorder', programmatic.requests() === 1 && await programmatic.page.evaluate(() => !window.clarity));
        fs.writeFileSync('audit/clarity-browser.json', JSON.stringify(checks, null, 2));
        console.log(`PASS ${checks.length} Clarity consent, exclusion, withdrawal and layout checks`);
    } finally { await Promise.all(contexts.map(c => c.close())); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
