const sourceHosts = new Set([
    "espn.com", "cnbc.com", "bloomberg.com", "digit.in", "dev.to", "github.com",
    "yourstory.com", "hollywoodreporter.com", "bbc.co.uk", "bbc.com", "sciencedaily.com",
    "wired.com", "techcrunch.com", "theverge.com", "arstechnica.com", "engadget.com",
    "inc42.com", "entrackr.com", "moneycontrol.com", "economictimes.indiatimes.com",
    "analyticsindiamag.com", "infoq.com", "dzone.com", "baeldung.com", "hashnode.com",
    "newsletter.pragmaticengineer.com", "gsmarena.com", "91mobiles.com", "gadgets360.com",
    "rtings.com", "notebookcheck.net", "tomshardware.com", "tomsguide.com", "cnet.com",
]);

function decode(value: string) {
    let result = value;
    for (let i = 0; i < 3; i++) result = result.replace(/&amp;|&#0*38;/gi, "&").replace(/&quot;/gi, '"').replace(/&#(?:39|x27);/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
    return result;
}

export function articleImage(value?: string | null, base?: string): string {
    if (!value || /(?:default-blog-cover|social-default\.png)/i.test(value)) return "";
    if (!base && value.startsWith("/") && !value.startsWith("//")) return value;
    try {
        const url = new URL(decode(value), base);
        return url.protocol === "https:" && !url.username && !url.password ? url.href : "";
    } catch { return ""; }
}

function attributes(tag: string): Record<string, string> {
    return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(match => [match[1].toLowerCase(), decode(match[2] ?? match[3])]));
}

export function extractArticleImage(content?: string | null, base?: string): string {
    const html = decode(content || "");
    for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
        const props = attributes(tag);
        if (/^(og:image(?::url|:secure_url)?|twitter:image(?::src)?)$/i.test(props.property || props.name || "")) {
            const image = articleImage(props.content, base);
            if (image) return image;
        }
    }
    for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
        const props = attributes(tag);
        const image = articleImage(props["data-src"] || props.src, base);
        if (image) return image;
    }
    return articleImage(html.match(/!\[[^\]]*\]\((https?:\/\/[^\s)]+)/)?.[1], base);
}

export async function originalArticleImage(source: string): Promise<string> {
    try {
        let url = new URL(source);
        // Only follow existing, known publisher origins; never act as an arbitrary fetch proxy.
        for (let redirect = 0; redirect < 3; redirect++) {
            if (url.protocol !== "https:" || !sourceHosts.has(url.hostname.replace(/^www\./, ""))) return "";
            const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(5000), headers: { Accept: "text/html" } });
            if (response.status >= 300 && response.status < 400) {
                const location = response.headers.get("location");
                if (!location) return "";
                url = new URL(location, url); continue;
            }
            if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) return "";
            // Only the source's explicitly declared social preview qualifies as its cover.
            const html = (await response.text()).slice(0, 2000000);
            return extractArticleImage((html.match(/<meta\b[^>]*>/gi) || []).join("\n"), url.href);
        }
    } catch { /* A blocked publisher must not prevent publishing the article. */ }
    return "";
}
