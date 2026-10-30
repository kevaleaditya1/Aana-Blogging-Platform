# Push-protection repair — 30 October 2026

GitHub rejected the outgoing `5adafdc` commit because `.env` contained a Resend API key. The branch was two commits ahead of `origin/master`; the preceding unpublished commit only removed `.env.local`.

The repair removes `.env` and `VERCEL_ENV.txt` from the latest outgoing commit, keeps local copies, and strengthens ignore rules for `.env.*` while allowing the placeholder-only `.env.example`. The previous `.env.local` removal remains intact. No credential values are included in this report.

Only the unpublished tip is amended. Existing remote history is not rewritten, and push protection is not bypassed. Removing a file from a new commit does not remove its content from older published commits or rotate credentials.

## Required credential rotation

A values-only local scan (with values never printed) found these currently configured credentials in existing `origin/master` history:

- Resend API key
- Cloudinary API key/secret
- Database connection credentials
- Google OAuth client secret
- Gemini, Groq and Pexels API keys
- NextAuth secret
- Cron secret

See `credential-rotation-needed.json` for variable names and file paths only. Rotate these with their providers, update private local and production environment variables, and revoke old credentials. Rotating the authentication secret will invalidate existing sessions; coordinate that change. The currently configured Unitpost key and newsletter unsubscribe secret did not match this scan of the remote tree.

For a full repository-history purge, plan a separate history rewrite with collaborators after rotation. This repair deliberately avoids force-pushing or rewriting already published commits. Local reflogs may still retain the original unpublished tip; do not publish that old commit or backup refs.

Ensure production secrets are configured privately in the hosting platform rather than relying on committed environment files.
