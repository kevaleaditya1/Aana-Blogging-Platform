import { getSortedPostsData } from "@/lib/posts";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const posts = await getSortedPostsData();

        // Count tag occurrences
        const tagCount = new Map<string, number>();

        posts.forEach((post) => {
            post.tags.forEach((tag) => {
                tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
            });
        });

        // Convert to array and sort by count
        const tags = Array.from(tagCount.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 20); // Top 20 tags

        return NextResponse.json(tags);
    } catch (error) {
        console.error("Error fetching tags:", error);
        return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
    }
}
