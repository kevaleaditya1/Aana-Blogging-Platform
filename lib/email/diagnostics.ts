// Return only allowlisted diagnostics. Never log error messages, provider bodies,
// Prisma queries, addresses, connection strings or credentials.
export function emailFailureDiagnostic(error: unknown) {
    const message = error instanceof Error ? error.message : "";
    if (message === "Configure UNITPOST_API_KEY and NEWSLETTER_FROM before sending newsletters.") return { code: "EMAIL_CONFIGURATION_MISSING" };
    if (message === "Newsletter signing secret is not configured.") return { code: "NEWSLETTER_SIGNING_SECRET_MISSING" };
    const providerStatus = /^Unitpost rejected the email \(HTTP (\d{3})\)\./.exec(message);
    if (providerStatus) return { code: "EMAIL_PROVIDER_REJECTED", providerStatus: Number(providerStatus[1]) };
    if (message === "Unitpost could not be reached. Retry using the same idempotency key.") return { code: "EMAIL_PROVIDER_UNREACHABLE" };
    if (message === "Unitpost did not confirm that this email was queued.") return { code: "EMAIL_PROVIDER_RESPONSE_INVALID" };
    const databaseCode = error && typeof error === "object" && "code" in error && typeof error.code === "string" && /^P\d{4}$/.test(error.code) ? error.code : undefined;
    if (databaseCode) return { code: databaseCode === "P2022" ? "DATABASE_SCHEMA_OUTDATED" : "DATABASE_ERROR", databaseCode };
    return { code: "NEWSLETTER_REQUEST_FAILED" };
}
