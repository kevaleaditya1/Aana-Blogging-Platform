import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json(
                { error: "Valid email is required" },
                { status: 400 }
            );
        }

        // Send welcome email
        await resend.emails.send({
            from: "Aana <onboarding@resend.dev>", // Use your verified domain
            to: email,
            subject: "Welcome to Aana Newsletter!",
            html: `
        <h1>Welcome to Aana!</h1>
        <p>Thank you for subscribing to our newsletter.</p>
        <p>You'll receive the latest tech news, reviews, and insights directly in your inbox.</p>
        <p>Stay tuned!</p>
        <p>- The Aana Team</p>
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Newsletter error:", error);
        return NextResponse.json(
            { error: "Failed to subscribe" },
            { status: 500 }
        );
    }
}
