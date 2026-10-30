"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL } from "@/lib/site";
export function UnsubscribeForm({ token }: { token: string }) {
    const inFlight = useRef(false);
    const [pending, setPending] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");
    const submit = async (event: React.FormEvent) => {
        event.preventDefault(); if (inFlight.current) return;
        inFlight.current = true; setPending(true); setError("");
        try {
            const response = await fetch("/api/newsletter/unsubscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
            const result = await response.json();
            if (!response.ok || !result.success) { setError(result.error || "Couldn’t update your preference."); return; }
            setDone(true);
        } catch { setError("Couldn’t connect. Please try again."); }
        finally { setPending(false); inFlight.current = false; }
    };
    return <div className="mx-auto max-w-xl space-y-6 px-4 py-16">
        <h1 className="text-3xl font-bold">Newsletter preferences</h1>
        {done ? <p role="status">You have been unsubscribed from Aana newsletters.</p> : <form onSubmit={submit} aria-busy={pending} className="space-y-4">
            <p>Choose Unsubscribe to stop Aana newsletter emails. Opening this page does not change your subscription.</p>
            {error && <p role="alert">{error}</p>}
            <Button type="submit" disabled={pending}>{pending ? "Updating…" : "Unsubscribe"}</Button>
        </form>}
        <p className="text-sm">Need help? <a className="underline break-all" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
    </div>;
}
