# Microsoft Clarity — 3 November 2026

Requested project: `z7kfshhcq0`. The public tracking ID is stored in `lib/clarity.ts`; no private API key or environment-file change is needed. The supplied asynchronous loader is installed through the existing privacy controls rather than globally before consent.

## Behavior

- Requires both `NEXT_PUBLIC_ANALYTICS_ENABLED=true` and a visitor's current analytics acceptance. The existing global analytics/provider-review gate remains intact; production settings were not changed.
- Uses Consent V2 with analytics storage granted and advertising storage denied. No custom user identifiers or extra conversion events are sent.
- The existing Content Security Policy now permits the HTTPS Clarity script/collector hosts and the documented Bing connection endpoint. Other source restrictions remain in place.
- Explicitly masks body content using `data-clarity-mask="true"`. This includes forms, comments, chatbot and account-dependent visible text. Heatmaps/recordings are masked; masking does not imply anonymous processing.
- Does not initialize on private/authentication, search, contact, success, confirmation or unsubscribe pages, or URLs containing query strings/fragments. It also refuses unsafe referrer URLs.
- Stops recording before private/query navigation and finishes those transitions in a new document. Public-to-public navigation retains the existing application behavior. History and event guards are removed during cleanup. Recorders cannot merely be hidden/unmounted while left running on private pages.
- Withdrawal denies Clarity consent, stops collection, clears accessible `_clck`/`_clsk` cookies and reloads via the existing consent flow. Third-party cookies cannot be removed by this site.
- New consent key `aana-consent-v2` re-prompts visitors who accepted the older notice before session recordings were disclosed. A previous rejection migrates to the new key without enabling analytics.
- The banner and draft privacy policy now disclose Clarity heatmaps, masked session recordings and Microsoft processing. Operator/address, retention and final policy review remain unresolved owner decisions.

## Verification and activation

17 local URL/project checks pass; TypeScript and targeted ESLint pass. Browser checks mock the Clarity SDK and block all external analytics, so no actual Microsoft session recordings are created by testing. The test build explicitly enables analytics only in its shell process; no local environment files or Vercel settings are edited. Final build/browser results are appended below.

Deploy the source. For production activation, retain the project rule requiring provider settings review before setting `NEXT_PUBLIC_ANALYTICS_ENABLED=true`, and redeploy after changing this public build-time variable. Review Clarity cookie-consent/masking settings, the actual intended audience and account access. The gate also controls existing GA, so do not enable it without the existing GA settings review. Confirm recording reception in the owner's Clarity dashboard after a consented production visit; no live reception is claimed here.

## Initial/final 20-item checklist

| # | Check | Initial → final |
|---|---|---|
|1|Titles|Unchanged.|
|2|Descriptions|Unchanged.|
|3|Social/schema|Unchanged.|
|4|Robots|Existing exclusions unchanged; Clarity has its own stricter recording exclusions.|
|5|Sitemap|Unchanged.|
|6|Images/alternatives|No imagery or alt changes.|
|7|Analytics|Clarity absent → consent-controlled loader with existing enable gate; dashboard receipt unverified.|
|8|HTTPS/domain|Clarity script uses HTTPS; cookie cleanup targets `.aanaa.tech`.|
|9|Favicons|Unchanged.|
|10|404|Unchanged.|
|11|Contact|Existing contact retained; operator/address remain unresolved.|
|12|Privacy|Draft expanded to disclose recording and provider; owner review remains.|
|13|Terms|Existing draft retained.|
|14|Consent|New purpose disclosed, prior acceptance refreshed, rejection respected, withdrawal implemented.|
|15|Main CTA|No change.|
|16|Responsive|Consent copy changed; four viewport checks included in browser verification.|
|17|Sticky CTA|Existing consent/CTA coordination retained.|
|18|Pending|No form-submission behavior changed.|
|19|Validation|URL exclusions and mocked SDK behavior checked; no real accounts/forms/emails created.|
|20|Success|No new conversion events or page-view conversions; success routes excluded.|

References: [Consent V2](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2), [masking](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking), [Microsoft client API source types](https://github.com/microsoft/clarity/blob/master/packages/clarity-js/types/index.d.ts).

## Functional verification result

Passed 27 local development-browser checks with a mocked SDK and all external requests blocked, plus 17 URL/project checks. Verified no initialization before acceptance or on excluded URLs, explicit analytics-only consent, masked body, old-choice migration, withdrawal/cookie cleanup, private-link and programmatic-search navigation, and consent layout at 320/390/768/1440 px. Evidence: `clarity-browser.json`, `clarity-browser.log`, `clarity-url-checks.json`. The temporary analytics-enabled preview on port 3202 was stopped after testing; other servers were left running. No live Clarity receipt is claimed.

Final production build retry passed, generating 408 pages (`clarity-build-retry.log`). The earlier final-build attempt failed with database connectivity P1001; the successful retry resolves that build check. Source deployment, the production enable flag, provider-account review and dashboard receipt remain owner actions/unverified.
