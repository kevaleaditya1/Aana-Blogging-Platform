import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json().catch(() => ({}));

        if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token) || typeof password !== "string" || password.length < 8 || password.length > 72) {
            return NextResponse.json(
                { error: "Provide a valid reset link and a password between 8 and 72 characters." },
                { status: 400 }
            );
        }

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date(),
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password and clear reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { error: "Failed to reset password" },
            { status: 500 }
        );
    }
}
