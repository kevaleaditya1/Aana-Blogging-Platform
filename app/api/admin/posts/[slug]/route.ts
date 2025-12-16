import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface RouteParams {
    params: Promise<{
        slug: string;
    }>;
}

// GET: Get single post
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { slug } = await params;
        
        const post = await prisma.post.findUnique({
            where: { slug },
        });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json({ post });
    } catch (error) {
        console.error("Error fetching post:", error);
        return NextResponse.json(
            { error: "Failed to fetch post" },
            { status: 500 }
        );
    }
}

// PUT: Update post
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { slug } = await params;
        const body = await request.json();
        const { title, excerpt, content, coverImage, category, tags, published } = body;

        // Check if post exists
        const existing = await prisma.post.findUnique({
            where: { slug },
        });

        if (!existing) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Update post
        const updatedPost = await prisma.post.update({
            where: { slug },
            data: {
                ...(title && { title }),
                ...(excerpt !== undefined && { excerpt }),
                ...(content && { content }),
                ...(coverImage && { coverImage }),
                ...(category && { category }),
                ...(tags && { tags }),
                ...(published !== undefined && { published }),
            },
        });

        return NextResponse.json({ success: true, post: updatedPost });
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json(
            { error: "Failed to update post" },
            { status: 500 }
        );
    }
}

// DELETE: Delete post
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await auth();

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { slug } = await params;

        // Check if post exists
        const existing = await prisma.post.findUnique({
            where: { slug },
        });

        if (!existing) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Delete post from database
        await prisma.post.delete({
            where: { slug },
        });

        return NextResponse.json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json(
            { error: "Failed to delete post" },
            { status: 500 }
        );
    }
}
