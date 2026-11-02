export const CLARITY_PROJECT_ID = "z7kfshhcq0";
type Clarity = ((...args: unknown[]) => void) & { q?: unknown[][] };
type ClarityWindow = Window & { clarity?: Clarity };

export function clarityURLAllowed(url: URL) {
    return !url.search && !url.hash && !/^\/(admin|api|login|signup|forgot-password|reset-password|profile|saved|bookmarks|search|success|contact|unsubscribe|newsletter\/confirm)(\/|$)/.test(url.pathname);
}

export function stopClarity() {
    const target = window as ClarityWindow;
    target.clarity?.("consentv2", { analytics_Storage: "denied", ad_Storage: "denied" });
    target.clarity?.("stop");
}

// Install only after analytics consent. Never initialize even cookieless
// recording on rejected, private, query-bearing or token-bearing URLs.
export function installClarity() {
    if (!clarityURLAllowed(new URL(location.href))) return;
    if (document.referrer) {
        try { if (!clarityURLAllowed(new URL(document.referrer))) return; }
        catch { return; }
    }
    const target = window as ClarityWindow;
    target.clarity ||= Object.assign((...args: unknown[]) => { target.clarity?.q?.push(args); }, { q: [] as unknown[][] });
    target.clarity("consentv2", { analytics_Storage: "granted", ad_Storage: "denied" });
    const script = document.createElement("script");
    script.id = "aana-clarity";
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;

    // Stop before a client router can expose a private URL or private DOM to
    // an already-running recorder. Finish that transition in a fresh document.
    const originalPush = history.pushState;
    const originalReplace = history.replaceState;
    function guard(original: History["pushState"]): History["pushState"] {
        return function (data, unused, url) {
            if (url && !clarityURLAllowed(new URL(String(url), location.href))) {
                stopClarity();
                location.assign(String(url));
                return;
            }
            original.call(history, data, unused, url);
        };
    }
    const guardedPush = guard(originalPush);
    const guardedReplace = guard(originalReplace);
    history.pushState = guardedPush;
    history.replaceState = guardedReplace;
    const changed = () => {
        if (!clarityURLAllowed(new URL(location.href))) {
            stopClarity();
            location.reload();
        }
    };
    const navigating = (event: MouseEvent) => {
        if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
        if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") return;
        const url = new URL(link.href, location.href);
        if (url.origin === location.origin && !clarityURLAllowed(url)) {
            stopClarity();
            event.preventDefault();
            event.stopImmediatePropagation();
            location.assign(url.href);
        }
    };
    document.addEventListener("click", navigating, true);
    window.addEventListener("popstate", changed, true);
    window.addEventListener("hashchange", changed, true);
    document.head.appendChild(script);
    return () => {
        stopClarity();
        script.remove();
        if (history.pushState === guardedPush) history.pushState = originalPush;
        if (history.replaceState === guardedReplace) history.replaceState = originalReplace;
        window.removeEventListener("popstate", changed, true);
        window.removeEventListener("hashchange", changed, true);
        document.removeEventListener("click", navigating, true);
    };
}
