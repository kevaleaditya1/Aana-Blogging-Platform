import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

// Ensure directory exists
if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
}

// GET: List all posts
export async function GET() {
    try {
        const fileNames = fs.readdirSync(postsDirectory);
        const posts = fileNames
            .filter((fileName) => fileName.endsWith(".mdx"))
            .map((fileName) => {
                const slug = fileName.replace(/\.mdx$/, "");
                const fullPath = path.join(postsDirectory, fileName);
                const fileContents = fs.readFileSync(fullPath, "utf8");
                const { data } = matter(fileContents);

                return {
                    slug,
                    ...data,
                };
            });

        return NextResponse.json({ posts });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}

// POST: Create new post
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { slug, frontmatter, content } = body;

        if (!slug || !frontmatter || !content) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const filePath = path.join(postsDirectory, `${slug}.mdx`);

        // Check if file already exists
        if (fs.existsSync(filePath)) {
            return NextResponse.json(
                { error: "Post with this slug already exists" },
                { status: 409 }
            );
        }

        // Create MDX content
        const mdxContent = matter.stringify(content, frontmatter);

        // Write file
        fs.writeFileSync(filePath, mdxContent, "utf8");

        return NextResponse.json({ success: true, slug });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 }
        );
    }
}
