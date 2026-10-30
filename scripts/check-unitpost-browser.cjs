const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE || 'playwright');
let browser;
(async () => {
    browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.addInitScript(() => localStorage.setItem('aana-consent-v1', 'accepted'));
    const page = await context.newPage();
    let submissions = 0;
    const trackers = [];
    page.on('request', request => {
        if (request.url().includes('/api/newsletter/unsubscribe') && request.method() === 'POST') submissions++;
        if (/googletagmanager|google-analytics/.test(request.url())) trackers.push(request.url());
    });
    await page.goto('http://127.0.0.1:3400/unsubscribe/local-invalid-test-token', { waitUntil: 'networkidle' });
    const checks = [];
    const check = (name, passed) => { checks.push({ name, passed }); console.log(passed ? 'PASS' : 'FAIL', name); };
    check('GET confirmation does not unsubscribe', submissions === 0);
    check('Unsubscribe page is noindex', (await page.locator('meta[name=robots]').getAttribute('content')).includes('noindex'));
    check('Preference token path not tracked', trackers.length === 0);
    for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        check(`Preference layout ${width}px`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    }
    const invalid = await context.request.post('http://127.0.0.1:3400/api/newsletter/unsubscribe?token=invalid');
    check('Invalid signed POST rejected by real handler', invalid.status() === 400);
    const scanner = await context.request.get('http://127.0.0.1:3400/api/newsletter/unsubscribe?token=invalid');
    check('GET API cannot mutate preferences', scanner.status() === 405);
    await page.route('**/api/newsletter/unsubscribe', route => route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"Mock temporary failure."}' }));
    await page.getByRole('button', { name: 'Unsubscribe', exact: true }).click();
    await page.locator('main').getByRole('alert').waitFor();
    check('Failure feedback and retry control', await page.getByRole('button', { name: 'Unsubscribe', exact: true }).isEnabled());
    await page.unroute('**/api/newsletter/unsubscribe');
    await page.route('**/api/newsletter/unsubscribe', async route => { await new Promise(resolve => setTimeout(resolve, 400)); await route.fulfill({ contentType: 'application/json', body: '{"success":true}' }); });
    await page.getByRole('button', { name: 'Unsubscribe', exact: true }).click();
    check('Pending action is busy and disabled', await page.locator('main form').getAttribute('aria-busy') === 'true' && await page.getByRole('button', { name: 'Updating…' }).isDisabled());
    await page.getByText('You have been unsubscribed from Aana newsletters.').waitFor();
    check('Mocked success is inline', true);
    fs.writeFileSync('audit/unitpost-browser-results.json', JSON.stringify(checks, null, 2));
    await browser.close();
    if (checks.some(check => !check.passed)) process.exitCode = 1;
})().catch(async error => { console.error(error); await browser?.close(); process.exitCode = 1; });
