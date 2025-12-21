import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        // Validate email
        if (!email || !email.includes("@")) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            );
        }

        // Check if already subscribed
        const existing = await prisma.subscriber.findUnique({
            where: { email },
        });

        if (existing) {
            return NextResponse.json(
                { error: "This email is already subscribed" },
                { status: 400 }
            );
        }

        // Add to database
        await prisma.subscriber.create({
            data: {
                email,
                subscribedAt: new Date(),
            },
        });

        // Send welcome email
        const emailResult = await sendWelcomeEmail(email);

        if (!emailResult.success) {
            console.error('Failed to send welcome email:', emailResult.error);
            // Still return success since subscriber was added to database
        }

        return NextResponse.json({
            success: true,
            message: "Successfully subscribed! Check your email.",
        });
    } catch (error) {
        console.error("Newsletter subscription error:", error);
        return NextResponse.json(
            { error: "Failed to subscribe. Please try again." },
            { status: 500 }
        );
    }
}
