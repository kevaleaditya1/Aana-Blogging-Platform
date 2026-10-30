const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE || 'playwright');
const origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:3100';
const checks = [];
const check = (name, passed, detail) => { checks.push({ name, passed, detail }); console.log(passed ? 'PASS' : 'FAIL', name, detail || ''); };
let browser;
(async () => {
    browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(origin, { waitUntil: 'networkidle' });
    check('Consent banner suppresses sticky CTA', !(await page.getByRole('navigation', { name: 'Quick reading action' }).count()));
    await page.screenshot({ path: 'audit/quality-consent-mobile.png' });
    await page.getByRole('button', { name: 'Reject optional', exact: true }).click();
    await page.locator('footer input[type=email]').focus();
    check('Focused form suppresses sticky CTA', !(await page.getByRole('navigation', { name: 'Quick reading action' }).count()));
    await page.locator('footer input[type=email]').blur();
    await page.getByRole('button', { name: 'Cookie preferences', exact: true }).click();
    check('Preferences reopening focuses heading', await page.locator('#privacy-heading').evaluate(el => el === document.activeElement));
    await page.getByRole('button', { name: 'Reject optional', exact: true }).click();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.evaluate(() => window.scrollTo(0, 0));
    const desktopCTA = await page.locator('main').getByRole('link', { name: 'Explore Articles', exact: true }).boundingBox();
    check('Desktop CTA above fold', desktopCTA && desktopCTA.y + desktopCTA.height < 900);
    await page.screenshot({ path: 'audit/quality-home-desktop.png' });
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    check('Wordmark matches selected theme', await page.locator('header a[aria-label="Aana home"] img').evaluateAll(images => {
        const dark = document.documentElement.classList.contains('dark');
        return images.some(img => img.src.endsWith(dark ? 'wordmark-dark.svg' : 'wordmark-light.svg') && getComputedStyle(img).display !== 'none');
    }));
    await page.screenshot({ path: 'audit/quality-home-light.png' });
    const article = await page.locator('main a[href^="/blog/"]').first().getAttribute('href');
    const category = await page.locator('header nav a[href^="/category/"]').first().getAttribute('href');
    for (const path of [article, category].filter(Boolean)) {
        const response = await page.goto(origin + path, { waitUntil: 'networkidle', timeout: 90000 });
        check(`Dynamic route ${path}`, response.status() === 200);
        const metadata = await page.evaluate(() => ({ title: document.title, description: document.querySelector('meta[name=description]')?.content, image: document.querySelector('meta[property="og:image"]')?.content }));
        check('Dynamic metadata lengths', metadata.title.length < 60 && metadata.description?.length < 155, metadata);
        for (const width of [320, 390, 768, 1440]) {
            await page.setViewportSize({ width, height: 900 });
            check(`Dynamic layout ${width}px`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        }
        if (path === article) {
            await page.screenshot({ path: 'audit/quality-article-desktop.png' });
            const imageURL = metadata.image.startsWith('https://aanaa.blog/') ? origin + new URL(metadata.image).pathname : metadata.image;
            const image = await context.request.get(imageURL, { timeout: 90000 });
            check('Article sharing image is reachable', image.ok() && image.headers()['content-type']?.startsWith('image/'), {status:image.status(),type:image.headers()['content-type']});
            if (image.ok()) fs.writeFileSync('audit/quality-article-source-image.jpg', await image.body());
        }
    }
    for (const path of ['/api/admin/posts', '/api/admin/update-old-posts', '/api/upload']) {
        const response = await context.request.post(origin + path, { data: {} });
        check(`Unauthorized write blocked ${path}`, response.status() === 401);
    }
    const privateResponse = await context.request.get(origin + '/profile/quality-audit-user', { maxRedirects: 0 });
    check('Anonymous profile access redirects to login', privateResponse.status() === 307 && privateResponse.headers().location?.includes('/login'));
    await page.goto(origin + '/success/contact', { waitUntil: 'networkidle' });
    check('Direct success URL does not claim submission', await page.getByRole('heading', { name: 'Submission status', exact: true }).isVisible());

    await page.goto(origin + '/forgot-password', { waitUntil: 'networkidle' });
    await page.route('**/api/auth/forgot-password', route => route.fulfill({ contentType: 'application/json', body: '{"success":true}' }));
    await page.locator('main').getByLabel('Email address', { exact: true }).fill('audit@example.com');
    await page.getByRole('button', { name: 'Request reset link' }).click();
    await page.getByText('If an account uses this address, a reset link has been requested. Check your inbox.').waitFor();
    check('Password request uses inline utility success', true);
    await page.goto(origin + '/reset-password/' + 'a'.repeat(64), { waitUntil: 'networkidle' });
    await page.route('**/api/auth/reset-password', route => route.fulfill({ contentType: 'application/json', body: '{"success":true}' }));
    await page.getByLabel('New password', { exact: true }).fill('test-password-123');
    await page.getByLabel('Confirm password', { exact: true }).fill('mismatch-123');
    await page.getByRole('button', { name: 'Update password' }).click();
    check('Password mismatch is accessible', await page.locator('main form').getByRole('alert').innerText() === 'Passwords must match.');
    await page.getByLabel('Confirm password', { exact: true }).fill('test-password-123');
    await page.getByRole('button', { name: 'Update password' }).click();
    await page.getByText('Your password has been updated. You can now sign in.').waitFor();
    check('Mocked reset success inline', true);
    fs.writeFileSync('audit/extended-results.json', JSON.stringify(checks, null, 2));
    await browser.close();
    if (checks.some(row => !row.passed)) process.exitCode = 1;
})().catch(async error => { console.error(error); fs.writeFileSync('audit/extended-results.json', JSON.stringify({ checks, error: error.message }, null, 2)); await browser?.close(); process.exitCode = 1; });
