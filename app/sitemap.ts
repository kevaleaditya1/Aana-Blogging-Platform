import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { SITE_URL, categorySlug } from "@/lib/site";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 // Never silently publish an incomplete sitemap when the database is unavailable.
 const posts = await prisma.post.findMany({
  where: { published: true, status: "published", hideFromSearch: false, NOT: { robots: { contains: "noindex" } } },
  select: { slug: true, category: true, updatedAt: true, canonicalUrl: true, showInCategory: true },
 });
 const staticPages = ["", "/blog", "/category", "/about", "/contact", "/privacy", "/terms", "/news"];
 const categories = [...new Set(posts.filter(p => p.showInCategory).map(p => categorySlug(p.category)))];
 return [
  ...staticPages.map(path => ({ url: `${SITE_URL}${path}` })),
  ...categories.map(slug => ({ url: `${SITE_URL}/category/${encodeURIComponent(slug)}` })),
  ...posts.filter(p => !p.canonicalUrl || p.canonicalUrl === `${SITE_URL}/blog/${p.slug}`).map(p => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.updatedAt })),
 ];
}
