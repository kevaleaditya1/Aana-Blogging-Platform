// Amazon Affiliate Link Helper
// Replace YOUR_AFFILIATE_ID with your actual Amazon Associates ID

export const AMAZON_AFFILIATE_ID = "kevaleaditya1-21";

/**
 * Generate Amazon affiliate link
 * @param asin - Amazon Standard Identification Number (found in product URL)
 * @param tag - Your affiliate tag (optional, uses default if not provided)
 * @returns Complete affiliate URL
 */
export function generateAmazonLink(asin: string, tag?: string): string {
    const affiliateTag = tag || AMAZON_AFFILIATE_ID;
    return `https://www.amazon.com/dp/${asin}?tag=${affiliateTag}`;
}

/**
 * Extract ASIN from Amazon URL
 * @param url - Amazon product URL
 * @returns ASIN or null
 */
export function extractASIN(url: string): string | null {
    const patterns = [
        /\/dp\/([A-Z0-9]{10})/,
        /\/gp\/product\/([A-Z0-9]{10})/,
        /\/ASIN\/([A-Z0-9]{10})/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return null;
}

/**
 * Convert regular Amazon URL to affiliate link
 * @param url - Regular Amazon product URL
 * @param tag - Your affiliate tag (optional)
 * @returns Affiliate URL or original URL if ASIN not found
 */
export function convertToAffiliateLink(url: string, tag?: string): string {
    const asin = extractASIN(url);
    if (!asin) return url;
    return generateAmazonLink(asin, tag);
}

/**
 * Generate Amazon search link with affiliate tag
 * @param searchQuery - Search term
 * @param tag - Your affiliate tag (optional)
 * @returns Amazon search URL with affiliate tag
 */
export function generateAmazonSearchLink(searchQuery: string, tag?: string): string {
    const affiliateTag = tag || AMAZON_AFFILIATE_ID;
    const encodedQuery = encodeURIComponent(searchQuery);
    return `https://www.amazon.com/s?k=${encodedQuery}&tag=${affiliateTag}`;
}

// Example usage:
// const link = generateAmazonLink("B08N5WRWNW"); // iPhone 13 ASIN
// const searchLink = generateAmazonSearchLink("wireless earbuds");
