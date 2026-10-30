# Aana site audit — 30 October 2026

Audited https://www.aanaa.blog, which redirects with HTTP 308 to https://aanaa.blog/.

## Measured Lighthouse results

Lighthouse 13.6.0; one mobile run and one desktop run of the production homepage. Mobile uses Lighthouse's default simulated mobile conditions; desktop uses the desktop preset. These are lab measurements, not real-user Core Web Vitals or a site-wide certification.

| Category | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 57 | 97 |
| Accessibility | 95 | 100 |
| Best practices | 73 | 73 |
| SEO | 100 | 100 |

| Metric | Mobile | Desktop |
| --- | ---: | ---: |
| First Contentful Paint | 3.9 s | 0.5 s |
| Largest Contentful Paint | 3.9 s | 0.5 s |
| Total Blocking Time | 870 ms | 120 ms |
| Cumulative Layout Shift | 0.001 | 0 |

## Prioritized improvements

1. **Reduce homepage size and rendering work.** The live HTML contains 155 article anchors (154 unique article destinations), 155 images, and 1,226,071 uncompressed bytes. Lighthouse measured 3,161 DOM elements and 7.2 s of mobile main-thread work, including 2.4 s of style/layout and 2.5 s of script evaluation. In app/page.tsx, latestPosts includes every post. Show approximately 9–12 latest stories, then use paginated archive pages. In lib/posts.ts, use a bounded query and select only listing fields rather than retrieving every post's full content. Avoid eagerly loading below-the-fold images. Reassess glass/blur effects if rendering cost remains high after reducing content.

2. **Reduce third-party and initial JavaScript.** Mobile Lighthouse estimates 274 KiB of unused JavaScript; much belongs to AdSense and Google Analytics. app/layout.tsx loads AdSense globally and mounts the chatbot globally. Load ads only where needed and evaluate deferring nonessential scripts; dynamically load chat when opened. Preserve required ad functionality and applicable consent behavior. Re-measure after changes; savings are estimates, not guaranteed score increases.

3. **Fix broken cover images.** Lighthouse logged HTTP 400 for /_next/image?url=%2Fimages%2Fdefault-blog-cover.jpg&w=750&q=75. The underlying /images/default-blog-cover.jpg returns HTTP 404. The mobile screenshot shows a broken featured cover. Supply a valid fallback asset and validate cover URLs before publishing.

4. **Fix the mobile navigation button.** Lighthouse identifies the mobile menu toggle as a button without an accessible name. In components/layout/header.tsx, provide an aria-label, aria-expanded, and aria-controls. Verify keyboard operation and focus behavior manually; an automated accessibility score does not cover every interaction.

5. **Resolve the ad Content Security Policy error.** Lighthouse recorded a blocked connection to ep1.adtrafficquality.google under connect-src. Review the required ad endpoints and narrowly adjust next.config.ts or remove the integration if unused. Avoid a blanket wildcard. Third-party ad cookies also lowered Best Practices; their presence is not itself evidence of a security breach.

6. **Repair sitemap and article canonical metadata.** The deployed sitemap lists /newsletter, which returns HTTP 404. Remove that entry or create the intended page. The sampled article has title, H1 and article metadata but no canonical link. Add a self-referencing canonical in app/blog/[slug]/page.tsx and use the production base URL consistently. The homepage canonical and robots sitemap URL are correct. Review sitemap coverage for /blog, /category and other useful public pages. Use actual modification dates instead of refresh-time timestamps for static pages.

7. **Align editorial content with positioning.** The homepage promises independent smartphone reviews, gadget guides and AI insights, but the featured article sampled was about Jefferson and the Vikings; other visible links covered the Chargers and Shell buybacks. Filter automated publishing and featured selection to match the site's editorial scope, or change the positioning to reflect broader coverage. This is a reader-trust and relevance finding, not a measured search-ranking penalty.

8. **Review public-page caching.** The homepage returns private/no-cache/no-store and app/page.tsx sets revalidate=0. Consider short-lived public content caching with explicit invalidation after publishing, while keeping authenticated data private. The measured Lighthouse root-document response was fast in this run, so server latency was not the primary measured bottleneck.

## Strengths and limits

The live site uses HTTPS, a consistent host redirect, a correct homepage canonical, crawlable server-rendered content, descriptive homepage metadata and very low measured layout shift. Security headers including HSTS, nosniff and framing restrictions were present. Desktop performance was strong.

The 100 SEO score covers Lighthouse's automated homepage checks, not search rankings, complete sitemap integrity, content quality or all article metadata. No Search Console, real-user analytics, authenticated flows, form submissions, complete link crawl, penetration test or full manual accessibility audit was performed. Local source observations should be checked against the deployed commit before implementation. No application source changes were made.

Reports: mobile.report.html and desktop.report.html; raw JSON reports are retained alongside them. mobile.jpg is the Lighthouse mobile screenshot. Retrieved homepage, article, robots and sitemap files are retained as supporting snapshots.
