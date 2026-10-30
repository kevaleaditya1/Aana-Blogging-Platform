import { isEmail } from "@/lib/validation";
import { SITE_URL } from "@/lib/site";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import crypto from "crypto";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json().catch(() => ({}));

        if (!isEmail(email)) {
            return NextResponse.json(
                { error: "Enter a valid email address." },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ success: true });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        await prisma.user.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });

        // Send reset email
        const resetUrl = `${SITE_URL}/reset-password/${resetToken}`;

        const result = await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: email,
            subject: "Reset Your Password - Aana",
            html: `
        <h2>Reset Your Password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
        });

        if (result.error || !result.data?.id) return NextResponse.json({ error: "The email service could not accept the request. Try again." }, { status: 502 });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { error: "Failed to send reset email" },
            { status: 500 }
        );
    }
}
