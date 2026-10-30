import { NextResponse } from "next/server";
import { validateForm } from "@/lib/validation";
import { requestNewsletterWelcome } from "@/lib/email/welcome";
import { emailFailureDiagnostic } from "@/lib/email/diagnostics";
export const maxDuration = 60;
export async function POST(request: Request) {
 const body = await request.json().catch(() => null);
 if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Provide valid form data." }, { status: 400 });
 const fields = validateForm("newsletter", body);
 if (Object.keys(fields).length) return NextResponse.json({ error: "Enter a valid email address.", fields }, { status: 400 });
 const email = body.email.trim().toLowerCase();
 try {
  const result = await requestNewsletterWelcome(email);
  if (result.state === "already_subscribed") return NextResponse.json({ error: "This address is already subscribed.", fields: { email: "This address is already confirmed and subscribed." } }, { status: 409 });
  return NextResponse.json({ success: true, confirmationRequired: true }, { headers: { "Cache-Control": "no-store" } });
 } catch (error) {
  console.error("[newsletter.subscribe]", emailFailureDiagnostic(error));
  return NextResponse.json({ error: "We couldn’t queue your welcome and confirmation email. Please try again. Your address has not been added to newsletter delivery." }, { status: 503 });
 }
}
