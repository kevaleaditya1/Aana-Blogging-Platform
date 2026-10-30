# Automatic welcome mail — 30 October 2026

## Requested behavior and result

The owner requested welcome mail for newsletter signup and account sign-in through any method, then selected **first successful sign-in only** for account users.

- Newsletter signup now queues **“Welcome to Aana — confirm your newsletter subscription”** immediately through Unitpost. Its signed link expires after 24 hours. Delivery remains inactive until the reader opens the link and presses Confirm; a GET alone cannot subscribe them.
- Successful Google and email/password sign-ins use Auth.js's shared success event to queue **“Welcome to Aana”** once per account. A queued timestamp/provider ID is persisted on the User. The task runs after the auth response; mail errors do not reject sign-in and an unqueued welcome can retry on a later successful sign-in.
- Repeat newsletter requests reuse the pending welcome/link. Repeat sign-ins, including switching login providers for the same account, do not send another account welcome. Account login does not create a newsletter subscription.
- The sender stays `news@aanaa.tech`; Reply-To and public support stay `contact@aanaa.tech`. Tracking stays disabled in email.
- The newsletter request has a pending success page. A successful confirmation goes to `/success/newsletter-confirmed` without email/token query data. Conversions are recorded only on a newly confirmed operation, not request/page visits/replays.
- Unsubscribe clears pending confirmation state. Old confirmation links cannot reactivate a cancelled subscription. Explicit resubscription starts a new confirmation request.

Existing accounts have no historical welcome marker, so they can receive one welcome on their next successful sign-in after deployment. No bulk welcome was sent or automatically backfilled.

## Database and files

`prisma/sql/newsletter-onboarding.sql` adds six nullable columns without deleting data. It has been applied to the configured database; all six columns were read back from the schema. Prisma's client was regenerated. The existing project has no migration baseline, so this is a tracked, idempotent additive SQL script rather than a reset or an unrelated schema push.

- `User`: `welcomeEmailQueuedAt`, `welcomeEmailId`.
- `NewsletterSubscriber`: confirmation version, expiration, provider acceptance timestamp and message ID.

Core logic: `lib/email/welcome.ts`, `lib/email/confirmation.ts`, `lib/auth.ts`, newsletter subscribe/confirm/unsubscribe handlers, and `components/newsletter-confirmation.tsx`. The obsolete Resend newsletter welcome helper has been replaced by exports of the Unitpost onboarding functions. Middleware/auth run on Node.js to support Prisma and signing safely.

Stable idempotency keys protect concurrent sends/retries; Unitpost documents a 24-hour replay window. A persistent queued marker prevents subsequent ordinary sign-ins from resending after that window. If a provider accepts a message but the database cannot persist that acceptance, inspect provider history before manually retrying older attempts; this is not a claim of distributed exactly-once delivery.

## Verification

- 30 stateful mocked service/auth checks: initial newsletter welcome, inactive-until-confirmed, duplicate requests, invalid/expired tokens, confirmation replay, cancel/resubscribe, concurrent cancellation, provider failures/retries, password/Google sign-in hooks, repeat/cross-provider sign-ins, concurrent first welcomes and no marketing opt-in from login.
- 23 existing mocked Unitpost delivery/unsubscribe checks pass.
- Browser tests cover pending signup feedback, dedicated success URLs, non-mutating confirmation GET, noindex, invalid-token rejection by the real handler, four viewport widths and mocked confirmation pending/error/success. No real subscription or email was created by automated tests.
- Production build, TypeScript and targeted ESLint pass. `audit/welcome-build-final.log`, `welcome-typecheck.txt`, `welcome-lint.txt`, `welcome-flow-tests.json`, `welcome-browser-tests.json` and `welcome-schema-check.json` retain evidence.
- A Windows engine lock required briefly restarting the existing development server; it was restored on port 3000. The production preview on port 3200 serves the new build.

Real Google OAuth, a real password login and a newly emailed production confirmation round trip still require owner verification. The earlier Unitpost connection test proved sender-domain verification and delivery of a test message; it does not substitute for this new flow's production checks.

## 20-item checklist delta

The full earlier baseline is in `quality-baseline.md`. At the start of this request, newsletter signup stored addresses without emailing them; account sign-in had no welcome hook. The status below rechecks the effect of this change and preserves unresolved full-site limitations from `quality-final.md`.

| # | Requirement | Final status for this change |
|---|---|---|
|01|Titles|Pass: confirmation/success routes have private metadata; public titles unchanged.|
|02|Descriptions|Pass: public descriptions unchanged; utility pages noindex.|
|03|Sharing|Unchanged: existing original article imagery/default site previews retained.|
|04|Robots|Pass: confirmation routes added to crawl exclusions; POST tokens protect operations independently.|
|05|Sitemap|Pass: confirmation/success utilities remain excluded.|
|06|Image alternatives|Unverified full editorial review remains; no meaningful content image added.|
|07|Analytics|Confirmation event moves to newly confirmed POST success; live GA remains unverified.|
|08|Domain/HTTPS|Prior live result retained; new production routes await deployment.|
|09|Favicons|Unchanged from prior passing asset checks.|
|10|404|Unchanged from prior passing route checks.|
|11|Contact|Confirmed contact/sender retained; operator/address details remain unresolved.|
|12|Privacy|Draft updated for pending/verified state, queue timestamps and one-time account welcome; business review remains.|
|13|Terms|Existing draft retained; business/legal review remains.|
|14|Consent|Confirmation token routes excluded from analytics; existing opt-in controls retained.|
|15|Main CTA|Homepage action unchanged.|
|16|Responsive|New confirmation route checked at 320/390/768/1440 px; full authenticated/device review remains.|
|17|Sticky CTA|Homepage-only behavior retained; no confirmation overlap introduced.|
|18|Pending|New request/confirmation expose busy states and prevent duplicate actions; login does not wait for mail.|
|19|Validation|Typed/expired/tampered/replayed/cancelled tokens and provider failures covered; live OAuth/inbox behavior remains unverified.|
|20|Success|Pending and confirmed newsletter states have separate noindex URLs; no personal data in success URLs or conversions from refresh.|

## Activation on the live site

1. Review, commit and deploy these source changes. They have not been pushed or deployed by this request.
2. Keep `UNITPOST_API_KEY`, `NEWSLETTER_FROM="Aana <news@aanaa.tech>"` and the same `NEWSLETTER_UNSUBSCRIBE_SECRET` configured privately on Vercel. The signed confirmation/cancellation URLs use the production origin `https://aanaa.blog`.
3. If production uses a different database from the one configured locally, apply `prisma/sql/newsletter-onboarding.sql` there before deployment, with the intended `DATABASE_URL` supplied privately. Do not run a database reset. The normal postinstall regenerates Prisma's client.
4. Submit your own newsletter address on production, receive the welcome, confirm it, verify active/verified state, then check unsubscribe and resubscribe. Confirm that merely opening links does not activate subscriptions and cancelled links fail.
5. Sign in once using Google and once using email/password with owner-controlled test accounts. Confirm one account welcome per account, none on failed attempts, and none on subsequent logins. Check Unitpost delivery events rather than treating queued acceptance as delivery.
6. Keep `NEWSLETTER_CAMPAIGNS_ENABLED=false` until production opt-in/unsubscribe checks pass. Welcome/confirmation messages work independently of that broadcast gate; enabling weekly bulk mail is a separate operational step.

References: [Auth.js event configuration](https://authjs.dev/reference/core#events), [Next.js after-response tasks](https://nextjs.org/docs/app/api-reference/functions/after), [Unitpost delivery/idempotency API](https://www.unitpost.com/docs/email).
