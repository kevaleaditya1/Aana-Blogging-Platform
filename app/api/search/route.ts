import { NextRequest, NextResponse } from "next/server";
import { getSortedPostsData } from "@/lib/posts";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("q")?.toLowerCase().trim() || "";
        const category = searchParams.get("category")?.toLowerCase().trim();

        if (!query) {
            return NextResponse.json({
                results: [],
                query: "",
                count: 0,
                message: "Please enter a search query",
            });
        }

        // Get all posts
        const allPosts = await getSortedPostsData();

        // Search and score posts
        const scoredPosts = allPosts.map((post) => {
            let score = 0;
            const lowerTitle = post.title.toLowerCase();
            const lowerExcerpt = post.excerpt.toLowerCase();
            const lowerContent = post.content.toLowerCase();
            const lowerTags = post.tags.map(tag => tag.toLowerCase());
            const lowerCategory = post.category.toLowerCase();

            // Title match (highest priority)
            if (lowerTitle.includes(query)) {
                score += 10;
            }

            // Excerpt match
            if (lowerExcerpt.includes(query)) {
                score += 5;
            }

            // Tag match
            if (lowerTags.some(tag => tag.includes(query))) {
                score += 3;
            }

            // Content match
            if (lowerContent.includes(query)) {
                score += 1;
            }

            // Category filter
            if (category && lowerCategory !== category) {
                score = 0; // Exclude posts not in selected category
            }

            return { ...post, score };
        });

        // Filter posts with score > 0 and sort by score
        const results = scoredPosts
            .filter((post) => post.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(({ score, ...post }) => post); // Remove score from results

        return NextResponse.json({
            results,
            query,
            count: results.length,
            category: category || null,
        });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json(
            { error: "Failed to search posts" },
            { status: 500 }
        );
    }
}
