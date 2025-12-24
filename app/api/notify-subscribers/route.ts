import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendNewPostNotification } from "@/lib/email-notifications";

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user is admin
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const { postSlug } = body;

        if (!postSlug) {
            return NextResponse.json({ error: "Post slug required" }, { status: 400 });
        }

        // Get post data (you'll need to implement getPostData for database posts)
        // For now, this is a placeholder - you can enhance it based on your post storage
        const postData = {
            postTitle: body.postTitle || "New Blog Post",
            postExcerpt: body.postExcerpt || "Check out our latest article!",
            postSlug: postSlug,
            postCategory: body.postCategory || "General",
        };

        const result = await sendNewPostNotification(postData);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || "Failed to send notifications" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Sent ${result.sent}/${result.total} notifications`,
            sent: result.sent,
            total: result.total,
        });
    } catch (error) {
        console.error("Error in notify-subscribers API:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
