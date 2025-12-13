import { NextResponse } from "next/server";
import { getSortedPostsData } from "@/lib/posts";

export async function GET() {
    try {
        const posts = getSortedPostsData();

        // Return only necessary fields
        const simplifiedPosts = posts.map((post) => ({
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            date: post.date,
            category: post.category,
        }));

        return NextResponse.json({ posts: simplifiedPosts });
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}
