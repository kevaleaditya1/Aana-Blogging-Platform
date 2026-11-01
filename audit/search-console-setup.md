# Search engine setup — 31 October 2026

Owner corrected the production domain to `https://aanaa.tech`, superseding older `.blog` instructions. Google Search Console showed Ownership verified and the `sc-domain:aanaa.tech` overview. Keep its verification DNS record in place. The initial `.blog` setup was left unverified.

Live browser evidence: `https://aanaa.tech/sitemap.xml` rendered XML, but all displayed locations pointed to `.blog`. A later live recheck after Bing connection still showed the old URLs. Sitemap submission was intentionally held pending deployment of the corrected origin.

The owner signed in to Bing, explicitly approved ongoing read-only Search Console/email access, and completed Google's connection flow themselves. Bing then showed the `aanaa.tech` property with working site-specific Home and Sitemaps routes. Its site selector displayed `aanaa.tech`; evidence is `bing-aanaa-tech-connected.png`. The sitemap table was empty. Google ownership and Bing property setup are confirmed; sitemap submission and indexing remain pending. No Clarity, advertising or extra tracking was enabled.

Source changes use `.tech` for central metadata, robots/sitemap, newsletter links, fixed analytics event locations, generated article canonicals and IndexNow. Old internal `.blog` article canonicals are normalized when rendering/filtering the sitemap; external-source canonicals remain unchanged. No database records, secrets or DNS records were edited. Production redirects and any Vercel OAuth/environment URLs still need review by the owner. The source changes have not been committed or deployed by this task.

Verification: five local domain/canonical assertions and TypeScript pass. Targeted lint covers site metadata, tracking, IndexNow and sitemap. No visual design changed; the live XML check is browser evidence, not verification of the new undeployed source. A new full production build and post-deployment checks remain pending.

## Initial/final 20-item checklist

| # | Check | Initial → final |
|---|---|---|
|1|Titles|Existing titles → unchanged.|
|2|Descriptions|Existing descriptions → unchanged.|
|3|Sharing/canonical URLs|Wrong domain → corrected in source; deployment pending.|
|4|Robots|Old sitemap domain → central origin corrected in source.|
|5|Sitemap|Live XML listed `.blog` → source corrected, not submitted yet.|
|6|Image alternatives|Unchanged; full editorial review remains pending.|
|7|Analytics|Old fixed domain → corrected; consent gate retained, live account unverified.|
|8|Domain/HTTPS|`.tech` ownership confirmed; redirects/live canonicals still need deployment review.|
|9|Favicons|Unchanged.|
|10|404|Unchanged.|
|11|Contact|`contact@aanaa.tech` retained; operator/address unknown.|
|12|Privacy|Existing draft retained; owner review remains.|
|13|Terms|Existing draft retained; owner review remains.|
|14|Consent|Unchanged; broadcasts/analytics gates retained.|
|15|Main CTA|Unchanged.|
|16|Responsive|No visual changes; previous results retained, not newly retested.|
|17|Sticky CTA|Unchanged.|
|18|Pending states|Existing behavior unchanged.|
|19|Validation|Existing behavior unchanged; five canonical/domain assertions pass.|
|20|Success states|Google ownership and Bing `.tech` property visibly confirmed; sitemap submission pending.|

Next: deploy corrected source; check live `.tech` sitemap/canonicals/robots; submit `https://aanaa.tech/sitemap.xml` in Google and Bing; inspect homepage/indexing. Google import permissions were approved explicitly and completed by the owner. Verification and sitemap submission do not guarantee indexing or traffic.

## Deployment and submission verified — 31 October 2026

The owner deployed the domain correction. Live browser XML and read-only public HTTP checks confirmed that `/sitemap.xml` returns HTTP 200, application/xml, 13 URLs and no old `.blog` origin. `/robots.txt` returns HTTP 200, allows public crawling and declares `https://aanaa.tech/sitemap.xml`. The HTTP diagnostic used a Googlebot user-agent string; this alone is not evidence of actual Google crawler access.

Submitted the sitemap once in Google Search Console and Bing Webmaster Tools. Google initially showed Could not fetch, then updated after processing to **Success**, type Sitemap, 13 discovered pages, last read 31 October 2026. Bing confirmed successful submission and currently shows **Processing**. Evidence: `google-sitemap-success.png`, `google-sitemap-submitted.png`, `bing-sitemap-submitted.png`. Both dashboard tabs were preserved for the owner.

Final checklist delta: canonical/sitemap domain correction is now observed live; Google ownership, Bing connection and both sitemap submissions are complete. Google has read the sitemap; Bing processing and actual page indexing/performance remain pending. This does not claim 13 pages are indexed. No additional code changes or real user-form submissions were made during the deployment check. Earlier pending-submission notes above describe the initial state and are superseded by this update.
