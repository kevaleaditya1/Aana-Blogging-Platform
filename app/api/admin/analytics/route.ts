import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSortedPostsData } from "@/lib/posts";

export async function GET() {
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

        // Get all posts
        const posts = await getSortedPostsData();

        // Get subscriber count
        const subscriberCount = await prisma.subscriber.count({
            where: { active: true },
        });

        // Get comment count
        const commentCount = await prisma.comment.count();

        // Get bookmark count
        const bookmarkCount = await prisma.bookmark.count();

        // Get user count
        const userCount = await prisma.user.count();

        // Get recent comments
        const recentComments = await prisma.comment.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        // Get posts by category
        const postsByCategory = posts.reduce((acc, post) => {
            acc[post.category] = (acc[post.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Get top tags
        const tagCount = new Map<string, number>();
        posts.forEach((post) => {
            post.tags.forEach((tag) => {
                tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
            });
        });

        const topTags = Array.from(tagCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([tag, count]) => ({ tag, count }));

        return NextResponse.json({
            overview: {
                totalPosts: posts.length,
                totalSubscribers: subscriberCount,
                totalComments: commentCount,
                totalBookmarks: bookmarkCount,
                totalUsers: userCount,
            },
            postsByCategory,
            topTags,
            recentComments: recentComments.map((comment) => ({
                id: comment.id,
                content: comment.content.substring(0, 100),
                userName: comment.user.name,
                userEmail: comment.user.email,
                createdAt: comment.createdAt,
                postSlug: comment.postSlug,
            })),
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
