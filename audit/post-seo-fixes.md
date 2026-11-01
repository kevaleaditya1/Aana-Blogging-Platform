# Post SEO fixes — 1 November 2026

Scope: improve every published post's generated search title/description, retain one primary H1, and identify Aana as an organization author. The initial live sample and source findings are recorded in `post-seo-review.md`.

## Changes

- `lib/post-seo.ts` derives metadata from existing post text, preserving suitable custom metadata. Long titles use an introductory clause where suitable or whole-word shortening with an ellipsis. Old custom titles that were only truncated prefixes are regenerated from the full article title. The existing visible article titles, slugs and URLs are unchanged.
- Descriptions prefer meaningful existing metadata/excerpts and fall back to article paragraphs when short captions or boilerplate are unsuitable. Markdown/image syntax is removed. Longer original paragraphs recover already-cut excerpt prefixes when available; otherwise an uncertain final token in a long unfinished excerpt is omitted. No article facts or author identities are invented.
- All published posts use this shared helper for HTML, Open Graph and Twitter metadata; Article schema uses the same description. Existing source canonicals and noindex settings remain intact.
- The article template retains its main H1 and renders Markdown H1s as H2s. Stored content is not rewritten. This applies to current and future posts through the shared route.
- Aana and its editorial/team variants use Organization author markup. Real named authors retain Person markup without an invented homepage profile. JSON-LD now escapes `<` before embedding in script elements.

No database edits, deployment, email, real form submissions or analytics/advertising changes were performed. The fix becomes public after source deployment; search engines will need to recrawl it.

## Verification

`scripts/check-post-seo.cjs` evaluated **all 254 published posts** through a read-only database query: no duplicate generated titles/descriptions, no over-limit titles/descriptions and no description below 50 characters. Title content is at most 51 characters before the existing ` | Aana` suffix; descriptions at most 154. Fixtures cover tiny-excerpt fallback, author identity, canonical preservation and safe schema serialization. Evidence: `post-seo-all-posts.json`.

TypeScript passes. Targeted lint has zero errors and the existing Next.js warning for article-content `<img>` optimization. The first production build passed; a final rerun initially failed on the external Google Fonts fetch, and a database check experienced a transient closed connection. These external failures were retried rather than treated as application failures. Final build and local browser outcomes are recorded below after completion.

## Initial/final 20-item checklist

| # | Check | Initial → final |
|---|---|---|
|1|Titles|Mid-word clipping → word-aware titles; all 254 within limit and unique.|
|2|Descriptions|Three tiny summaries in live sample, clipping/boilerplate → article-prose fallbacks; all 254 within limit and unique.|
|3|Social/schema|Existing tags, Aana as Person → shared descriptions, Organization author, safe script embedding. Image availability review remains separate.|
|4|Robots|Existing directives → preserved.|
|5|Sitemap|Existing external-source exclusions → preserved.|
|6|Image alternatives|No image changes; full editorial review remains pending.|
|7|Analytics|No change; consent gate retained, no test conversions emitted.|
|8|HTTPS/domain|Existing `.tech` canonical helpers → preserved.|
|9|Favicons|No change.|
|10|404|No change.|
|11|Contact|Existing contact retained; operator/address still unconfirmed.|
|12|Privacy|Existing draft unchanged; owner review remains.|
|13|Terms|Existing draft unchanged; owner review remains.|
|14|Consent|No change; test browser rejects tracking.|
|15|Main CTA|No change.|
|16|Responsive|Shared heading rendering changes only; final browser results below.|
|17|Sticky CTA|No change.|
|18|Pending states|No form or asynchronous-flow changes.|
|19|Validation|Metadata fixtures/all-post checks pass; Google Rich Results Test not performed.|
|20|Success states|No form submissions; existing sitemap setup retained.|

This is automated, content-derived metadata improvement, not a claim of manual editorial rewriting of 254 articles or guaranteed search rankings. External-canonical syndicated copies may still rank under their original source.

## Final outcome

Final production build passed (308 generated pages). Browser assertions passed on four representative posts: HTTP 200, one H1, title/description equal to the audited values, and Organization author schema. Layout/visibility/overflow checks passed at 320, 390, 768 and 1440 px. Evidence: `post-seo-fix-build-final.log`, `post-seo-browser.json`, `post-seo-browser.log`, `post-seo-fixed-desktop.png`. TypeScript passed; targeted lint reported zero errors with one pre-existing image optimization warning. No live deployment was performed.
