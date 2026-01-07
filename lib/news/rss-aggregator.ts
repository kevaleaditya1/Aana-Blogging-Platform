import Parser from 'rss-parser';

interface RSSFeed {
    url: string;
    source: string;
    category: string;
}

const RSS_FEEDS: RSSFeed[] = [
    // Tech News
    { url: 'https://techcrunch.com/feed/', source: 'TechCrunch', category: 'Tech' },
    { url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge', category: 'Tech' },
    { url: 'https://www.engadget.com/rss.xml', source: 'Engadget', category: 'Tech' },

    // Business & Finance
    { url: 'https://feeds.bloomberg.com/markets/news.rss', source: 'Bloomberg', category: 'Business' },
    { url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', source: 'CNBC', category: 'Finance' },
    { url: 'https://www.forbes.com/real-time/feed2/', source: 'Forbes', category: 'Business' },

    // Entertainment
    { url: 'https://variety.com/feed/', source: 'Variety', category: 'Entertainment' },
    { url: 'https://www.hollywoodreporter.com/feed/', source: 'Hollywood Reporter', category: 'Entertainment' },

    // Sports
    { url: 'https://www.espn.com/espn/rss/news', source: 'ESPN', category: 'Sports' },
    { url: 'https://www.si.com/rss/si_topstories.rss', source: 'Sports Illustrated', category: 'Sports' },

    // Science & Health
    { url: 'https://www.sciencedaily.com/rss/all.xml', source: 'Science Daily', category: 'Science' },
    { url: 'https://www.livescience.com/feeds/all', source: 'Live Science', category: 'Science' },
    { url: 'https://www.healthline.com/rss', source: 'Healthline', category: 'Health' },

    // Lifestyle & Travel
    { url: 'https://www.travelandleisure.com/rss', source: 'Travel + Leisure', category: 'Travel' },
    { url: 'https://www.foodnetwork.com/feeds/latest-recipes.xml', source: 'Food Network', category: 'Food' },

    // World News
    { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC World', category: 'World' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', source: 'NY Times', category: 'World' },
];

interface NewsItem {
    title: string;
    link: string;
    summary: string;
    content?: string;
    image?: string;
    source: string;
    category: string;
    publishedAt: Date;
}

function extractImageFromContent(content?: string): string | undefined {
    if (!content) return undefined;

    // Try to extract image from HTML content
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) return imgMatch[1];

    // Try to extract from markdown
    const mdMatch = content.match(/!\[.*?\]\((.*?)\)/);
    if (mdMatch) return mdMatch[1];

    return undefined;
}

export async function fetchRSSFeeds(): Promise<NewsItem[]> {
    const parser = new Parser({
        customFields: {
            item: [
                ['media:content', 'media'],
                ['content:encoded', 'contentEncoded'],
            ]
        }
    });

    const allNews: NewsItem[] = [];

    for (const feed of RSS_FEEDS) {
        try {
            console.log(`Fetching ${feed.source}...`);
            const parsed = await parser.parseURL(feed.url);

            const items = parsed.items.slice(0, 10).map(item => {
                // Extract image from various sources
                let image = item.enclosure?.url;
                if (!image && item.media) {
                    image = (item.media as any)?.$?.url;
                }
                if (!image) {
                    image = extractImageFromContent(item.content || item.contentEncoded);
                }

                return {
                    title: item.title || 'Untitled',
                    link: item.link || '',
                    summary: item.contentSnippet || item.summary || '',
                    content: item.content || item.contentEncoded || '',
                    image,
                    source: feed.source,
                    category: feed.category,
                    publishedAt: new Date(item.pubDate || Date.now()),
                };
            });

            allNews.push(...items);
            console.log(`✓ Fetched ${items.length} items from ${feed.source}`);
        } catch (error) {
            console.error(`✗ Error fetching ${feed.source}:`, error);
        }
    }

    return allNews;
}

export async function fetchSingleFeed(feedUrl: string, source: string): Promise<NewsItem[]> {
    const parser = new Parser();

    try {
        const parsed = await parser.parseURL(feedUrl);

        return parsed.items.map(item => ({
            title: item.title || 'Untitled',
            link: item.link || '',
            summary: item.contentSnippet || item.summary || '',
            content: item.content || '',
            image: item.enclosure?.url || extractImageFromContent(item.content),
            source,
            category: 'Tech',
            publishedAt: new Date(item.pubDate || Date.now()),
        }));
    } catch (error) {
        console.error(`Error fetching feed from ${source}:`, error);
        return [];
    }
}
