// All provider and database operations below are mocked; no real mail is sent.
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const checks = [];
const check = (name, fn) => { fn(); checks.push(name); };
function load(file, dependencies = {}, env = {}, fetcher) {
    const module = { exports: {} };
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, {
        module, exports: module.exports, require: name => name.startsWith('node:') ? require(name) : dependencies[name] || (() => { throw Error('Unexpected import: ' + name); })(),
        process: { env }, fetch: fetcher, URL, Response, Request, AbortSignal, Buffer, console: { error() {} },
    });
    return module.exports;
}
const site = load('lib/site.ts');
const validation = load('lib/validation.ts');
const env = { UNITPOST_API_KEY: 'mock-key-never-real', NEWSLETTER_FROM: 'Aana <news@aanaa.tech>', NEWSLETTER_UNSUBSCRIBE_SECRET: 'mock-secret-'.repeat(5) };
const unsubscribe = load('lib/email/unsubscribe.ts', { '@/lib/site': site }, env);
const id = 'cmvaana000001newsletter';
const token = unsubscribe.unsubscribeToken(id);
check('Signed token round trip', () => assert.equal(unsubscribe.verifyUnsubscribeToken(token), id));
check('Tampered signature rejected', () => assert.equal(unsubscribe.verifyUnsubscribeToken(token.slice(0, -1) + (token.endsWith('a') ? 'b' : 'a')), null));
check('Malformed token rejected', () => assert.equal(unsubscribe.verifyUnsubscribeToken('not-a-valid-token'), null));
check('Links contain no email', () => assert(!JSON.stringify(unsubscribe.unsubscribeLinks(id)).includes('@')));

(async () => {
    let captured;
    const client = load('lib/email/unitpost.ts', { '@/lib/site': site, '@/lib/validation': validation }, env, async (url, options) => {
        captured = { url, options, body: JSON.parse(options.body) }; return Response.json({ id: 'mock-provider-id', status: 'queued' });
    });
    const message = { to: 'reader@example.com', subject: 'Test', html: '<p>Hello</p>', idempotencyKey: 'test-stable-key' };
    const accepted = await client.sendUnitpostEmail(message);
    check('Provider acceptance checked', () => assert.equal(accepted.id, 'mock-provider-id'));
    check('Official HTTPS endpoint', () => assert.equal(captured.url, 'https://www.unitpost.com/api/v1/email'));
    check('Confirmed sender and reply address', () => { assert.equal(captured.body.from, env.NEWSLETTER_FROM); assert.equal(captured.body.reply_to, 'contact@aanaa.tech'); });
    check('Tracking disabled', () => { assert.equal(captured.body.open_tracking, false); assert.equal(captured.body.click_tracking, false); });
    check('No recipient list exposure', () => { assert.equal(typeof captured.body.to, 'string'); assert(!captured.body.cc && !captured.body.bcc); });
    check('Stable idempotency header', () => assert.equal(captured.options.headers['Idempotency-Key'], message.idempotencyKey));
    for (const status of [401, 403, 429, 500]) {
        const failed = load('lib/email/unitpost.ts', { '@/lib/site': site, '@/lib/validation': validation }, env, async () => Response.json({ error: 'private provider details' }, { status }));
        await assert.rejects(() => failed.sendUnitpostEmail(message), error => error.message.includes(`HTTP ${status}`) && !error.message.includes('private provider details'));
        checks.push(`Provider HTTP ${status} not reported as success`);
    }
    const malformed = load('lib/email/unitpost.ts', { '@/lib/site': site, '@/lib/validation': validation }, env, async () => Response.json({ id: 'id-with-no-status' }));
    await assert.rejects(() => malformed.sendUnitpostEmail(message)); checks.push('Malformed acceptance rejected');
    const absent = load('lib/email/unitpost.ts', { '@/lib/site': site, '@/lib/validation': validation }, {}, () => { throw Error('Must not call provider'); });
    await assert.rejects(() => absent.sendUnitpostEmail(message)); checks.push('Missing configuration never sends');

    const messages = [];
    let where;
    const newsletter = load('lib/email/newsletter.ts', {
        '@/lib/prisma': { default: { newsletterSubscriber: { findMany: async query => { where = query.where; return [{ id, email: 'reader@example.com' }]; } } } },
        '@/lib/site': site, '@/lib/email/unsubscribe': unsubscribe,
        '@/lib/email/unitpost': { unitpostConfiguration: () => ({}), sendUnitpostEmail: async data => { messages.push(data); return { id: 'queued-mock', status: 'queued' }; } },
    }, env);
    const result = await newsletter.sendNewsletter(['reader@example.com', 'reader@example.com'], 'Digest', [{ id: 'story', title: '<img src=x onerror=alert(1)>Story', summary: '<script>bad</script>Summary', source: 'Source', category: 'Tech', link: 'javascript:alert(1)' }], '2026-10-25');
    check('Only active verified subscribers selected', () => { assert.equal(where.isActive, true); assert.equal(where.verifiedAt.not, null); });
    check('Duplicate addresses not double-sent', () => assert.equal(messages.length, 1));
    check('One-click and visible unsubscribe supplied', () => { assert.equal(messages[0].headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click'); assert(messages[0].html.includes('/unsubscribe/' + token)); });
    check('HTML and link injection excluded', () => { assert(!messages[0].html.includes('onerror=')); assert(!messages[0].html.includes('<script>')); assert(!messages[0].html.includes('javascript:')); });
    check('Accepted counted as queued', () => { assert.equal(result.accepted.length, 1); assert.equal(result.failed, 0); });

    let mutations = 0;
    const route = load('app/api/newsletter/unsubscribe/route.ts', {
        'next/server': { NextResponse: { json: (data, options) => Response.json(data, options) } },
        '@/lib/email/unsubscribe': unsubscribe,
        '@/lib/prisma': { default: { newsletterSubscriber: { findUnique: async () => ({ id, email: 'reader@example.com' }), update: () => ({}) }, subscriber: { updateMany: () => ({}) }, $transaction: async ops => { mutations += ops.length; } } },
    }, env);
    const rejected = await route.POST(new Request('https://aanaa.blog/api/newsletter/unsubscribe?token=bad', { method: 'POST' }));
    check('Invalid unsubscribe cannot mutate subscriptions', () => { assert.equal(rejected.status, 400); assert.equal(mutations, 0); });
    const removed = await route.POST(new Request('https://aanaa.blog/api/newsletter/unsubscribe?token=' + token, { method: 'POST' }));
    check('Valid one-click updates both subscriber stores', () => { assert.equal(removed.status, 200); assert.equal(mutations, 2); });
    fs.writeFileSync('audit/unitpost-tests.json', JSON.stringify({ passed: checks.length, checks }, null, 2));
    console.log(`PASS ${checks.length} mocked Unitpost delivery, unsubscribe and privacy checks`);
})().catch(error => { console.error(error); process.exitCode = 1; });
