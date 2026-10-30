"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
const messages: Record<string, string> = {
    contact: "Your message was accepted by our email service. Aana can reply using the email address you supplied.",
    newsletter: "Check your inbox for a welcome email from news@aanaa.tech. Use its confirmation link to activate your newsletter subscription. If you requested it recently, use the email already in your inbox.",
    "newsletter-confirmed": "Your email address is verified. You can now receive Aana newsletters, and each email includes an unsubscribe link.",
    signup: "Your account has been created. Sign in to save articles and join discussions.",
};
export function SuccessMessage({ kind }: { kind: string }) {
    const [confirmed, setConfirmed] = useState(false);
    useEffect(() => { try { setConfirmed(sessionStorage.getItem(`aana-success-${kind}`) === "confirmed"); } catch { /* Do not infer a conversion from this URL. */ } }, [kind]);
    return <div className="mx-auto max-w-2xl space-y-6 px-4 py-16">
        <h1 className="text-3xl font-bold">{confirmed ? (kind === "newsletter-confirmed" ? "You’re subscribed" : "Thank you") : "Submission status"}</h1>
        <p>{confirmed ? messages[kind] : "This page alone does not confirm a submission. Please complete the relevant form if you have not already done so."}</p>
        <div className="flex flex-wrap gap-4"><Link href="/blog" className="inline-flex min-h-11 items-center rounded-full border px-6">Explore articles</Link>{kind === "signup" && <Link href="/login" className="inline-flex min-h-11 items-center rounded-full border px-6">Sign in</Link>}</div>
    </div>;
}
