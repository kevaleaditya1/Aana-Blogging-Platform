"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
const messages: Record<string, string> = {
    contact: "Your message was accepted by our email service. Aana can reply using the email address you supplied.",
    newsletter: "Your newsletter subscription has been saved. You can contact Aana to stop receiving updates.",
    signup: "Your account has been created. Sign in to save articles and join discussions.",
};
export function SuccessMessage({ kind }: { kind: string }) {
    const [confirmed, setConfirmed] = useState(false);
    useEffect(() => { try { setConfirmed(sessionStorage.getItem(`aana-success-${kind}`) === "confirmed"); } catch { /* Do not infer a conversion from this URL. */ } }, [kind]);
    return <div className="mx-auto max-w-2xl space-y-6 px-4 py-16">
        <h1 className="text-3xl font-bold">{confirmed ? "Thank you" : "Submission status"}</h1>
        <p>{confirmed ? messages[kind] : "This page alone does not confirm a submission. Please complete the relevant form if you have not already done so."}</p>
        <div className="flex flex-wrap gap-4"><Link href="/blog" className="inline-flex min-h-11 items-center rounded-full border px-6">Explore articles</Link>{kind === "signup" && <Link href="/login" className="inline-flex min-h-11 items-center rounded-full border px-6">Sign in</Link>}</div>
    </div>;
}
