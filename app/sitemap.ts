import { MetadataRoute } from "next";
import { getSortedPostsData } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const posts = await getSortedPostsData();

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/newsletter`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.7,
        },
    ];

    // Category pages
    const categories = ["phones", "gadgets", "ai-tools", "guides", "news"];
    const categoryPages = categories.map((category) => ({
        url: `${baseUrl}/category/${category}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
    }));

    // Blog posts (exclude hidden from search)
    const blogPosts = posts
        .filter(post => !post.hideFromSearch) // Exclude posts hidden from search
        .map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.date),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));

    return [...staticPages, ...categoryPages, ...blogPosts];
}
