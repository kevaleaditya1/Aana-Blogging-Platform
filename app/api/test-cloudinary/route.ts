import { NextResponse } from "next/server";

export async function GET() {
    const config = {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        resendKey: process.env.RESEND_API_KEY,
    };

    return NextResponse.json({
        message: "Environment Variables Check",
        cloudName: config.cloudName || "NOT SET",
        apiKey: config.apiKey ? "SET" : "NOT SET",
        apiSecret: config.apiSecret ? "SET" : "NOT SET",
        resendKey: config.resendKey ? "SET" : "NOT SET",
        allSet: !!(config.cloudName && config.apiKey && config.apiSecret),
    });
}
