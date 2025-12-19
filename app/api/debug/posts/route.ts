// Debug API route to check what posts are being returned
import { NextResponse } from "next/server";
import { getSortedPostsData } from "@/lib/posts";

export async function GET() {
    try {
        const posts = await getSortedPostsData();

        return NextResponse.json({
            count: posts.length,
            posts: posts.map(p => ({
                title: p.title,
                slug: p.slug,
                date: p.date,
            }))
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
