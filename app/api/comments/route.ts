import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - List comments for a post
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const postSlug = searchParams.get("postSlug");

        if (!postSlug) {
            return NextResponse.json(
                { error: "Post slug is required" },
                { status: 400 }
            );
        }

        const comments = await prisma.comment.findMany({
            where: { postSlug },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ comments });
    } catch (error) {
        console.error("Get comments error:", error);
        return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        );
    }
}

// POST - Create a comment
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "You must be logged in to comment" },
                { status: 401 }
            );
        }

        const { postSlug, content } = await request.json();

        if (!postSlug || !content) {
            return NextResponse.json(
                { error: "Post slug and content are required" },
                { status: 400 }
            );
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postSlug,
                userId: session.user.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json({ comment });
    } catch (error) {
        console.error("Create comment error:", error);
        return NextResponse.json(
            { error: "Failed to create comment" },
            { status: 500 }
        );
    }
}
