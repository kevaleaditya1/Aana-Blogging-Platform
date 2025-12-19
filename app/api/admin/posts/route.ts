import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: List all posts (admin view - includes unpublished)
export async function GET() {
    try {
        const session = await auth();

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                category: true,
                published: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}

// POST: Create new post
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            slug, title, excerpt, content, coverImage, category, tags, published,
            // SEO fields
            metaTitle, metaDescription, focusKeyword, canonicalUrl, robots, ogTitle, ogDescription,
            // Content enhancement
            readingTime, tableOfContents, contentType,
            // Visibility
            featuredPost, pinnedPost, trending, homepagePriority, showInCategory, hideFromSearch,
            // Monetization
            sponsoredPost, sponsorName, affiliateDisclosure, adsEnabled,
            // Technical
            schemaType, commentEnabled, status, publishDate
        } = body;

        if (!slug || !title || !content) {
            return NextResponse.json(
                { error: "Missing required fields: slug, title, content" },
                { status: 400 }
            );
        }

        // Check if post with slug already exists
        const existing = await prisma.post.findUnique({
            where: { slug },
        });

        if (existing) {
            return NextResponse.json(
                { error: "Post with this slug already exists" },
                { status: 409 }
            );
        }

        // Create post in database with all fields
        const post = await prisma.post.create({
            data: {
                slug,
                title,
                excerpt: excerpt || "",
                content,
                coverImage: coverImage || "/images/default-cover.jpg",
                category: category || "Uncategorized",
                tags: tags || [],
                published: published !== undefined ? published : true,

                // SEO fields
                metaTitle,
                metaDescription,
                focusKeyword,
                canonicalUrl,
                robots: robots || "index",
                ogTitle,
                ogDescription,

                // Content enhancement
                readingTime,
                tableOfContents: tableOfContents !== undefined ? tableOfContents : true,
                contentType,

                // Visibility
                featuredPost: featuredPost || false,
                pinnedPost: pinnedPost || false,
                trending: trending || false,
                homepagePriority,
                showInCategory: showInCategory !== undefined ? showInCategory : true,
                hideFromSearch: hideFromSearch || false,

                // Monetization
                sponsoredPost: sponsoredPost || false,
                sponsorName,
                affiliateDisclosure,
                adsEnabled: adsEnabled !== undefined ? adsEnabled : true,

                // Technical
                schemaType: schemaType || "BlogPosting",
                commentEnabled: commentEnabled !== undefined ? commentEnabled : true,
                status: status || "published",
                publishDate: publishDate ? new Date(publishDate) : null,
            },
        });

        return NextResponse.json({ success: true, post });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 }
        );
    }
}
