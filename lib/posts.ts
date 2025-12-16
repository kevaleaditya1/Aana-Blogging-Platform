import prisma from "@/lib/prisma";
import { Post } from "@/types";

export async function getSortedPostsData(): Promise<Post[]> {
    try {
        const posts = await prisma.post.findMany({
            where: {
                published: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return posts.map(post => ({
            slug: post.slug,
            title: post.title,
            date: post.createdAt.toISOString().split('T')[0],
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage,
            category: post.category,
            tags: post.tags,
            author: {
                name: post.author,
                picture: "/images/avatar.jpg",
            },
            ogImage: {
                url: post.coverImage,
            },
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
                published: true,
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
            },
        });

        if (!post) {
            return null;
        }

        return {
            slug: post.slug,
            title: post.title,
            date: post.createdAt.toISOString().split('T')[0],
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage,
            category: post.category,
            tags: post.tags,
            author: {
                name: post.author,
                picture: "/images/avatar.jpg",
            },
            ogImage: {
                url: post.coverImage,
            },
        };
    } catch (error) {
        console.error("Error fetching post:", error);
        return null;
    }
}

// Admin function to get all posts including unpublished
export async function getAllPostsForAdmin() {
    try {
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return posts.map(post => ({
            slug: post.slug,
            title: post.title,
            date: post.createdAt.toISOString().split('T')[0],
            excerpt: post.excerpt,
            category: post.category,
            published: post.published,
        }));
    } catch (error) {
        console.error("Error fetching posts for admin:", error);
        return [];
    }
}
