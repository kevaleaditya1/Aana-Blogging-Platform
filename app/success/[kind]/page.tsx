import { notFound } from "next/navigation";
import { SuccessMessage } from "@/components/success-message";
import { privateMetadata } from "@/lib/site";
export async function generateMetadata({ params }: { params: Promise<{ kind: string }> }) {
    const { kind } = await params;
    return privateMetadata(`${kind === "contact" ? "Message" : kind === "newsletter" ? "Subscription" : "Account"} status`);
}
export default async function SuccessPage({ params }: { params: Promise<{ kind: string }> }) {
    const { kind } = await params;
    if (!["contact", "newsletter", "signup"].includes(kind)) notFound();
    return <SuccessMessage kind={kind} />;
}
