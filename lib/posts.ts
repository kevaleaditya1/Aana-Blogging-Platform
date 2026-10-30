import { articleImage } from "@/lib/article-images";
import { plainText } from "@/lib/site";
import prisma from "@/lib/prisma";
import { Post } from "@/types";

export async function getSortedPostsData(includeContent = false): Promise<Post[]> {
    try {
        const posts = await prisma.post.findMany({
            where: {
                status: "published",
                published: true,
                showInCategory: { not: false }, // Hide posts with showInCategory = false
            },
            select: { content: includeContent, slug: true, title: true, createdAt: true, excerpt: true, coverImage: true, category: true, tags: true, author: true, featuredPost: true, pinnedPost: true, trending: true, homepagePriority: true, showInCategory: true, hideFromSearch: true },
            orderBy: [
                { pinnedPost: "desc" }, // Pinned posts first
                { homepagePriority: "desc" }, // Then by priority
                { createdAt: "desc" }, // Then by date
            ],
        });

        return posts.map(post => ({
            slug: post.slug,
            title: post.title,
            date: post.createdAt.toISOString().split('T')[0],
            excerpt: plainText(post.excerpt) || `Read ${post.title} and explore its linked sources.`,
            content: post.content || "",
            coverImage: articleImage(post.coverImage),
            category: post.category,
            tags: post.tags,
            author: {
                name: post.author,
                picture: "/images/avatar.jpg",
            },
            ogImage: {
                url: articleImage(post.coverImage),
            },
            // Visibility fields
            featuredPost: post.featuredPost ?? false,
            pinnedPost: post.pinnedPost ?? false,
            trending: post.trending ?? false,
            homepagePriority: post.homepagePriority ?? 0,
            showInCategory: post.showInCategory ?? true,
            hideFromSearch: post.hideFromSearch ?? false,
        }));
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export async function getAllPostSlugs() {
    try {
        const posts = await prisma.post.findMany({
            where: {
                published: true, status: "published"
            },
            select: {
                slug: true,
            },
        });

        return posts.map((post) => ({
            params: {
                slug: post.slug,
            },
        }));
    } catch (error) {
        console.error("Error fetching post slugs:", error);
        return [];
    }
}

export async function getPostData(slug: string): Promise<Post | null> {
    try {
        const post = await prisma.post.findUnique({
            where: {
                slug,
                published: true,
                status: "published",
            },
        });

        if (!post) {
            return null;
        }

        return {
            updatedAt: post.updatedAt.toISOString(),
            metaTitle: post.metaTitle, metaDescription: post.metaDescription,
            canonicalUrl: post.canonicalUrl, robots: post.robots, hideFromSearch: post.hideFromSearch,
            slug: post.slug,
            title: post.title,
            date: post.createdAt.toISOString().split('T')[0],
            excerpt: plainText(post.excerpt) || `Read ${post.title} and explore its linked sources.`,
            content: post.content,
            coverImage: articleImage(post.coverImage),
            category: post.category,
            tags: post.tags,
            author: {
                name: post.author,
                picture: "/images/avatar.jpg",
            },
            ogImage: {
                url: articleImage(post.coverImage),
            },
        };
    } catch (error) {
        console.error("Error fetching post:", error);
        // A database outage is not a missing article and must not be cached as a 404.
        throw error;
    }
}


// Get related posts based on tags and category
export async function getRelatedPosts(
    currentSlug: string,
    category: string,
    tags: string[],
    limit: number = 6
): Promise<Post[]> {
    try {
        const allPosts = await getSortedPostsData();

        // Filter out current post
        const otherPosts = allPosts.filter(post => post.slug !== currentSlug);

        // Score each post based on similarity
        const scoredPosts = otherPosts.map(post => {
            let score = 0;

            // Same category: +5 points
            if (post.category.toLowerCase() === category.toLowerCase()) {
                score += 5;
            }

            // Matching tags: +3 points each
            const matchingTags = post.tags.filter(tag =>
                tags.some(currentTag =>
                    currentTag.toLowerCase() === tag.toLowerCase()
                )
            );
            score += matchingTags.length * 3;

            return { ...post, score };
        });

        // Sort by score (highest first) and take top N
        const relatedPosts = scoredPosts
            .filter(post => post.score > 0) // Only posts with some relevance
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(({ score, ...post }) => post); // Remove score from result

        return relatedPosts;
    } catch (error) {
        console.error("Error fetching related posts:", error);
        return [];
    }
}

