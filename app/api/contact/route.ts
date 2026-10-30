import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validateForm } from "@/lib/validation";
export async function POST(request: Request) {
 const body = await request.json().catch(() => null);
 if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Provide valid form data." }, { status: 400 });
 const fields = validateForm("contact", body);
 if (Object.keys(fields).length) return NextResponse.json({ error: "Check the highlighted fields.", fields }, { status: 400 });
 if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM || !process.env.CONTACT_EMAIL) return NextResponse.json({ error: "Messaging is temporarily unavailable. Please use the published email address." }, { status: 503 });
 try {
  const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
   from: process.env.EMAIL_FROM, to: process.env.CONTACT_EMAIL, replyTo: body.email.trim(),
   subject: "New Aana contact message", text: `From: ${body.name.trim()}\nEmail: ${body.email.trim()}\n\n${body.message.trim()}`,
  });
  if (result.error || !result.data?.id) return NextResponse.json({ error: "The email service could not accept your message. Please try again." }, { status: 502 });
  return NextResponse.json({ success: true });
 } catch { return NextResponse.json({ error: "Could not send your message. Please try again." }, { status: 502 }); }
}
