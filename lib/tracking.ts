export type ConsentChoice = "accepted" | "rejected";
export const CONSENT_KEY = "aana-consent-v1";
export function hasConsent() {
    try { return localStorage.getItem(CONSENT_KEY) === "accepted"; } catch { return false; }
}
type Gtag = (...args: unknown[]) => void;
export function trackEvent(name: "explore_articles" | "contact_success" | "newsletter_success" | "signup_success") {
    if (!hasConsent() || process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true") return;
    // Only fixed event names: never send form fields, email, names, tokens or search queries.
    const target = window as Window & { gtag?: Gtag; aanaPendingEvents?: string[] };
    if (target.gtag) target.gtag("event", name, { page_location: "https://aanaa.blog", page_referrer: "" });
    else (target.aanaPendingEvents ||= []).push(name);
}
