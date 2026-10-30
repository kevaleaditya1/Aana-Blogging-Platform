const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const assert = require('node:assert/strict');
const moduleUnderTest = { exports: {} };
const calls = [];
const code = ts.transpileModule(fs.readFileSync('lib/article-images.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
vm.runInNewContext(code, { module: moduleUnderTest, exports: moduleUnderTest.exports, URL, AbortSignal, fetch: async url => { calls.push(String(url)); return new Response('', { status: 302, headers: { location: 'http://127.0.0.1/private' } }); } });
const { articleImage, extractArticleImage, originalArticleImage } = moduleUnderTest.exports;
(async () => {
    assert.equal(articleImage('/social-default.png'), '');
    assert.equal(articleImage('/images/default-blog-cover.jpg'), '');
    assert.equal(articleImage('https://images.example.com/photo.jpg?w=100&amp;#038;h=50'), 'https://images.example.com/photo.jpg?w=100&h=50');
    assert.equal(extractArticleImage("<meta content='https://images.example.com/story.jpg' property='og:image'>", 'https://dev.to/story'), 'https://images.example.com/story.jpg');
    assert.equal(extractArticleImage('&lt;img src=&quot;https://images.example.com/rss.jpg&quot;&gt;'), 'https://images.example.com/rss.jpg');
    assert.equal(extractArticleImage('<img src="/article.jpg">', 'https://dev.to/story'), 'https://dev.to/article.jpg');
    assert.equal(extractArticleImage('![Source photo](https://images.example.com/markdown.jpg)'), 'https://images.example.com/markdown.jpg');
    assert.equal(await originalArticleImage('https://unknown.example/story'), '');
    assert.equal(calls.length, 0);
    assert.equal(await originalArticleImage('https://dev.to/story'), '');
    assert.equal(calls.length, 1); // A redirect to an unapproved/private origin is never fetched.
    console.log('PASS 11 article-image extraction, placeholder, URL decoding and source-fetch safety assertions');
})().catch(error => { console.error(error); process.exitCode = 1; });
