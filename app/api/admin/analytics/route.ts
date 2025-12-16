import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSortedPostsData } from "@/lib/posts";

export async function GET() {
    try {
        const session = await auth();

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get posts count
        const posts = getSortedPostsData();
        const totalPosts = posts.length;

        // Get users count
        const totalUsers = await prisma.user.count();

        // Get comments count
        const totalComments = await prisma.comment.count();

        // Get popular posts (first 5)
        const popularPosts = posts.slice(0, 5).map(post => ({
            slug: post.slug,
            title: post.title,
            category: post.category,
        }));

        return NextResponse.json({
            totalPosts,
            totalUsers,
            totalComments,
            popularPosts,
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
}
