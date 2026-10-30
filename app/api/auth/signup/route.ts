import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { validateForm } from "@/lib/validation";
export async function POST(request: Request) {
 const body = await request.json().catch(() => null);
 if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Provide valid form data." }, { status: 400 });
 const fields = validateForm("signup", body);
 if (Object.keys(fields).length) return NextResponse.json({ error: "Check the highlighted fields.", fields }, { status: 400 });
 const email = body.email.trim().toLowerCase();
 try {
  if (await prisma.user.findUnique({ where: { email } })) return NextResponse.json({ error: "An account already uses this email. Try signing in.", fields: { email: "An account already uses this email." } }, { status: 409 });
  const password = await bcrypt.hash(body.password, 12);
  await prisma.user.create({ data: { name: body.name.trim(), email, password, role: "USER" } });
  return NextResponse.json({ success: true }, { status: 201 });
 } catch { return NextResponse.json({ error: "We couldn’t create the account. Try again or sign in if you already registered." }, { status: 503 }); }
}
