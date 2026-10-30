// Recover images only from the post's own content, matching news record, or original source.
// Default is a dry run. --apply writes verified URL changes with optimistic comparisons.
require('@next/env').loadEnvConfig(process.cwd());
const { PrismaClient } = require('@prisma/client');
const fs = require('node:fs');
const sharp = require('sharp');
const prisma = new PrismaClient();
const apply = process.argv.includes('--apply');
const placeholder = value => !value || /default-blog-cover|social-default|aanaa\.blog\/logo\./i.test(value);
const decode = text => String(text).replace(/&amp;|&#0*38;/gi, '&').replace(/&quot;/gi, '"').replace(/&#(?:39|x27);/gi, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const publicURL = (value, base) => {
    try {
        const url = new URL(decode(value), base);
        if (url.protocol !== 'https:' || url.username || url.password || /^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|\[)/i.test(url.hostname) || /\.(local|internal)$/i.test(url.hostname)) return null;
        return url.href;
    } catch { return null; }
};
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(match => [match[1].toLowerCase(), decode(match[2] ?? match[3])]));
function candidates(html, base) {
    const text = decode(html || '');
    const results = [];
    for (const tag of text.match(/<meta\b[^>]*>/gi) || []) {
        const attrs = attributes(tag);
        if (/^(og:image(?::url|:secure_url)?|twitter:image(?::src)?)$/i.test(attrs.property || attrs.name || '')) results.push(attrs.content);
    }
    for (const tag of text.match(/<img\b[^>]*>/gi) || []) {
        const attrs = attributes(tag); results.push(attrs['data-src'], attrs.src);
    }
    for (const match of text.matchAll(/!\[[^\]]*\]\((https?:\/\/[^\s)]+)/g)) results.push(match[1]);
    return [...new Set(results.filter(Boolean).map(url => publicURL(url, base)).filter(Boolean))];
}
async function sourceHTML(url) {
    // Sources come from existing canonical article links, never a request parameter.
    const safe = publicURL(url);
    if (!safe || new URL(safe).hostname === 'aanaa.blog') return '';
    try {
        const response = await fetch(safe, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AanaImageRepair/1.0)', Accept: 'text/html' }, signal: AbortSignal.timeout(14000) });
        if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) return '';
        return (await response.text()).slice(0, 3000000);
    } catch { return ''; }
}
const validation = new Map();
async function verify(url) {
    if (validation.has(url)) return validation.get(url);
    const pending = (async () => {
        try {
            const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'image/*' }, signal: AbortSignal.timeout(14000) });
            if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) return false;
            const size = Number(response.headers.get('content-length') || 0);
            if (size > 12000000) { await response.body?.cancel(); return false; }
            const buffer = Buffer.from(await response.arrayBuffer());
            if (buffer.length > 12000000) return false;
            const meta = await sharp(buffer).metadata();
            return meta.width >= 160 && meta.height >= 90;
        } catch { return false; }
    })();
    validation.set(url, pending); return pending;
}

(async () => {
    if (apply && fs.existsSync('audit/image-repair-plan.json')) {
        const plan = JSON.parse(fs.readFileSync('audit/image-repair-plan.json', 'utf8'));
        const results = [];
        const queue = [...plan.repaired];
        await Promise.all(Array.from({ length: 4 }, async () => {
            while (queue.length) {
                const change = queue.shift();
                if (!await verify(change.image)) { results.push({ ...change, updated: 0, reason: 'Image no longer reachable' }); continue; }
                const result = await prisma.post.updateMany({ where: { id: change.id, coverImage: change.old }, data: { coverImage: change.image } });
                if (result.count && change.source) await prisma.newsItem.updateMany({ where: { link: change.source, OR: [{ image: null }, { image: '' }, { image: change.old }] }, data: { image: change.image } });
                results.push({ ...change, updated: result.count });
                console.log(`Repaired ${result.count}: ${change.title.slice(0, 80)}`);
            }
        }));
        fs.writeFileSync('audit/image-repair-applied.json', JSON.stringify({ repaired: results, unresolved: plan.unresolved }, null, 2));
        console.log(JSON.stringify({ updated: results.reduce((sum, row) => sum + row.updated, 0), skipped: results.filter(row => !row.updated).length, unresolved: plan.unresolved.length }));
        return;
    }
    const posts = await prisma.post.findMany({ where: { published: true, status: 'published' }, select: { id: true, title: true, slug: true, coverImage: true, canonicalUrl: true, content: true, excerpt: true } });
    const news = await prisma.newsItem.findMany({ select: { id: true, link: true, image: true, content: true, summary: true } });
    const newsByLink = new Map(news.map(item => [item.link, item]));
    const report = { mode: apply ? 'apply' : 'dry-run', scanned: posts.length, repaired: [], unresolved: [], healthy: 0 };
    const queue = [...posts];
    await Promise.all(Array.from({ length: 5 }, async () => {
        while (queue.length) {
            const post = queue.shift();
            const existing = publicURL(post.coverImage, 'https://aanaa.blog');
            if (!placeholder(post.coverImage) && existing && await verify(existing)) { report.healthy++; continue; }
            const matching = newsByLink.get(post.canonicalUrl);
            let options = [matching?.image, ...candidates(post.content + '\n' + post.excerpt, post.canonicalUrl), ...candidates((matching?.content || '') + '\n' + (matching?.summary || ''), post.canonicalUrl)].filter(Boolean).map(value => publicURL(value, post.canonicalUrl)).filter(value => value && !placeholder(value));
            let found;
            for (const image of [...new Set(options)]) if (await verify(image)) { found = image; break; }
            if (!found && post.canonicalUrl) {
                options = candidates(await sourceHTML(post.canonicalUrl), post.canonicalUrl);
                // Source metadata is preferred; limit incidental images considered after it.
                for (const image of options.slice(0, 8)) if (!placeholder(image) && await verify(image)) { found = image; break; }
            }
            if (!found) { report.unresolved.push({ id: post.id, slug: post.slug, title: post.title, old: post.coverImage, source: post.canonicalUrl }); continue; }
            const change = { id: post.id, slug: post.slug, title: post.title, old: post.coverImage, image: found, source: post.canonicalUrl };
            if (apply) {
                const result = await prisma.post.updateMany({ where: { id: post.id, coverImage: post.coverImage }, data: { coverImage: found } });
                change.updated = result.count;
                if (matching && placeholder(matching.image)) await prisma.newsItem.updateMany({ where: { id: matching.id, image: matching.image }, data: { image: found } });
            }
            report.repaired.push(change);
            console.log(`${apply ? 'Repaired' : 'Found'}: ${post.title.slice(0, 80)}`);
        }
    }));
    fs.writeFileSync(`audit/image-repair-${apply ? 'applied' : 'plan'}.json`, JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ scanned: report.scanned, healthy: report.healthy, recovered: report.repaired.length, unresolved: report.unresolved.length }));
})().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
