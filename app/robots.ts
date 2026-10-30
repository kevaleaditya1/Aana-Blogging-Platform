import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
 return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/profile", "/saved", "/bookmarks", "/login", "/signup", "/forgot-password", "/reset-password", "/search", "/success", "/unsubscribe", "/newsletter/confirm"] }, sitemap: `${SITE_URL}/sitemap.xml` };
}
