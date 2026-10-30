import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyConfirmationToken } from "@/lib/email/confirmation";

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);
    try {
        const verified = verifyConfirmationToken(body?.token);
        if (!verified) return NextResponse.json({ error: "This confirmation link is invalid or expired. Request a new one from the newsletter form." }, { status: 400 });
        const result = await prisma.$transaction(async transaction => {
            const subscriber = await transaction.newsletterSubscriber.findUnique({ where: { id: verified.id } });
            if (!subscriber || subscriber.confirmationVersion !== verified.version || !subscriber.confirmationExpiresAt || subscriber.confirmationExpiresAt <= new Date()) return null;
            if (subscriber.isActive && subscriber.verifiedAt) return { newlyConfirmed: false };
            const activated = await transaction.newsletterSubscriber.updateMany({
                where: { id: subscriber.id, confirmationVersion: verified.version, confirmationExpiresAt: { gt: new Date() }, isActive: false },
                data: { isActive: true, verifiedAt: new Date(), unsubscribedAt: null },
            });
            if (!activated.count) {
                const current = await transaction.newsletterSubscriber.findUnique({ where: { id: subscriber.id } });
                return current?.isActive && current.verifiedAt && current.confirmationVersion === verified.version ? { newlyConfirmed: false } : null;
            }
            await transaction.subscriber.upsert({ where: { email: subscriber.email }, create: { email: subscriber.email, active: true }, update: { active: true } });
            return { newlyConfirmed: true };
        });
        if (!result) return NextResponse.json({ error: "This request is no longer active. Use the newsletter form to request a new confirmation email." }, { status: 400 });
        return NextResponse.json({ success: true, ...result }, { headers: { "Cache-Control": "no-store" } });
    } catch {
        return NextResponse.json({ error: "We couldn’t confirm your subscription. Please try again." }, { status: 503 });
    }
}
