# Post SEO review — 1 November 2026

Read-only review: 30 deployed article URLs discovered from the sitemap and first blog listing, plus source inspection of the dynamic article route, post mapping and metadata helpers. This is a sample, not every stored post. No content, metadata, database or deployment was changed.

## Findings

- All 30 sampled articles returned HTTP 200 and included a unique title, unique description, one canonical tag, index/follow directives, Open Graph article metadata, Twitter large-image cards, publication/modification tags and two parseable JSON-LD scripts (Article and BreadcrumbList). Titles were 48–58 characters; descriptions ranged from 7–154 characters. JSON parsing is not a Google Rich Results Test.
- All 30 used absolute `.tech` social URLs. Four self-canonical articles matched the sitemap; 26 syndicated posts intentionally pointed to original external sources as canonical. Preserving attribution/canonicals is appropriate for republished material, but those Aana copies should not be assumed eligible to rank independently. The `.tech` sitemap currently lists 13 URLs, including static/category pages, not 13 original posts.
- Some titles/descriptions are cut mid-word by fixed string slicing. Example: `Jessica Alba’s trainer says these 3 simple tests ca | Aana`. Handwritten concise metadata is preferable to mechanical clipping.
- Three descriptions were under 50 characters, including `HIFIMAN`, `At 64, celebrity trainer` and `The Tom`. Presence of a description tag is insufficient: these need actual article summaries.
- Four sampled original articles had two H1 elements. The template supplies one, and markdown content supplies another. Prefer one clear primary heading and H2 subsections.
- Every sampled Article schema labels author `Aana` as `Person`, linking to the homepage. If Aana is the publishing team, use Organization; if a person wrote it, use their verified name and identifying author/bio URL. Do not invent identities. Google supports Person or Organization author markup.
- One social preview used the branded fallback. That is an intentional social fallback, but article structured-data imagery should represent the article rather than a logo. Article JSON-LD currently builds image URLs separately from the social-image sanitizer, which can also cause inconsistency. Use a verified relevant image when available; do not substitute unrelated assets.
- Source maps publication dates to date-only values, then schema converts them to midnight UTC. Preserve the actual publication timestamp if accurate date/time markup is desired.
- Publisher `/logo.png` returned HTTP 200 image/png. Four sampled external image requests failed in this environment without an HTTP response; their accessibility and relevance remain unverified, not proven broken. All 30 metadata image URLs were present.
- JSON-LD currently serializes directly into a script without escaping `<`. This is a source hardening opportunity for stored/untrusted article values; no exploit test was performed.

Evidence: `post-seo-live.json`, `post-seo-summary.json`, `post-seo-images.json`. No new build/type/lint run was needed because application code was not changed. Prior source verification does not replace a Google Rich Results Test, image inspection or Search Console URL Inspection for these pages.

## Initial/final 20-item checklist

No fixes were made; initial and final statuses are the same for this review.

| # | Check | Initial → final |
|---|---|---|
|1|Unique titles|Present/unique in 30; clipping quality issue remains.|
|2|Unique descriptions|Present/unique in 30; three very short and others clipped.|
|3|Social metadata|Present in 30; external-image accessibility/relevance unverified, author/schema improvements remain.|
|4|Robots|Post directives present in 30; existing utility exclusions unchanged.|
|5|Sitemap|Four original/self-canonical sampled posts included; external-canonical copies excluded.|
|6|Image alternatives|Full editorial/visual review not performed.|
|7|Analytics|Not retested; consent gate retained.|
|8|HTTPS/domain|30 `.tech` articles returned HTTP 200 over HTTPS.|
|9|Favicons|Not retested.|
|10|404|Not retested.|
|11|Contact|Existing contact retained; operator/address remain unconfirmed.|
|12|Privacy|Existing draft; not reviewed in this task.|
|13|Terms|Existing draft; not reviewed in this task.|
|14|Consent|Unchanged, not retested.|
|15|Main CTA|Unchanged, not retested.|
|16|Responsive|No UI changes; no new viewport audit.|
|17|Sticky CTA|Unchanged, not retested.|
|18|Pending states|Unchanged, not retested.|
|19|Validation|Metadata HTML and JSON parsed; rich-result eligibility not independently validated.|
|20|Success states|No form submissions; prior Google/Bing sitemap setup evidence remains separate from page indexing.|

Reference: https://developers.google.com/search/docs/appearance/structured-data/article
