// Exercise handlers with fake providers. Never connects to Resend or a database.
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const checks = [];
const check = (name, passed) => { checks.push({ name, passed }); console.log(passed ? 'PASS' : 'FAIL', name); };
const load = (path, dependencies, env = {}) => {
    const module = { exports: {} };
    const js = ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
    vm.runInNewContext(js, { module, exports: module.exports, require: name => { if (!(name in dependencies)) throw Error('Unexpected dependency: ' + name); return dependencies[name]; }, process: { env }, Response, Request, URL, console });
    return module.exports;
};
const validation = load('lib/validation.ts', {});
const next = { NextResponse: { json: (data, init) => Response.json(data, init) } };
const request = data => new Request('http://localhost/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
const input = { name: 'Audit Tester', email: 'audit@example.com', message: 'Provider-mocked verification only.' };
(async () => {
    for (const [name, result, status] of [
        ['Provider accepts message', { data: { id: 'mock-accepted-id' }, error: null }, 200],
        ['Provider returns error object', { data: null, error: { message: 'Mock rejected' } }, 502],
        ['Provider returns no accepted ID', { data: {}, error: null }, 502],
    ]) {
        const { POST } = load('app/api/contact/route.ts', { 'next/server': next, '@/lib/validation': validation, resend: { Resend: class { emails = { send: async () => result }; } } }, { RESEND_API_KEY: 'mock', EMAIL_FROM: 'mock@example.com', CONTACT_EMAIL: 'mock@example.com' });
        const response = await POST(request(input));
        const body = await response.json();
        check(name, response.status === status && (status === 200 ? body.success === true : !body.success));
    }
    const { POST } = load('app/api/contact/route.ts', { 'next/server': next, '@/lib/validation': validation, resend: { Resend: class { constructor() { throw Error('Should not instantiate without configuration'); } } } });
    check('Missing email configuration fails honestly', (await POST(request(input))).status === 503);
    for (const kind of ['contact', 'newsletter', 'signup']) {
        check(`Validation rejects non-string ${kind} input`, Object.keys(validation.validateForm(kind, { name: {}, email: 42, password: [], message: [] })).length > 0);
    }
    fs.writeFileSync('audit/api-check-results.json', JSON.stringify(checks, null, 2));
    if (checks.some(row => !row.passed)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
