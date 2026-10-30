import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateForm } from "@/lib/validation";
export async function POST(request: Request) {
 const body = await request.json().catch(() => null);
 if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Provide valid form data." }, { status: 400 });
 const fields = validateForm("newsletter", body);
 if (Object.keys(fields).length) return NextResponse.json({ error: "Enter a valid email address.", fields }, { status: 400 });
 const email = body.email.trim().toLowerCase();
 try {
  const existing = await prisma.subscriber.findUnique({ where: { email } });
  if (existing?.active) return NextResponse.json({ error: "This email is already subscribed.", fields: { email: "This email is already subscribed. Contact Aana if you need help." } }, { status: 409 });
  await prisma.$transaction([
   prisma.subscriber.upsert({ where: { email }, create: { email }, update: { active: true, subscribedAt: new Date() } }),
   prisma.newsletterSubscriber.upsert({ where: { email }, create: { email, isActive: true }, update: { isActive: true, unsubscribedAt: null } }),
  ]);
  // Success means the explicit opt-in was saved, not that a welcome email was delivered.
  return NextResponse.json({ success: true });
 } catch { return NextResponse.json({ error: "We couldn’t save your subscription. Please try again." }, { status: 503 }); }
}
