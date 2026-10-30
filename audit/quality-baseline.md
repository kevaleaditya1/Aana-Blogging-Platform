# Initial 20-point audit — 30 October 2026

Baseline: local source inspection plus the earlier live homepage Lighthouse and HTTP audit. No application changes from this request had been made when this table was recorded. Pass means the stated scope was observed; unknown integrations remain unverified.

| # | Requirement | Initial status | Evidence | Required action |
|---|---|---|---|---|
|01|Unique titles|Fail|Category titles duplicated; client routes inherit homepage title|Shared metadata helpers and route metadata|
|02|Unique descriptions|Fail|Several public routes inherit root description|Explicit route descriptions with length limits|
|03|Social previews|Fail|No default share image; article canonical missing|Branded image, absolute URLs, route metadata|
|04|robots.txt|Fail|Only admin/API excluded; localhost fallback|Production origin and private/utility exclusions|
|05|Sitemap|Fail|Newsletter 404 listed; public archives missing; hardcoded categories|Generate from public routes and eligible posts/categories|
|06|Image alternatives|Unverified|Card titles used as image descriptions; broken fallback|Decorative card alt, meaningful image review, fallback asset|
|07|Analytics|Fail|GA/Vercel run without consent; conversion events absent|Opt-in loading and non-personal events; live account verification|
|08|Domain/HTTPS|Pass|Live www 308 to apex HTTPS, apex 200; HSTS present|Recheck production; deployment settings remain owner-controlled|
|09|Favicons|Fail|Logo/Apple icon added earlier; Android manifest missing|192/512 icons and manifest|
|10|Custom 404|Fail|No app/not-found.tsx|Branded recovery navigation and HTTP check|
|11|Real contact details|Fail|Contact email exists; footer lacks it; no verified business address/operator|Reuse published email; request operator/address|
|12|Privacy|Fail|Incomplete processor/storage inventory; unsupported anonymity wording|Plain-language draft with unresolved decisions|
|13|Terms|Fail|Unconfirmed blanket liability and product promises|Draft tied to actual service; remove unverified offers|
|14|Consent|Fail|AdSense/GA/Vercel mount globally; no preferences|Accessible opt-in, equal reject, persisted choice, withdrawal|
|15|Above-fold CTA|Unverified|Explore Articles exists; earlier screenshot shows it|Check representative viewports and destination|
|16|Responsive layouts|Unverified|Mobile menu unnamed, tight tablet header, long content|Browser matrix, focus/target/overflow fixes|
|17|Sticky mobile CTA|Fail|Missing|Article-browsing action with safe-area and consent/keyboard coordination|
|18|Pending states|Fail|Inconsistent busy states and error feedback|Reusable form states, duplicate prevention|
|19|Validation/errors|Fail|Weak email checks; APIs trust types; Resend errors ignored|Shared client/server validation and field-associated messages|
|20|Success pages|Fail|Inline contact/newsletter success; signup goes home|Noindex dedicated pages; confirmed-operation-only conversion events|

Additional trust issue: smartphone product page contains placeholder checkout, unverified testimonials, pricing, refunds and sales counts. Replace with an honest unavailable state until an owner-approved offer exists. Profile pages expose reading lists without checking ownership; protect them rather than relying on robots.
