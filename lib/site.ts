import type { Metadata } from "next";

// Metadata must never fall back to localhost or a preview deployment.
export const SITE_URL = "https://aanaa.blog";
export const CONTACT_EMAIL = "contact.aanaa.blog@gmail.com";
export const categorySlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");
export function plainText(value: string): string {
    const entities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", mdash: "—", ndash: "–", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", hellip: "…" };
    let text = value;
    for (let i = 0; i < 3; i++) text = text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
        if (!code.startsWith("#")) return entities[code.toLowerCase()] ?? entity;
        const number = code[1]?.toLowerCase() === "x" ? Number.parseInt(code.slice(2), 16) : Number.parseInt(code.slice(1), 10);
        return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : "";
    });
    return text.replace(/<[^>]*(?:>|$)/g, " ").replace(/\s+/g, " ").trim();
}
const clean = (text: string, max: number) => plainText(text).slice(0, max).trim();

export function pageMetadata(title: string, description: string, path: string, image = "/social-default.png"): Metadata {
    const fullTitle = `${clean(title, 51)} | Aana`;
    const summary = clean(description, 154) || clean(`Read ${title} on Aana.`, 154);
    const url = new URL(path, SITE_URL).href;
    let imageUrl = new URL("/social-default.png", SITE_URL).href;
    try {
        const candidate = new URL(image, SITE_URL);
        if (candidate.protocol === "https:" && !candidate.pathname.includes("default-blog-cover")) imageUrl = candidate.href;
    } catch { /* Use the verified branded default. */ }
    return {
        title: { absolute: fullTitle }, description: summary,
        alternates: { canonical: url },
        openGraph: { type: "website", title: fullTitle, description: summary, url, siteName: "Aana", images: [{ url: imageUrl, alt: `${title} — Aana` }] },
        twitter: { card: "summary_large_image", title: fullTitle, description: summary, images: [imageUrl] },
    };
}

export const privateMetadata = (title: string): Metadata => ({
    ...pageMetadata(title, `${title} on Aana.`, "/"),
    alternates: { canonical: null }, robots: { index: false, follow: false },
});
