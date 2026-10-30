// Explicit operator command: no send without --send and a chosen --to address.
require('@next/env').loadEnvConfig(process.cwd());
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const crypto = require('node:crypto');
function load(file, dependencies = {}) {
    const module = { exports: {} };
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, { module, exports: module.exports, require: name => dependencies[name], process, fetch, URL, Response, AbortSignal });
    return module.exports;
}
(async () => {
    const to = process.argv[process.argv.indexOf('--to') + 1];
    const validation = load('lib/validation.ts');
    if (!process.argv.includes('--to') || !validation.isEmail(to)) throw Error('Choose a test recipient with --to address@example.com.');
    const client = load('lib/email/unitpost.ts', { '@/lib/validation': validation, '@/lib/site': load('lib/site.ts') });
    client.unitpostConfiguration();
    if (!process.argv.includes('--send')) { console.log('Configuration ready. No email sent. Add --send to send one connection test to the chosen recipient.'); return; }
    const result = await client.sendUnitpostEmail({
        to, subject: 'Aana — Unitpost connection test',
        html: '<h1>Aana email connection test</h1><p>This confirms that Aana can submit email through Unitpost from news@aanaa.tech.</p><p>No newsletter subscribers were contacted by this test.</p>',
        text: 'Aana email connection test. This confirms that Aana can submit email through Unitpost from news@aanaa.tech. No newsletter subscribers were contacted by this test.',
        idempotencyKey: `aana-connection-test/${crypto.randomUUID()}`,
    });
    fs.writeFileSync('audit/unitpost-test-result.json', JSON.stringify({ to, from: process.env.NEWSLETTER_FROM, ...result }, null, 2));
    console.log(JSON.stringify({ to, ...result }));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
