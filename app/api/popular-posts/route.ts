import { getSortedPostsData } from "@/lib/posts";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const posts = await getSortedPostsData();

        // For now, return top 5 posts by date
        // In the future, you can add a views column to track actual popularity
        const popularPosts = posts.slice(0, 5).map((post) => ({
            slug: post.slug,
            title: post.title,
            category: post.category,
            views: Math.floor(Math.random() * 1000) + 100, // Placeholder views
        }));

        return NextResponse.json(popularPosts);
    } catch (error) {
        console.error("Error fetching popular posts:", error);
        return NextResponse.json({ error: "Failed to fetch popular posts" }, { status: 500 });
    }
}
