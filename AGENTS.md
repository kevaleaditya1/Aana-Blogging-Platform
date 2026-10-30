# Website quality rules

Preserve Aana's existing design, approved brand assets and working features. Production canonical origin is `https://aanaa.blog`; public contact is `contact.aanaa.blog@gmail.com`. Do not invent operator details, addresses, testimonials, prices, refund promises, retention periods or compliance claims.

For future changes, maintain these checks:

1. Every public indexable route, including dynamic content, needs a unique descriptive title under 60 characters and description under 155 characters.
2. Shareable pages need absolute canonical/Open Graph/Twitter URLs and real images; retain the branded 1200 × 630 default.
3. Keep robots and automatically generated sitemap aligned with published, canonical, indexable content. Exclude private, utility, error and redirect URLs. Robots is not authorization.
4. Inspect meaningful imagery before writing alt descriptions; use empty alternatives for decorative thumbnails that repeat adjacent text. Functional images need accessible names.
5. Keep tracking opt-in. Respect acceptance, rejection and withdrawal; preserve footer preferences and essential functionality. Never send form fields, personal data, search queries or reset tokens to analytics. Record conversions only after confirmed operations, never success-page views.
6. Retain HTTPS/canonical redirects, branded favicon/Apple/Android icons and manifest, and an HTTP-404 recovery page.
7. Keep verified contact details actionable in footer/contact page. Flag missing operator/address information. Privacy and terms must reflect actual processing and remain drafts until owner/appropriate review.
8. Homepage primary CTA must work above the fold at mobile and desktop widths. Keep the mobile action clear of consent, footer, safe areas and keyboard. Test 320, 390, 768 and 1440 px layouts, long text, navigation and forms.
9. Async actions need accessible busy/error states and duplicate prevention. Validate forms on client and server; associate field errors, preserve values and focus the first error. Never claim success after a provider error.
10. Confirmed contact, newsletter and email signup operations use dedicated noindex success URLs without personal query parameters. Utility actions such as login, password reset, search and comments can use accessible inline feedback.
11. Authenticate and authorize private data and API writes independently of UI and crawling directives.

Before completion, record an initial and final 20-item checklist (see `audit/quality-baseline.md`), run appropriate type/build/lint checks and browser/functional checks, and distinguish source inspection, automated tests, mocked integrations, local browser results and live production evidence. Reports must identify failed checks, missing owner details, unavailable credentials, external setup and unverified behavior. Do not claim completion or live deployment while required items remain unresolved. Do not submit real forms/send emails/create accounts merely to test without authorization.

Advertising and newsletter campaigns are disabled until consent/opt-in/unsubscribe configuration is verified. Analytics additionally requires `NEXT_PUBLIC_ANALYTICS_ENABLED=true` after the GA account settings review described in the quality audit; consent remains mandatory. Do not bypass these gates to improve a score.
