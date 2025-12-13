// Analytics event tracking helpers

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}

export const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
) => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

// Specific event trackers
export const trackComment = (postSlug: string) => {
    trackEvent("comment_posted", "engagement", postSlug);
};

export const trackBookmark = (postSlug: string, action: "add" | "remove") => {
    trackEvent(`bookmark_${action}`, "engagement", postSlug);
};

export const trackShare = (platform: string, postSlug: string) => {
    trackEvent("share", "social", `${platform}_${postSlug}`);
};

export const trackSearch = (query: string) => {
    trackEvent("search", "engagement", query);
};

export const trackNewsletter = (email: string) => {
    trackEvent("newsletter_signup", "conversion", email);
};

export const trackContact = () => {
    trackEvent("contact_form", "conversion");
};
