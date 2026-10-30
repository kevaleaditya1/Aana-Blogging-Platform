"use client";
import { useId, useRef, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isEmail } from "@/lib/validation";
export function PasswordForm({ token }: { token?: string }) {
    const id = useId();
    const reset = token !== undefined;
    const form = useRef<HTMLFormElement>(null);
    const inFlight = useRef(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);
    const [success, setSuccess] = useState(false);
    const submit = async (event: React.FormEvent) => {
        event.preventDefault(); if (inFlight.current) return;
        setError("");
        const invalid = reset ? (password.length < 8 || password.length > 72 ? "Use a password between 8 and 72 characters." : password !== confirm ? "Passwords must match." : "") : !isEmail(email) ? "Enter a valid email address." : "";
        if (invalid) { setError(invalid); form.current?.querySelector<HTMLInputElement>("input")?.focus(); return; }
        inFlight.current = true; setPending(true);
        try {
            const response = await fetch(reset ? "/api/auth/reset-password" : "/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(reset ? { token, password } : { email }) });
            const result = await response.json().catch(() => ({}));
            if (!response.ok || !result.success) { setError(result.error || "Couldn’t complete the request. Try again."); return; }
            setSuccess(true); setPassword(""); setConfirm("");
        } catch { setError("Couldn’t connect. Your entries have been kept. Try again."); }
        finally { setPending(false); inFlight.current = false; }
    };
    return <div className="mx-auto max-w-md space-y-6 px-4 py-12">
        <h1 className="text-3xl font-bold">{reset ? "Choose a new password" : "Reset your password"}</h1>
        {success ? <div role="status" className="space-y-4"><p>{reset ? "Your password has been updated. You can now sign in." : "If an account uses this address, a reset link has been requested. Check your inbox."}</p><Link href="/login" className="inline-flex min-h-11 items-center underline">Back to sign in</Link></div> : <form ref={form} onSubmit={submit} noValidate aria-busy={pending} className="space-y-4">
            {reset ? <>
                <label className="block" htmlFor={`${id}-password`}>New password</label><Input id={`${id}-password`} type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} disabled={pending} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} minLength={8} maxLength={72} required />
                <label className="block" htmlFor={`${id}-confirm`}>Confirm password</label><Input id={`${id}-confirm`} type="password" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} disabled={pending} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} required />
                <p className="text-sm">Use 8–72 characters.</p>
            </> : <><label className="block" htmlFor={`${id}-email`}>Email address</label><Input id={`${id}-email`} type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={pending} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} /></>}
            {error && <p id={`${id}-error`} role="alert">{error}</p>}
            <Button type="submit" disabled={pending} className="min-h-11">{pending ? "Submitting…" : reset ? "Update password" : "Request reset link"}</Button>
        </form>}
    </div>;
}
