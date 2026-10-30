# Original article image repair — 30 October 2026

The owner requested original post images instead of the Aana fallback graphic.

## Results

- Inspected 204 published posts. Initially, 87 used a default-cover path; another original image failed its response check.
- Restored 80 verified original image URLs: 79 former placeholder covers and one broken existing cover. Updated matching news records where they still held the old/missing URL.
- Removed the broken placeholder URL from 8 remaining posts. Their publishers blocked article access or did not expose a usable original image; no substitute stock image, author portrait or Aana logo was invented.
- The live homepage HTML contains the restored featured ESPN image and no old default-cover references. The database URL repairs have taken effect independently of code deployment.
- All 11 rendered homepage cover images loaded in the local production browser. No rendered post cover used the Aana social/logo fallback. The featured article's sharing metadata now uses its original source image.

Previous URLs and verified replacements are retained in `image-repair-plan.json` and `image-repair-applied.json`. The eight cleared placeholder records and their source links are retained in `image-unresolved-cleared.json`. Updates compared the previous URL before writing, so concurrently edited covers were not overwritten. All 80 planned repairs were applied; none was skipped.

## Code changes

- `lib/article-images.ts` normalizes encoded image URLs, extracts original images from HTML/Markdown/media metadata and limits server-side source lookups to known HTTPS publishers.
- `lib/posts.ts` leaves missing covers empty; it no longer substitutes the Aana social graphic. The blog listing checks for a nonempty image URL before rendering an image.
- RSS import now reads `media:content`, `media:thumbnail` and full `content:encoded`, including single-quoted/encoded image attributes. Audio enclosures are not treated as images.
- Scheduled publishing and the old-post updater recover covers from the matching content/source; they do not use unrelated keyword-search images as a substitute.
- Article social/schema metadata uses the original cover when available. The automatically generated Aana article-preview route was removed; the site's branded default remains available only as share metadata for pages without an image.
- Static build concurrency is limited to two workers to reduce hosted database connection pressure. Database read failures now propagate instead of being represented as missing articles and cached as false 404s.
- `AGENTS.md` records the rule against substituting branding for missing article covers.

## Verification and limits

Eleven extraction/normalization/source-fetch safety assertions passed. TypeScript checking passed and targeted lint reported zero errors (existing warnings remain). Browser results are in `restored-image-check.json`; desktop/mobile screenshots are in `restored-home-desktop.png` and `restored-home-mobile.png`.

The first image build completed but logged temporary database read failures. A fresh isolated build with two workers passed without those errors; its output is recorded in `image-build-verified.log`. The local preview on port 3200 now serves that clean build.

The prior 20-item baseline and final quality checklist remain in `quality-baseline.md` and `quality-final.md`. Requirement 03 now uses original article imagery instead of generated branded article cards. Requirement 06's full editorial alt-text review and the other owner/integration/device limitations remain open; this change does not claim full site sign-off.

These code changes have not been pushed or deployed. The 80 database cover repairs and eight placeholder removals were authorized by this request and applied to the configured database. Publishers can later move or restrict an image, so reachability is evidence from this run rather than a permanent guarantee.

For the remaining eight covers, provide an approved original image or an accessible original-source image URL. Until then, those posts remain without a cover rather than showing the Aana graphic.
