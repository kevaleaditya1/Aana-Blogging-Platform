import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

interface RouteParams {
    params: Promise<{
        slug: string;
    }>;
}

// GET: Get single post
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params;
        const filePath = path.join(postsDirectory, `${slug}.mdx`);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(fileContents);

        return NextResponse.json({ slug, frontmatter: data, content });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch post" },
            { status: 500 }
        );
    }
}

// PUT: Update post
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params;
        const body = await request.json();
        const { frontmatter, content } = body;

        const filePath = path.join(postsDirectory, `${slug}.mdx`);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Create MDX content
        const mdxContent = matter.stringify(content, frontmatter);

        // Write file
        fs.writeFileSync(filePath, mdxContent, "utf8");

        return NextResponse.json({ success: true, slug });
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
        const { slug } = await params;
        const filePath = path.join(postsDirectory, `${slug}.mdx`);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        fs.unlinkSync(filePath);

        return NextResponse.json({ success: true, slug });
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json(
            { error: "Failed to delete post" },
            { status: 500 }
        );
    }
}
