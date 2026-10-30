/* Local read-only/API-mocked quality checks. No real account creation or email. */
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE || 'playwright');
const base = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:3100';
const results = { routes: [], layouts: [], checks: [], errors: [] };
const record = (name, passed, detail) => { results.checks.push({ name, passed, detail }); console.log(`${passed ? 'PASS' : 'FAIL'} ${name}`, detail || ''); };

let browser;
(async () => {
    browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const trackers = [];
    page.on('request', request => { if (/googletagmanager|google-analytics|googlesyndication|doubleclick|vercel-insights/.test(request.url())) trackers.push(request.url()); });
    page.on('pageerror', error => results.errors.push(error.message));
    await page.goto(base + '/contact', { waitUntil: 'networkidle', timeout: 90000 });
    await page.getByRole('button', { name: 'Reject optional', exact: true }).waitFor();
    record('No optional trackers before consent', trackers.length === 0);
    await page.getByRole('button', { name: 'Reject optional', exact: true }).click();
    record('Reject persists', await page.evaluate(() => localStorage.getItem('aana-consent-v1')) === 'rejected');
    await page.reload({ waitUntil: 'networkidle' });
    record('Rejection survives reload', await page.getByRole('button', { name: 'Accept analytics', exact: true }).count() === 0 && trackers.length === 0);
    await page.getByRole('button', { name: 'Cookie preferences', exact: true }).click();
    await page.getByRole('button', { name: 'Accept analytics', exact: true }).click();
    record('Acceptance persists', await page.evaluate(() => localStorage.getItem('aana-consent-v1')) === 'accepted');
    await page.getByRole('button', { name: 'Cookie preferences', exact: true }).click();
    await page.getByRole('button', { name: 'Reject optional', exact: true }).click();
    await page.waitForLoadState('networkidle');
    record('Withdrawal persists', await page.evaluate(() => localStorage.getItem('aana-consent-v1')) === 'rejected');

    const contact = page.locator('main form');
    await contact.getByRole('button', { name: 'Send message', exact: true }).click();
    record('Empty fields flagged and first focused', await contact.locator('[aria-invalid=true]').count() === 3 && await contact.locator('[name=name]').evaluate(el => el === document.activeElement));
    await contact.getByLabel('Name', { exact: true }).fill('Audit Tester');
    await contact.getByLabel('Email address', { exact: true }).fill('bad-email');
    await contact.getByLabel('Message', { exact: true }).fill('This is a local mocked quality check.');
    await contact.getByRole('button', { name: 'Send message', exact: true }).click();
    record('Malformed email is associated with field', await contact.locator('[name=email]').getAttribute('aria-invalid') === 'true' && Boolean(await contact.locator('[name=email]').getAttribute('aria-describedby')));
    await contact.getByLabel('Email address', { exact: true }).fill('audit@example.com');
    await page.route('**/api/contact', route => route.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ error: 'Mock service failure.' }) }));
    await contact.getByRole('button', { name: 'Send message', exact: true }).click();
    await contact.getByRole('alert').waitFor();
    record('Server failure preserves input and restores submit', await contact.getByLabel('Email address', { exact: true }).inputValue() === 'audit@example.com' && await contact.getByRole('button', { name: 'Send message', exact: true }).isEnabled());
    await page.unroute('**/api/contact');
    await page.route('**/api/contact', route => route.abort('failed'));
    await contact.getByRole('button', { name: 'Send message', exact: true }).click();
    await contact.getByText(/couldn’t connect/).waitFor();
    record('Network failure feedback', await contact.getByText(/couldn’t connect/).isVisible());
    await page.unroute('**/api/contact');
    let sends = 0;
    await page.route('**/api/contact', async route => { sends++; await new Promise(resolve => setTimeout(resolve, 700)); await route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' }); });
    await contact.getByRole('button', { name: 'Send message', exact: true }).click();
    record('Pending is busy and submit disabled', await contact.getAttribute('aria-busy') === 'true' && await contact.getByRole('button', { name: 'Submitting…', exact: true }).isDisabled());
    await page.waitForURL('**/success/contact');
    await page.getByRole('heading', { name: 'Thank you', exact: true }).waitFor();
    record('Confirmed contact goes to success URL once', sends === 1 && !page.url().includes('audit%40'));
    await page.reload({ waitUntil: 'networkidle' });
    record('Success refresh does not resubmit', sends === 1);

    await page.goto(base + '/signup', { waitUntil: 'networkidle' });
    await page.route('**/api/auth/signup', route => route.fulfill({ status: 201, contentType: 'application/json', body: '{"success":true}' }));
    const signup = page.locator('main form');
    await signup.getByLabel('Name', { exact: true }).fill('Audit Tester');
    await signup.getByLabel('Email address', { exact: true }).fill('audit@example.com');
    await signup.getByLabel('Password', { exact: true }).fill('short');
    await signup.getByRole('button', { name: 'Create account', exact: true }).click();
    record('Short signup password rejected', await signup.locator('[name=password]').getAttribute('aria-invalid') === 'true');
    await signup.getByLabel('Password', { exact: true }).fill('test-password-123');
    await signup.getByRole('button', { name: 'Create account', exact: true }).click();
    await page.waitForURL('**/success/signup');
    record('Mocked email signup success route', true);

    await page.goto(base + '/about', { waitUntil: 'networkidle' });
    await page.route('**/api/newsletter/subscribe', route => route.fulfill({ status: 409, contentType: 'application/json', body: JSON.stringify({ error: 'Already subscribed.', fields: { email: 'Already subscribed.' } }) }));
    const newsletter = page.locator('footer form');
    await newsletter.getByLabel('Email address', { exact: true }).fill('audit@example.com');
    await newsletter.getByRole('button', { name: 'Subscribe to updates' }).click();
    await newsletter.getByRole('alert').waitFor();
    record('Duplicate subscription feedback', await newsletter.locator('[name=email]').getAttribute('aria-invalid') === 'true');
    await page.unroute('**/api/newsletter/subscribe');
    await page.route('**/api/newsletter/subscribe', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' }));
    await newsletter.getByRole('button', { name: 'Subscribe to updates' }).click();
    await page.waitForURL('**/success/newsletter');
    record('Mocked newsletter success route', true);

    for (const path of ['/', '/blog', '/category', '/about', '/contact', '/privacy', '/terms', '/news', '/products/smartphone-guide', '/login', '/signup', '/forgot-password', '/search?q=ai', '/this-page-does-not-exist-quality-audit']) {
        const response = await page.goto(base + path, { waitUntil: 'networkidle', timeout: 90000 });
        const metadata = await page.evaluate(() => ({ title: document.title, description: document.querySelector('meta[name=description]')?.content, canonical: document.querySelector('link[rel=canonical]')?.href, robots: document.querySelector('meta[name=robots]')?.content, og: [...document.querySelectorAll('meta[property^="og:"]')].map(el => [el.getAttribute('property'), el.content]), twitter: [...document.querySelectorAll('meta[name^="twitter:"]')].map(el => [el.name, el.content]) }));
        results.routes.push({ path, status: response.status(), ...metadata });
        if (path.startsWith('/this-page')) record('Unknown route returns HTTP 404', response.status() === 404);
        for (const width of [320, 390, 768, 1440]) {
            await page.setViewportSize({ width, height: width === 768 ? 1024 : 900 });
            const geometry = await page.evaluate(() => ({ width: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
            results.layouts.push({ path, ...geometry, passed: geometry.scrollWidth <= geometry.width + 1 });
        }
        if (path === '/') {
            await page.setViewportSize({ width: 390, height: 844 });
            await page.evaluate(() => window.scrollTo(0, 0));
            const box = await page.locator('main').getByRole('link', { name: 'Explore Articles', exact: true }).boundingBox();
            record('Mobile homepage CTA above fold', box && box.y + box.height < 844);
            record('Mobile sticky CTA visible after rejection', await page.getByRole('navigation', { name: 'Quick reading action' }).isVisible());
            await page.screenshot({ path: 'audit/quality-home-mobile.png' });
            await page.getByRole('button', { name: 'Open navigation' }).click();
            record('Mobile menu exposes expanded state', await page.getByRole('button', { name: 'Close navigation' }).getAttribute('aria-expanded') === 'true');
            await page.screenshot({ path: 'audit/quality-menu-mobile.png' });
        }
        if (path === '/contact') await page.screenshot({ path: 'audit/quality-contact-desktop.png' });
    }
    for (const path of ['/robots.txt', '/sitemap.xml', '/manifest.webmanifest', '/favicon.ico', '/apple-icon.png', '/brand/android-192.png', '/brand/android-512.png', '/social-default.png', '/images/default-blog-cover.jpg']) {
        const response = await context.request.get(base + path, { timeout: 90000 });
        results.routes.push({ path, status: response.status() });
        if (/robots|sitemap|manifest/.test(path)) fs.writeFileSync('audit/quality-' + path.slice(1).replaceAll('/', '-'), await response.text());
        record(`Asset/metadata route ${path}`, response.ok());
    }
    // Invalid data reaches real handlers but is rejected before any database/email mutation.
    for (const endpoint of ['/api/contact', '/api/newsletter/subscribe', '/api/newsletter', '/api/auth/signup', '/api/auth/forgot-password', '/api/auth/reset-password']) {
        const response = await context.request.post(base + endpoint, { data: { email: 42, name: [], message: {}, password: 2, token: [] } });
        record(`Server rejects invalid ${endpoint}`, response.status() === 400, `HTTP ${response.status()}`);
    }
    record('All sampled layouts fit viewport', results.layouts.every(row => row.passed), results.layouts.filter(row => !row.passed));
    fs.writeFileSync('audit/quality-results.json', JSON.stringify(results, null, 2));
    await browser.close();
    if (results.checks.some(check => !check.passed)) process.exitCode = 1;
})().catch(async error => { console.error(error); fs.writeFileSync('audit/quality-results.json', JSON.stringify({ ...results, fatal: error.message }, null, 2)); await browser?.close(); process.exitCode = 1; });
