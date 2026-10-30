"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { CONSENT_KEY, type ConsentChoice, trackEvent } from "@/lib/tracking";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PrivacyContext = createContext({ accepted: false, preferencesOpen: false, openPreferences: () => {} });
export const usePrivacy = () => useContext(PrivacyContext);

export function PrivacyControls({ children }: { children: React.ReactNode }) {
    const [choice, setChoice] = useState<ConsentChoice | null>(null);
    const [open, setOpen] = useState(false);
    const [ready, setReady] = useState(false);
    const [storageError, setStorageError] = useState(false);
    const heading = useRef<HTMLHeadingElement>(null);
    const opener = useRef<HTMLElement | null>(null);
    const pathname = usePathname();
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    const validGaId = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true" && gaId && /^G-[A-Z0-9]+$/.test(gaId) ? gaId : null;
    // Sensitive account/reset/profile routes must never reach analytics.
    const publicRoute = !/^\/(admin|api|login|signup|forgot-password|reset-password|profile|saved|bookmarks|search)(\/|$)/.test(pathname);

    useEffect(() => {
        const hydrate = window.setTimeout(() => {
        try {
            const value = localStorage.getItem(CONSENT_KEY);
            if (value === "accepted" || value === "rejected") setChoice(value);
            else setOpen(true);
        } catch { setOpen(true); }
        setReady(true);
        }, 0);
        const sync = (event: StorageEvent) => {
            if (event.key === CONSENT_KEY) window.location.reload();
        };
        window.addEventListener("storage", sync);
        return () => { window.clearTimeout(hydrate); window.removeEventListener("storage", sync); };
    }, []);

    useEffect(() => { if (open && choice) heading.current?.focus(); }, [open, choice]);
    useEffect(() => {
        const click = (event: MouseEvent) => {
            if ((event.target as Element).closest('a[href="/blog"]')) trackEvent("explore_articles");
        };
        document.addEventListener("click", click);
        return () => document.removeEventListener("click", click);
    }, []);

    const save = (next: ConsentChoice) => {
        let persisted = false;
        try { localStorage.setItem(CONSENT_KEY, next); setStorageError(false); persisted = true; }
        catch { setStorageError(true); }
        if (next === "rejected") {
            (window as Window & { aanaPendingEvents?: string[] }).aanaPendingEvents = [];
            // Stop future collection immediately, then reload to unload third-party scripts/iframes.
            const analyticsWindow = window as unknown as Window & { gtag?: (...args: unknown[]) => void; [key: `ga-disable-${string}`]: boolean };
            if (validGaId) analyticsWindow[`ga-disable-${validGaId}`] = true;
            analyticsWindow.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
            for (const cookie of document.cookie.split(";")) {
                const name = cookie.split("=")[0].trim();
                if (/^(_ga|_gid|_gat|_gcl|__gads|__gpi)/.test(name)) {
                    for (const domain of ["", location.hostname, ".aanaa.blog"]) document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ""} SameSite=Lax`;
                }
            }
        }
        const withdrawing = choice === "accepted" && next === "rejected";
        setChoice(next); setOpen(false); opener.current?.focus();
        if (withdrawing && persisted) window.location.reload();
    };

    return <PrivacyContext.Provider value={{ accepted: ready && choice === "accepted" && publicRoute, preferencesOpen: open, openPreferences: () => { opener.current = document.activeElement as HTMLElement; setOpen(true); } }}>
        {children}
        {ready && choice === "accepted" && publicRoute && validGaId && <>
            <Script id="aana-ga-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};window['ga-disable-${validGaId}']=false;gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});gtag('js',new Date());gtag('config','${validGaId}',{send_page_view:false,page_location:'https://aanaa.blog',page_referrer:'',allow_google_signals:false,allow_ad_personalization_signals:false});(window.aanaPendingEvents||[]).forEach(function(name){gtag('event',name,{page_location:'https://aanaa.blog',page_referrer:''})});window.aanaPendingEvents=[];`}</Script>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${validGaId}`} strategy="afterInteractive" />
            <PageView pathname={pathname} />
        </>}
        {open && <section aria-labelledby="privacy-heading" className="fixed inset-x-0 bottom-0 z-[100] max-h-[70dvh] overflow-y-auto border-t bg-background p-4 shadow-2xl pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                    <h2 id="privacy-heading" ref={heading} tabIndex={-1} className="font-semibold">Your privacy choices</h2>
                    <p className="mt-1 text-sm">Essential storage keeps sign-in, theme and privacy preferences working. Optional analytics helps us understand page visits and completed actions. Advertising stays disabled until its separate consent setup is complete. <Link href="/privacy" className="underline">Read the draft privacy policy</Link>.</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                    <Button variant="outline" onClick={() => save("rejected")}>Reject optional</Button>
                    <Button variant="outline" onClick={() => save("accepted")}>Accept analytics</Button>
                    {choice && <Button variant="ghost" onClick={() => { setOpen(false); opener.current?.focus(); }}>Close</Button>}
                </div>
            </div>
        </section>}
        {storageError && <p role="status" className="relative z-10 p-3 text-sm">Your browser could not save the privacy preference. It applies only to this visit.</p>}
    </PrivacyContext.Provider>;
}

function PageView({ pathname }: { pathname: string }) {
    useEffect(() => {
        const target = window as Window & { gtag?: (...args: unknown[]) => void };
        // A fixed allowlisted path excludes query strings, fragments and form values.
        const timer = setTimeout(() => target.gtag?.("event", "page_view", { page_location: `https://aanaa.blog${pathname}`, page_title: document.title }), 0);
        return () => clearTimeout(timer);
    }, [pathname]);
    return null;
}

export function CookiePreferencesButton() {
    const { openPreferences } = usePrivacy();
    return <button type="button" onClick={openPreferences} className="min-h-11 text-left text-sm underline underline-offset-4">Cookie preferences</button>;
}
