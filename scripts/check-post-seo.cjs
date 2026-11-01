// Read-only: evaluates every published post, without editing content or metadata.
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const assert = require('node:assert/strict');
function load(file, deps = {}) {
    const module = { exports: {} };
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText,
        { module, exports: module.exports, URL, require: name => { if (deps[name]) return deps[name]; throw Error('Unexpected dependency'); } });
    return module.exports;
}
const site = load('lib/site.ts');
const seo = load('lib/post-seo.ts', { '@/lib/site': site });
const sample = { title: 'Testing useful article metadata without cutting any words', excerpt: 'HIFIMAN', content: '# Heading\n\nThis article explains headphone testing with practical comparisons and observations collected during everyday listening.' };
assert(seo.postSEO(sample).description.startsWith('This article explains'));
assert(seo.postSEO(sample).title.length <= 51);
assert.equal(seo.articleAuthor('Aana')['@type'], 'Organization');
assert.equal(seo.articleAuthor('Aana Editorial Team')['@type'], 'Organization');
assert.equal(seo.articleAuthor('Actual Author')['@type'], 'Person');
assert(!seo.jsonLD({ headline: '</script><script>test</script>' }).includes('<'));
assert.equal(site.canonicalURL('https://source.example/article', '/'), 'https://source.example/article');
console.log('PASS metadata fallback, word limits, author identity, safe schema and external canonical fixtures');
if (process.argv.includes('--fixtures-only')) process.exit(0);
require('@next/env').loadEnvConfig(process.cwd());
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
(async () => {
    const posts = await db.post.findMany({ where: { published: true, status: 'published' }, select: { slug: true, title: true, metaTitle: true, metaDescription: true, excerpt: true, content: true, author: true } });
    const rows = posts.map(post => ({ slug: post.slug, ...seo.postSEO(post), authorType: seo.articleAuthor(post.author)['@type'] }));
    const duplicates = key => [...new Set(rows.map(row => row[key]))].filter(value => rows.filter(row => row[key] === value).length > 1);
    const report = { checked: rows.length, invalidLengths: rows.filter(row => row.title.length > 51 || row.description.length > 154 || row.description.length < 50).map(row => row.slug), duplicateTitles: duplicates('title'), duplicateDescriptions: duplicates('description'), rows };
    fs.writeFileSync('audit/post-seo-all-posts.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ checked: report.checked, invalidLengths: report.invalidLengths, duplicateTitles: report.duplicateTitles, duplicateDescriptions: report.duplicateDescriptions }));
    assert(rows.length > 0);
    assert.equal(report.invalidLengths.length, 0);
    assert.equal(report.duplicateTitles.length, 0);
    assert.equal(report.duplicateDescriptions.length, 0);
})().catch(error => { console.error('SEO verification failed', error.code || error.name); process.exitCode = 1; }).finally(() => db.$disconnect());
