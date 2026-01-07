import { NextResponse } from 'next/server';
import { fetchRSSFeeds } from '@/lib/news/rss-aggregator';
import { processNewsItem } from '@/lib/ai/news-curator';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        console.log('Starting news aggregation...');

        // Fetch news from all RSS feeds
        const newsItems = await fetchRSSFeeds();
        console.log(`Fetched ${newsItems.length} news items`);

        let processed = 0;
        let skipped = 0;

        // Process each news item
        for (const item of newsItems) {
            try {
                // Check if already exists
                const existing = await prisma.newsItem.findUnique({
                    where: { link: item.link }
                });

                if (existing) {
                    skipped++;
                    continue;
                }

                // AI processing
                console.log(`Processing: ${item.title.substring(0, 50)}...`);
                const aiData = await processNewsItem({
                    title: item.title,
                    content: item.content || '',
                    summary: item.summary,
                });

                // Save to database
                await prisma.newsItem.create({
                    data: {
                        title: item.title,
                        summary: aiData.summary,
                        content: item.content,
                        link: item.link,
                        image: item.image,
                        source: item.source,
                        category: aiData.category,
                        tags: aiData.tags,
                        aiScore: aiData.aiScore,
                        publishedAt: item.publishedAt,
                    }
                });

                processed++;
                console.log(`✓ Saved: ${item.title.substring(0, 50)}...`);

                // Rate limiting - wait 1 second between AI calls
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.error(`Error processing item:`, error);
            }
        }

        console.log(`Aggregation complete: ${processed} processed, ${skipped} skipped`);

        return NextResponse.json({
            success: true,
            processed,
            skipped,
            total: newsItems.length
        });

    } catch (error) {
        console.error('News aggregation error:', error);
        return NextResponse.json(
            { error: 'Failed to aggregate news' },
            { status: 500 }
        );
    }
}
