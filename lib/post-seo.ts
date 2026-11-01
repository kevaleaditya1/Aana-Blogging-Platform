import { plainText, SITE_URL } from "@/lib/site";

// Keep complete words instead of cutting a title or summary mid-word.
export function seoText(value: string, limit: number): string {
    const text = plainText(value);
    if (text.length <= limit) return text;
    const boundary = text.lastIndexOf(" ", limit - 1);
    const shortened = text.slice(0, boundary > 0 ? boundary : limit - 1).replace(/[\s,;:—–-]+$/, "");
    return `${shortened}…`;
}

function prose(value: string): string {
    return plainText(value
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
        .replace(/[*_`#]/g, ""));
}

export function postSEO(post: { title: string; metaTitle?: string | null; metaDescription?: string | null; excerpt: string; content: string }) {
    const originalTitle = plainText(post.title);
    const requested = plainText(post.metaTitle || "").replace(/\s*\|\s*Aana$/i, "");
    // Older imported metadata may already be a character-cut prefix of the title.
    const source = requested && !(requested.length < originalTitle.length && originalTitle.startsWith(requested)) ? requested : originalTitle;
    // A complete introductory clause often makes a better concise search title.
    const clause = source.split(/\s+[—–]\s+|:\s+/)[0];
    const title = seoText(source.length > 51 && clause.length >= 24 && clause.length <= 51 ? clause : source, 51);
    const paragraphs = post.content.split(/\n\s*\n/)
        .filter(value => !/^\s*(?:#{1,6}\s|!\[|```|\|)/.test(value))
        .map(prose);
    const candidates = [prose(post.metaDescription || ""), prose(post.excerpt), ...paragraphs];
    const chosen = candidates.find(text => text.length >= 60 && /\s/.test(text) && !/^(?:this is a submission|photo credit|image credit|read more\b)/i.test(text))
        || `Read ${originalTitle}. Explore the article and its linked sources on Aana.`;
    // Imported excerpts can already end halfway through a word. Recover the
    // full paragraph when available; otherwise omit the uncertain final token.
    const expanded = paragraphs.find(text => text.length > chosen.length && text.startsWith(chosen));
    const description = expanded || (chosen.length >= 100 && !/[.!?…]["”’']?$/.test(chosen)
        ? `${chosen.replace(/\s+\S+$/, "").replace(/[,;:—–-]+$/, "")}…` : chosen);
    return { title, description: seoText(description, 154) };
}

export function articleAuthor(name: string) {
    return /^aana(?:\s+(?:team|editorial|editorial team))?$/i.test(name.trim())
        ? { "@type": "Organization", name: "Aana", url: SITE_URL }
        : { "@type": "Person", name };
}

export const jsonLD = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
