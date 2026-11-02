# Live site and posts — 1 November 2026

Read-only public HTTP inspection of 254 previously verified post URLs and seven public/recovery routes; desktop browser inspection of the homepage and a headphone review. No application or database changes, live form submissions, messages or emails. Optional tracking was rejected in the test browser. Full Lighthouse, mobile-device, authentication and provider delivery tests were not performed.

## Results

- All 254 post URLs returned HTTP 200. Each had one H1, unique title/description, one canonical, social-preview tags and Aana Organization article author markup. Titles were 31–58 characters, descriptions 66–154. The previous shared SEO fixes are deployed.
- Homepage, blog index, about, contact, privacy and terms returned HTTP 200. An invented path returned HTTP 404. Public contact remains `contact@aanaa.tech`; privacy/terms are explicitly marked draft.
- 250 posts have external source canonicals; four self-canonical posts remain. Those external canonicals are intentional for syndicated copies and must not be removed just to seek traffic. This check does not establish indexing, content ownership or permission to republish.
- The technical checks do not establish editorial quality. Some descriptions still use generic `Read [title] ... linked sources` text. Only 205 of 254 descriptions/titles exactly matched the earlier raw-database helper output: runtime post mapping inserts a generic excerpt for empty excerpts, which can be selected before article prose. Follow-up should make validation use the actual mapped post object and have the helper skip generated boilerplate.

## High-priority reader-facing findings

1. **Imported HTML renders as literal code.** The live headphone review shows `<article>`, `<div>`, `<p>`, `<table>` and image markup visibly as text. Browser screenshot: `live-post-raw-html.png`. This proves the issue on the sampled article, not every post. The route feeds imported HTML to ReactMarkdown without a sanitized HTML parsing pipeline. Fix by safely converting imported HTML to supported content or sanitizing before rendering; do not enable unrestricted HTML/script rendering. Body headings/images/tables currently do not appear as intended on this sample, despite its metadata passing.
2. **Homepage editorial focus is inconsistent.** It promises technology journalism but features household etiquette, sports, politics, celebrities and furniture coupons alongside tech. The featured story is about holiday houseguest habits. Filter incoming feeds for the intended tech categories and review homepage selection; do not delete or unpublish articles without owner authorization.
3. **Visible card excerpts are still clipped or generic.** Examples include `At 64, celebrity trainer` and `Between st`. Metadata improvements do not automatically fix the card excerpts returned by the listing mapper. A separate shared content-derived summary should improve cards and metadata consistently.
4. **Navigation/sidebar quality needs review.** On the sampled article, the table of contents includes tags, related articles and comments instead of only meaningful article sections; body HTML is not parsed into headings. Scope TOC extraction to the article body after fixing rendering.

Source/HTTP evidence: `site-live-recheck.json`. Browser evidence is a real deployed page, not a mocked integration or local preview. No speed score or traffic forecast was inferred from these checks.

## Initial/final 20-item checklist

No application fixes were made in this review; initial and final statuses are equal.

| # | Check | Initial → final |
|---|---|---|
|1|Titles|254 present, unique, within project limit.|
|2|Descriptions|254 present, unique, within limit; generic summaries still need improvement.|
|3|Sharing/schema|Present on 254; Organization author confirmed. Image accessibility/relevance not exhaustively retested.|
|4|Robots|Post directives inspected; no live robots change.|
|5|Sitemap|Previous submission evidence retained; canonical split is 250 external/four self-canonical. No new engine-dashboard check.|
|6|Imagery/alternatives|Sampled raw HTML prevents expected inline image rendering; critical follow-up.|
|7|Analytics|No live-account test or conversion; test browser rejected optional tracking.|
|8|HTTPS/domain|All checked article routes available on `.tech` HTTPS.|
|9|Favicons|Not exhaustively retested.|
|10|404|Invented URL returned HTTP 404.|
|11|Contact|Footer contact present; business/operator/address remain unresolved.|
|12|Privacy|Live draft; owner review remains.|
|13|Terms|Live draft; owner review remains.|
|14|Consent|Reject control worked in browser; no broader consent regression audit.|
|15|Main CTA|Visible desktop homepage action points to blog index; destination HTTP 200.|
|16|Responsive|Desktop inspected; no fresh mobile viewport audit or speed score.|
|17|Sticky CTA|Not newly tested.|
|18|Pending states|No real submissions made.|
|19|Validation|Public metadata/HTML checked; auth/forms/provider behavior not tested.|
|20|Success states|No live form tests; no new indexing or delivery claims.|
