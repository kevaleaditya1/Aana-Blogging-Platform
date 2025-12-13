import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - List user's bookmarks
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "You must be logged in" },
                { status: 401 }
            );
        }

        const bookmarks = await prisma.bookmark.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ bookmarks });
    } catch (error) {
        console.error("Get bookmarks error:", error);
        return NextResponse.json(
            { error: "Failed to fetch bookmarks" },
            { status: 500 }
        );
    }
}

// POST - Create a bookmark
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "You must be logged in to bookmark" },
                { status: 401 }
            );
        }

        const { postSlug } = await request.json();

        if (!postSlug) {
            return NextResponse.json(
                { error: "Post slug is required" },
                { status: 400 }
            );
        }

        // Check if already bookmarked
        const existing = await prisma.bookmark.findUnique({
            where: {
                userId_postSlug: {
                    userId: session.user.id,
                    postSlug,
                },
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: "Already bookmarked" },
                { status: 400 }
            );
        }

        const bookmark = await prisma.bookmark.create({
            data: {
                postSlug,
                userId: session.user.id,
            },
        });

        return NextResponse.json({ bookmark });
    } catch (error) {
        console.error("Create bookmark error:", error);
        return NextResponse.json(
            { error: "Failed to create bookmark" },
            { status: 500 }
        );
    }
}

// DELETE - Remove a bookmark
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "You must be logged in" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const postSlug = searchParams.get("postSlug");

        if (!postSlug) {
            return NextResponse.json(
                { error: "Post slug is required" },
                { status: 400 }
            );
        }

        await prisma.bookmark.delete({
            where: {
                userId_postSlug: {
                    userId: session.user.id,
                    postSlug,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete bookmark error:", error);
        return NextResponse.json(
            { error: "Failed to delete bookmark" },
            { status: 500 }
        );
    }
}
