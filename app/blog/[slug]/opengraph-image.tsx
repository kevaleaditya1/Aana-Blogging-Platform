import { ImageResponse } from "next/og";
import { getPostData } from "@/lib/posts";
import { plainText } from "@/lib/site";
export const alt = "Aana article preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";
export default async function ArticlePreview({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostData(slug);
    return new ImageResponse(<div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", background: "#101114", color: "#f5f5f7", padding: "64px 80px" }}>
        <svg width="280" height="60" viewBox="0 0 280 60"><g fill="none" stroke="#f5f5f7" strokeWidth="10" strokeLinecap="butt"><circle cx="30" cy="30" r="25" /><line x1="55" y1="0" x2="55" y2="60" /><circle cx="102" cy="30" r="25" /><line x1="127" y1="0" x2="127" y2="60" /><line x1="153" y1="0" x2="153" y2="60" /><path d="M153 30 A25 25 0 0 1 203 30" /><line x1="203" y1="30" x2="203" y2="60" /><circle cx="250" cy="30" r="25" /><line x1="275" y1="0" x2="275" y2="60" /></g></svg>
        <div style={{ display: "flex", fontSize: 48, lineHeight: 1.2 }}>{plainText(post?.title || "Technology articles, reviews and guides").slice(0, 220)}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#5ca8ff" }}><span>{plainText(post?.category || "Aana").slice(0, 60)}</span><span>aanaa.blog</span></div>
    </div>, size);
}
