import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

interface Props {
    params: Promise<{ id: string }>;
}

// DELETE - Delete a comment
export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "You must be logged in" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const comment = await prisma.comment.findUnique({
            where: { id },
        });

        if (!comment) {
            return NextResponse.json(
                { error: "Comment not found" },
                { status: 404 }
            );
        }

        // Only allow user to delete their own comments or admins
        if (comment.userId !== session.user.id && session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Not authorized" },
                { status: 403 }
            );
        }

        await prisma.comment.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete comment error:", error);
        return NextResponse.json(
            { error: "Failed to delete comment" },
            { status: 500 }
        );
    }
}
