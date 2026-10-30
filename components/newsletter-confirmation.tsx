"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/tracking";
import { useRouter } from "next/navigation";
export function NewsletterConfirmation({ token }: { token: string }) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");
    const inFlight = useRef(false);
    const submit = async (event: React.FormEvent) => {
        event.preventDefault(); if (inFlight.current) return;
        inFlight.current = true; setPending(true); setError("");
        try {
            const response = await fetch("/api/newsletter/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
            const result = await response.json().catch(() => ({}));
            if (!response.ok || !result.success) { setError(result.error || "Couldn’t confirm. Please try again."); return; }
            if (result.newlyConfirmed) trackEvent("newsletter_success");
            try { sessionStorage.setItem("aana-success-newsletter-confirmed", "confirmed"); } catch { /* The success page will explain when local proof is unavailable. */ }
            setDone(true);
            router.push("/success/newsletter-confirmed");
        } catch { setError("Couldn’t connect. Please try again."); }
        finally { setPending(false); inFlight.current = false; }
    };
    return <div className="mx-auto max-w-xl space-y-6 px-4 py-16">
        <h1 className="text-3xl font-bold">{done ? "You’re subscribed" : "Confirm your newsletter subscription"}</h1>
        {done ? <p role="status">Your email address is verified. You can now receive Aana newsletters, and each email includes an unsubscribe link.</p> : <form onSubmit={submit} aria-busy={pending} className="space-y-4">
            <p>Confirm that you asked to receive Aana’s technology newsletter. Opening this page does not subscribe you.</p>
            {error && <p role="alert">{error}</p>}
            <Button type="submit" disabled={pending}>{pending ? "Confirming…" : "Confirm my subscription"}</Button>
        </form>}
        <Link href="/" className="inline-flex min-h-11 items-center underline">Back to Aana</Link>
    </div>;
}
