import { NextResponse } from "next/server";
import { getSortedPostsData } from "@/lib/posts";

export async function GET() {
    try {
        const posts = getSortedPostsData();

        // Check if posts is valid
        if (!posts || !Array.isArray(posts)) {
            console.error("getSortedPostsData returned invalid data:", posts);
            return NextResponse.json({ posts: [] });
        }

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
            { posts: [], error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}
