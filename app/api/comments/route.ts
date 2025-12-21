import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch comments for a post
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const postSlug = searchParams.get("postSlug");

        if (!postSlug) {
            return NextResponse.json(
                { error: "Post slug is required" },
                { status: 400 }
            );
        }

        const comments = await prisma.comment.findMany({
            where: {
                postSlug,
                parentId: null, // Only get top-level comments
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                replies: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                image: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        );
    }
}

// POST - Create a new comment
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "You must be logged in to comment" },
                { status: 401 }
            );
        }

        const { content, postSlug, parentId } = await request.json();

        if (!content || !postSlug) {
            return NextResponse.json(
                { error: "Content and post slug are required" },
                { status: 400 }
            );
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postSlug,
                userId: user.id,
                parentId: parentId || null,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json({ comment }, { status: 201 });
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json(
            { error: "Failed to create comment" },
            { status: 500 }
        );
    }
}
