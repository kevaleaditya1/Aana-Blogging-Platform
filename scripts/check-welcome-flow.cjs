// Stateful provider/database mocks. This script sends no mail and changes no real records.
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const assert = require('node:assert/strict');
const checks = [];
const check = (name, fn) => { fn(); checks.push(name); };
function load(file, deps = {}, env = {}) {
    const module = { exports: {} };
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, {
        module, exports: module.exports, require: name => name.startsWith('node:') ? require(name) : deps[name] || (() => { throw Error('Unexpected import ' + name); })(),
        process: { env }, URL, Request, Response, Buffer, console: { error() {} },
    });
    return module.exports;
}
const clone = value => value == null ? value : structuredClone(value);
const accounts = new Map(); const subscriptions = new Map(); const legacy = new Map();
let counter = 0;
const matches = (row, where) => Object.entries(where).every(([key, value]) => {
    if (value && typeof value === 'object' && 'gt' in value) return row[key] > value.gt;
    if (value?.getTime) return row[key]?.getTime() === value.getTime();
    return row[key] === value;
});
const db = {
    user: {
        findUnique: async ({ where }) => clone(accounts.get(where.email)),
        updateMany: async ({ where, data }) => { let count = 0; for (const row of accounts.values()) if (matches(row, where)) { Object.assign(row, data); count++; } return { count }; },
        upsert: async ({ where, create, update }) => { const row = accounts.get(where.email) || { id: 'cmvaccount' + (++counter), welcomeEmailQueuedAt: null, welcomeEmailId: null, ...create }; Object.assign(row, update); accounts.set(where.email, row); return clone(row); },
    },
    newsletterSubscriber: {
        upsert: async ({ where, create, update }) => { const row = subscriptions.get(where.email) || { id: 'cmvnewsletter' + (++counter), verifiedAt: null, unsubscribedAt: null, confirmationVersion: null, confirmationExpiresAt: null, confirmationEmailQueuedAt: null, confirmationEmailId: null, ...create }; Object.assign(row, update); subscriptions.set(where.email, row); return clone(row); },
        findUnique: async ({ where }) => clone([...subscriptions.values()].find(row => matches(row, where))),
        findUniqueOrThrow: async query => { const row = await db.newsletterSubscriber.findUnique(query); if (!row) throw Error('Not found'); return row; },
        updateMany: async ({ where, data }) => { let count = 0; for (const row of subscriptions.values()) if (matches(row, where)) { Object.assign(row, data); count++; } return { count }; },
        update: async ({ where, data }) => { const row = [...subscriptions.values()].find(row => matches(row, where)); if (!row) throw Error('Not found'); Object.assign(row, data); return clone(row); },
    },
    subscriber: {
        upsert: async ({ where, create, update }) => { const row = legacy.get(where.email) || { ...create }; Object.assign(row, update); legacy.set(where.email, row); return clone(row); },
        updateMany: async ({ where, data }) => { const row = legacy.get(where.email); if (row) Object.assign(row, data); return { count: row ? 1 : 0 }; },
    },
    $transaction: async operation => typeof operation === 'function' ? operation(db) : Promise.all(operation),
};
const env = { NEWSLETTER_UNSUBSCRIBE_SECRET: 'mock-newsletter-secret-'.repeat(3) };
const site = load('lib/site.ts');
const confirmation = load('lib/email/confirmation.ts', { '@/lib/site': site }, env);
const unsubscribe = load('lib/email/unsubscribe.ts', { '@/lib/site': site }, env);
const validation = load('lib/validation.ts');
const deliveries = new Map(); const attempts = [];
let failProvider = false;
const provider = {
    unitpostConfiguration() { return {}; },
    async sendUnitpostEmail(message) {
        attempts.push(clone(message));
        if (failProvider) throw Error('Mock provider failure');
        if (deliveries.has(message.idempotencyKey)) { assert.equal(JSON.stringify(deliveries.get(message.idempotencyKey).message), JSON.stringify(message)); return deliveries.get(message.idempotencyKey).result; }
        const result = { id: 'mock-mail-' + (deliveries.size + 1), status: 'queued' };
        deliveries.set(message.idempotencyKey, { message: clone(message), result }); return result;
    },
};
const welcome = load('lib/email/welcome.ts', { '@/lib/prisma': { default: db }, '@/lib/site': site, '@/lib/email/unitpost': provider, '@/lib/email/confirmation': confirmation, '@/lib/email/unsubscribe': unsubscribe }, env);
const next = { NextResponse: { json: (body, init) => Response.json(body, init) } };
const subscribe = load('app/api/newsletter/subscribe/route.ts', { 'next/server': next, '@/lib/validation': validation, '@/lib/email/welcome': welcome });
const confirm = load('app/api/newsletter/confirm/route.ts', { 'next/server': next, '@/lib/prisma': { default: db }, '@/lib/email/confirmation': confirmation });
const optout = load('app/api/newsletter/unsubscribe/route.ts', { 'next/server': next, '@/lib/prisma': { default: db }, '@/lib/email/unsubscribe': unsubscribe });
const request = (path, body) => new Request('https://aanaa.blog' + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
const tokenFor = email => { const row = subscriptions.get(email); return confirmation.confirmationToken(row.id, row.confirmationVersion, row.confirmationExpiresAt); };

(async () => {
    let response = await subscribe.POST(request('/api/newsletter/subscribe', { email: 'not-email' }));
    check('Malformed signup rejected before sending', () => { assert.equal(response.status, 400); assert.equal(deliveries.size, 0); });
    response = await subscribe.POST(request('/api/newsletter/subscribe', { email: ' Reader@Example.com ' }));
    // Client normally trims; server validation rejects whitespace before normalization.
    check('Malformed whitespace input is not emailed', () => assert.equal(response.status, 400));
    response = await subscribe.POST(request('/api/newsletter/subscribe', { email: 'Reader@Example.com' }));
    check('New signup queues welcome/confirmation', () => { assert.equal(response.status, 200); assert.equal(deliveries.size, 1); });
    check('Newsletter welcome is sent immediately', () => assert(attempts[0].subject.startsWith('Welcome to Aana')));
    check('Unconfirmed subscriber excluded from delivery', () => { assert.equal(subscriptions.get('reader@example.com').isActive, false); assert.equal(subscriptions.get('reader@example.com').verifiedAt, null); assert.equal(legacy.get('reader@example.com').active, false); });
    check('Welcome includes confirmation and unsubscribe', () => { assert(attempts[0].text.includes('/newsletter/confirm/')); assert(attempts[0].headers['List-Unsubscribe']); });
    const token = tokenFor('reader@example.com');
    check('Token contains no email', () => assert(!token.includes('@')));
    check('Expired token rejected', () => assert.equal(confirmation.verifyConfirmationToken(token, Date.now() + 25 * 60 * 60 * 1000), null));
    check('Tampered token rejected', () => assert.equal(confirmation.verifyConfirmationToken(token.slice(0, -1) + (token.endsWith('x') ? 'y' : 'x')), null));
    await subscribe.POST(request('/api/newsletter/subscribe', { email: 'reader@example.com' }));
    check('Repeated signup does not send duplicate welcome', () => { assert.equal(deliveries.size, 1); assert.equal(attempts.length, 1); });
    response = await confirm.POST(request('/api/newsletter/confirm', { token: 'bad' }));
    check('Invalid confirmation never activates', () => { assert.equal(response.status, 400); assert.equal(subscriptions.get('reader@example.com').isActive, false); });
    response = await confirm.POST(request('/api/newsletter/confirm', { token }));
    let body = await response.json();
    check('Valid POST confirms subscription', () => { assert.equal(response.status, 200); assert.equal(body.newlyConfirmed, true); assert(subscriptions.get('reader@example.com').verifiedAt); assert.equal(subscriptions.get('reader@example.com').isActive, true); assert.equal(legacy.get('reader@example.com').active, true); });
    body = await (await confirm.POST(request('/api/newsletter/confirm', { token }))).json();
    check('Repeated confirmation is not another conversion/email', () => { assert.equal(body.newlyConfirmed, false); assert.equal(deliveries.size, 1); });
    response = await subscribe.POST(request('/api/newsletter/subscribe', { email: 'reader@example.com' }));
    check('Confirmed duplicate gets specific feedback', () => assert.equal(response.status, 409));
    const id = subscriptions.get('reader@example.com').id;
    response = await optout.POST(new Request('https://aanaa.blog/api/newsletter/unsubscribe?token=' + unsubscribe.unsubscribeToken(id), { method: 'POST' }));
    check('Unsubscribe cancels active and pending state', () => { assert.equal(response.status, 200); assert.equal(subscriptions.get('reader@example.com').isActive, false); assert.equal(subscriptions.get('reader@example.com').confirmationVersion, null); assert.equal(legacy.get('reader@example.com').active, false); });
    response = await confirm.POST(request('/api/newsletter/confirm', { token }));
    check('Old confirmation cannot undo unsubscribe', () => assert.equal(response.status, 400));
    await subscribe.POST(request('/api/newsletter/subscribe', { email: 'reader@example.com' }));
    check('Explicit resubscribe gets new confirmation', () => { assert.equal(deliveries.size, 2); assert.notEqual(tokenFor('reader@example.com'), token); assert.equal(subscriptions.get('reader@example.com').isActive, false); });

    failProvider = true;
    response = await subscribe.POST(request('/api/newsletter/subscribe', { email: 'failure@example.com' }));
    check('Provider failure is not signup-email success', () => { assert.equal(response.status, 503); assert.equal(subscriptions.get('failure@example.com').confirmationEmailQueuedAt, null); assert.equal(subscriptions.get('failure@example.com').isActive, false); });
    const failedKey = attempts.at(-1).idempotencyKey;
    failProvider = false;
    response = await subscribe.POST(request('/api/newsletter/subscribe', { email: 'failure@example.com' }));
    check('Retry reuses stable delivery key', () => { assert.equal(response.status, 200); assert.equal(attempts.at(-1).idempotencyKey, failedKey); });
    const expired = subscriptions.get('failure@example.com'); expired.confirmationExpiresAt = new Date(Date.now() - 1000);
    const previousVersion = expired.confirmationVersion;
    await subscribe.POST(request('/api/newsletter/subscribe', { email: 'failure@example.com' }));
    check('Expired request rotates confirmation safely', () => assert.notEqual(expired.confirmationVersion, previousVersion));

    const racedToken = tokenFor('reader@example.com');
    const originalUpdateMany = db.newsletterSubscriber.updateMany;
    db.newsletterSubscriber.updateMany = async query => {
        if (query.data.verifiedAt) {
            const row = subscriptions.get('reader@example.com'); row.confirmationVersion = null; row.confirmationExpiresAt = null; row.isActive = false;
            return { count: 0 };
        }
        return originalUpdateMany(query);
    };
    response = await confirm.POST(request('/api/newsletter/confirm', { token: racedToken }));
    check('Concurrent cancellation cannot report false confirmation', () => { assert.equal(response.status, 400); assert.equal(subscriptions.get('reader@example.com').isActive, false); });
    db.newsletterSubscriber.updateMany = originalUpdateMany;

    const jobs = [];
    let config;
    const fakeNextAuth = options => { config = options; return { handlers: {}, auth() {}, signIn() {}, signOut() {} }; };
    load('lib/auth.ts', {
        'next-auth': { default: fakeNextAuth }, 'next-auth/providers/google': { default: options => ({ id: 'google', ...options }) },
        'next-auth/providers/credentials': { default: options => ({ id: 'credentials', ...options }) },
        '@auth/prisma-adapter': { PrismaAdapter: () => ({}) }, '@prisma/client': { PrismaClient: class { constructor() { return db; } } },
        bcryptjs: { default: { compare: async (value, hash) => value === hash } },
        'next/server': { after: job => jobs.push(job) }, '@/lib/email/welcome': welcome,
    });
    accounts.set('account@example.com', { id: 'cmvaccount0001', email: 'account@example.com', name: 'Account', role: 'USER', password: 'correct-password', welcomeEmailQueuedAt: null, welcomeEmailId: null });
    const beforeAccounts = deliveries.size;
    const invalidLogin = await config.providers[1].authorize({ email: 'account@example.com', password: 'wrong' });
    check('Invalid credentials never schedule a welcome', () => { assert.equal(invalidLogin, null); assert.equal(jobs.length, 0); assert.equal(deliveries.size, beforeAccounts); });
    const loggedIn = await config.providers[1].authorize({ email: 'account@example.com', password: 'correct-password' });
    await config.events.signIn({ user: loggedIn, account: { provider: 'credentials' } });
    check('Successful password sign-in defers email', () => { assert.equal(jobs.length, 1); assert.equal(deliveries.size, beforeAccounts); });
    await jobs.shift()();
    check('First successful sign-in queues one account welcome', () => { assert.equal(deliveries.size, beforeAccounts + 1); assert(accounts.get('account@example.com').welcomeEmailQueuedAt); });
    await config.events.signIn({ user: loggedIn, account: { provider: 'google' } }); await jobs.shift()();
    await config.events.signIn({ user: loggedIn, account: { provider: 'credentials' } }); await jobs.shift()();
    check('Repeat sign-ins across providers do not send again', () => assert.equal(deliveries.size, beforeAccounts + 1));
    check('Account sign-in does not enroll newsletter', () => assert.equal(subscriptions.has('account@example.com'), false));
    accounts.set('google@example.com', { id: 'cmvgoogle00001', email: 'google@example.com', welcomeEmailQueuedAt: null });
    await config.events.signIn({ user: { email: 'google@example.com' }, account: { provider: 'google' } }); await jobs.shift()();
    check('New Google user receives an account welcome', () => assert(accounts.get('google@example.com').welcomeEmailQueuedAt));
    accounts.set('retry@example.com', { id: 'cmvretry000001', email: 'retry@example.com', welcomeEmailQueuedAt: null });
    failProvider = true;
    await config.events.signIn({ user: { email: 'retry@example.com' }, account: { provider: 'credentials' } }); await jobs.shift()();
    check('Mail failure does not reject sign-in or mark sent', () => assert.equal(accounts.get('retry@example.com').welcomeEmailQueuedAt, null));
    failProvider = false;
    await config.events.signIn({ user: { email: 'retry@example.com' }, account: { provider: 'credentials' } }); await jobs.shift()();
    check('Later successful sign-in retries a failed welcome', () => assert(accounts.get('retry@example.com').welcomeEmailQueuedAt));
    accounts.set('parallel@example.com', { id: 'cmvparallel0001', email: 'parallel@example.com', welcomeEmailQueuedAt: null });
    const parallelBefore = deliveries.size;
    await Promise.all([welcome.sendAccountWelcome('parallel@example.com'), welcome.sendAccountWelcome('parallel@example.com')]);
    check('Concurrent first sign-ins share one provider delivery', () => assert.equal(deliveries.size, parallelBefore + 1));
    fs.writeFileSync('audit/welcome-flow-tests.json', JSON.stringify({ passed: checks.length, checks }, null, 2));
    console.log(`PASS ${checks.length} stateful newsletter/account welcome checks; no real emails or records used`);
})().catch(error => { console.error(error); process.exitCode = 1; });
