# Unitpost newsletter setup — 30 October 2026

## Connection and configuration

The owner supplied `news@aanaa.tech` as the sender and saved the API key privately in `.env.local`. A read-only request to Unitpost returned HTTP 200 and reported `aanaa.tech` as **verified**. The key was not printed, placed in source, or committed. `.env.local` is ignored by Git and is not tracked.

The owner subsequently requested one live test to `news@aanaa.tech`. Unitpost accepted it and then reported **delivered**, with `email.delivered` at 16:45:53 India time on 30 October 2026. The test's message ID and provider delivery evidence are in `unitpost-test-result.json` and `unitpost-test-delivery.json`. No subscriber broadcast was sent. Provider delivery confirms mail-server acceptance, not that a human opened the inbox.

Newsletter delivery now uses Unitpost's official `POST https://www.unitpost.com/api/v1/email` endpoint, with bearer authentication, a User-Agent and a stable per-issue/per-recipient idempotency key. The sender is `Aana <news@aanaa.tech>`; Reply-To is the owner's existing public contact, `contact@aanaa.tech`. Contact/password email integrations remain on their existing provider.

Each recipient receives a separate message. API errors, missing accepted IDs/statuses and timeouts are not reported as successful sends. Responses and queue records distinguish provider acceptance from delivered mail. Open and click tracking are explicitly disabled. Email content is escaped and links are restricted to HTTPS.

## Unsubscribe and recipient safeguards

Every newsletter includes a signed, recipient-specific unsubscribe page and RFC 8058 one-click headers. Tokens contain an opaque subscriber identifier and an HMAC signature, not an email address. A GET opens a confirmation page without changing preferences; a signed POST updates both subscriber stores. Unsubscribe paths are noindex and excluded from analytics pageviews and the sitemap.

The newsletter sender and cron both require active subscribers with a non-null `verifiedAt`. No existing addresses were marked verified, enrolled, imported into Unitpost contacts or emailed by the implementation/tests.

**Broadcasts remain disabled** through `NEWSLETTER_CAMPAIGNS_ENABLED=false`. The current signup flow saves requests but does not yet complete address verification. Do not mark those requests verified or enable campaigns merely because the provider is connected. Complete an appropriate subscriber verification flow and test the production unsubscribe endpoint first.

## Production setup

In the Vercel project's Production environment, set:

| Variable | Value / action |
|---|---|
| `UNITPOST_API_KEY` | Copy the private key from your local configuration; never put it in chat or a `NEXT_PUBLIC_` variable. Prefer a Sending-scoped key for delivery. |
| `NEWSLETTER_FROM` | `Aana <news@aanaa.tech>` |
| `NEWSLETTER_UNSUBSCRIBE_SECRET` | Copy the generated local secret privately. Keep it stable so previously issued unsubscribe links keep working. |
| `NEWSLETTER_CAMPAIGNS_ENABLED` | Keep `false` until subscriber verification and production unsubscribe testing are complete. |
| `CRON_SECRET` | Retain a strong existing cron secret. |

Deploy the reviewed code before relying on links to `https://aanaa.blog/unsubscribe/...`. The sending domain is `aanaa.tech`; the existing website and unsubscribe origin remain `aanaa.blog`.

The existing Vercel cron schedule remains Sunday 09:00 UTC (14:30 India time). No new automation or schedule was created. Provider idempotency is documented for a 24-hour window; queue history and provider delivery events should be checked before manually retrying older issues.

## Verification

- `audit/unitpost-connection.json`: real read-only API connection and domain verification.
- `audit/unitpost-tests.json`: 23 mocked delivery/error, token, recipient privacy, content escaping and unsubscribe-store assertions; no real emails or subscription mutations.
- `audit/unitpost-typecheck.txt` and `audit/unitpost-lint.txt`: targeted type/lint checks.
- `audit/unitpost-build.log`: production build verification.
- `audit/unitpost-browser-results.json`: 12 passing browser checks covering non-mutating GETs, invalid signatures, noindex/no-tracking, four layout widths and mocked pending/failure/success states. No real subscription was changed.
- `audit/unitpost-secret-check.json`: 38 browser bundles checked; no configured key or unsubscribe secret value was exposed.
- `scripts/unitpost-status.cjs`: repeatable read-only connection check; Sending-only keys may lack domain-read capability.
- `scripts/unitpost-test.cjs`: prepares a fixed connection-test message. It will not send without both `--to` and `--send`. A real delivery test requires a chosen recipient and the owner's instruction to send it.

The previous 20-point checklist remains in `quality-final.md`; this change adds a verified provider connection and code for self-service unsubscribe. Live delivery, production deployment, address verification, policy/business details and other previously unresolved checks must not be represented as complete solely from this integration.

Official references: [Unitpost email API, domains, idempotency, tracking and custom unsubscribe headers](https://www.unitpost.com/docs/email), [Unitpost subscription topics](https://www.unitpost.com/docs/topics).
