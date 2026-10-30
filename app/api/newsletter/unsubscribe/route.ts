import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyUnsubscribeToken } from "@/lib/email/unsubscribe";

// RFC 8058: only a signed POST changes preferences. Link scanners may safely GET the page.
export async function POST(request: Request) {
    try {
        let token: unknown = new URL(request.url).searchParams.get("token");
        if (!token && request.headers.get("content-type")?.includes("application/json")) token = (await request.json().catch(() => ({})))?.token;
        const id = verifyUnsubscribeToken(token);
        if (!id) return NextResponse.json({ error: "This unsubscribe link is invalid. Contact Aana for help." }, { status: 400 });
        const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { id }, select: { id: true, email: true } });
        if (!subscriber) return NextResponse.json({ error: "This subscription could not be found. Contact Aana for help." }, { status: 404 });
        await prisma.$transaction([
            prisma.newsletterSubscriber.update({ where: { id }, data: { isActive: false, unsubscribedAt: new Date() } }),
            prisma.subscriber.updateMany({ where: { email: subscriber.email }, data: { active: false } }),
        ]);
        return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
    } catch {
        return NextResponse.json({ error: "We couldn’t update your preference. Please try again or contact Aana." }, { status: 503 });
    }
}
