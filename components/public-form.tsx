"use client";
import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateForm, type FieldErrors, type FormKind } from "@/lib/validation";
import { trackEvent } from "@/lib/tracking";

export function PublicForm({ kind, compact = false }: { kind: FormKind; compact?: boolean }) {
    const id = useId();
    const form = useRef<HTMLFormElement>(null);
    const inFlight = useRef(false);
    const router = useRouter();
    const [values, setValues] = useState({ name: "", email: "", message: "", password: "" });
    const [errors, setErrors] = useState<FieldErrors>({});
    const [problem, setProblem] = useState("");
    const [pending, setPending] = useState(false);
    const [completed, setCompleted] = useState(false);
    const fields = kind === "newsletter" ? ["email"] : kind === "signup" ? ["name", "email", "password"] : ["name", "email", "message"];
    const labels: Record<string, string> = { name: "Name", email: "Email address", message: "Message", password: "Password" };

    const focusErrors = (next: FieldErrors) => {
        requestAnimationFrame(() => {
            const first = fields.find(field => next[field]);
            if (first) (form.current?.elements.namedItem(first) as HTMLElement)?.focus();
            else form.current?.querySelector<HTMLElement>("[role=alert]")?.focus();
        });
    };
    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (inFlight.current) return;
        const payload = Object.fromEntries(fields.map(field => [field, values[field as keyof typeof values].trim()]));
        // Password whitespace is intentional user input.
        if (kind === "signup") payload.password = values.password;
        const next = validateForm(kind, payload);
        setErrors(next); setProblem("");
        if (Object.keys(next).length) { focusErrors(next); return; }
        inFlight.current = true; setPending(true);
        try {
            const endpoint = kind === "contact" ? "/api/contact" : kind === "newsletter" ? "/api/newsletter/subscribe" : "/api/auth/signup";
            const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            const result = await response.json().catch(() => ({}));
            if (!response.ok || result.success !== true) {
                const failures = result.fields || {};
                setErrors(failures); setProblem(result.error || "We couldn’t complete this request. Please try again.");
                focusErrors(failures); return;
            }
            // Conversion is emitted once, from the confirmed operation, never from a page visit.
            if (kind !== "newsletter") trackEvent(kind === "contact" ? "contact_success" : "signup_success");
            try { sessionStorage.setItem(`aana-success-${kind}`, "confirmed"); } catch { /* Success still navigates if storage is blocked. */ }
            setCompleted(true);
            router.push(`/success/${kind}`);
        } catch {
            setProblem("We couldn’t connect. Check your connection and try again. Your entries have been kept."); focusErrors({});
        } finally { setPending(false); inFlight.current = false; }
    };

    return <form ref={form} onSubmit={submit} noValidate aria-busy={pending} className={`space-y-4 ${compact ? "text-sm" : "w-full"}`}>
        {fields.map(field => <div key={field} className="space-y-2">
            <label htmlFor={`${id}-${field}`} className="block text-sm font-medium">{labels[field]}</label>
            {field === "message" ? <textarea id={`${id}-${field}`} name={field} value={values.message} onChange={event => setValues({ ...values, message: event.target.value })} required minLength={10} maxLength={5000} disabled={pending || completed} aria-invalid={Boolean(errors[field])} aria-describedby={errors[field] ? `${id}-${field}-error` : undefined} className="w-full min-h-36 rounded-xl border bg-background px-3 py-2" /> :
                <Input id={`${id}-${field}`} name={field} type={field === "email" ? "email" : field === "password" ? "password" : "text"} autoComplete={field === "password" ? "new-password" : field === "name" ? "name" : "email"} value={values[field as keyof typeof values]} onChange={event => setValues({ ...values, [field]: event.target.value })} disabled={pending || completed} required minLength={field === "password" ? 8 : undefined} maxLength={field === "password" ? 72 : field === "email" ? 254 : 100} aria-invalid={Boolean(errors[field])} aria-describedby={errors[field] ? `${id}-${field}-error` : field === "password" ? `${id}-password-help` : undefined} className="min-h-11" />}
            {field === "password" && <p id={`${id}-password-help`} className="text-sm">Use 8–72 characters.</p>}
            {errors[field] && <p id={`${id}-${field}-error`} className="text-sm text-red-700 dark:text-red-300">{errors[field]}</p>}
        </div>)}
        {problem && <p role="alert" tabIndex={-1} className="text-sm text-red-700 dark:text-red-300">{problem}</p>}
        <p className="text-xs leading-relaxed">{kind === "newsletter" ? "By subscribing, you ask Aana to email you updates. " : "Learn how your information is used in our "}<Link className="underline" href="/privacy">draft privacy policy</Link>. {kind === "signup" && <Link className="underline" href="/terms">Read the draft terms.</Link>}</p>
        <Button type="submit" disabled={pending || completed} className="min-h-11">{completed ? "Opening confirmation…" : pending ? "Submitting…" : kind === "newsletter" ? "Subscribe to updates" : kind === "contact" ? "Send message" : "Create account"}</Button>
        <span role="status" className="sr-only">{pending ? "Submitting. Please wait." : ""}</span>
    </form>;
}
