# Production newsletter 503 investigation — 30 October 2026

Initial evidence: the owner observed POST `/api/newsletter/subscribe` returning 503 on production. The route swallowed all errors without logging, so its status alone cannot distinguish configuration, schema, database connectivity or provider errors. No root cause is established yet.

Local checks confirmed that the API key and sender are configured and the signing secret meets the length requirement. These checks do not establish Vercel Production configuration. A read-only external database/provider check was blocked by automatic approval review because its usage allowance was exhausted; it did not execute. No actual subscription or test email was submitted.

Changed the route to log allowlisted diagnostics only: missing sender/key configuration, missing signing secret, provider HTTP status, unreachable provider, invalid provider response, outdated Prisma schema or a Prisma error code. Unknown errors remain generic. Raw exception messages, emails, keys, connection strings and provider bodies are never logged or returned to the browser. The existing public 503 response remains accurate.

Deploy this diagnostics change, then inspect the failed request in Vercel project Logs for `[newsletter.subscribe]`:

| Code | Action |
|---|---|
| EMAIL_CONFIGURATION_MISSING | Configure Production `UNITPOST_API_KEY` and `NEWSLETTER_FROM` (`Aana <news@aanaa.tech>`), then redeploy. |
| NEWSLETTER_SIGNING_SECRET_MISSING | Copy the existing private `NEWSLETTER_UNSUBSCRIBE_SECRET` into Production, then redeploy. Preserve it to keep existing links valid. |
| EMAIL_PROVIDER_REJECTED | Inspect the logged HTTP status and Unitpost key permissions, sender verification and limits. |
| DATABASE_SCHEMA_OUTDATED | Apply the tracked additive `prisma/sql/newsletter-onboarding.sql` to the actual production database. Do not reset it. |
| DATABASE_ERROR | Inspect the safe Prisma code and production database availability. |
| EMAIL_PROVIDER_UNREACHABLE / EMAIL_PROVIDER_RESPONSE_INVALID | Inspect provider service health and delivery events before retrying. |
| NEWSLETTER_REQUEST_FAILED | Requires further investigation; do not infer provider acceptance or subscription activation. |

The 20-item initial/final checklist in `welcome-flow.md` still applies: items 18–19 now add safe server-side failure diagnostics; all other behavior and unresolved production checks remain unchanged. Local diagnostic/privacy cases, targeted lint and stateful mocked flow checks validate this small change. Production repair is pending the deployment and diagnosis above, not claimed complete.
