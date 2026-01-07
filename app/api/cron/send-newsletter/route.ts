import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewsletter } from '@/lib/email/newsletter';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        console.log('Starting newsletter send...');

        // Get top news from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const featuredNews = await prisma.newsItem.findMany({
            where: {
                publishedAt: {
                    gte: sevenDaysAgo
                }
            },
            orderBy: { aiScore: 'desc' },
            take: 5,
            select: {
                id: true,
                title: true,
                summary: true,
                link: true,
                image: true,
                source: true,
                category: true,
            }
        });

        if (featuredNews.length === 0) {
            return NextResponse.json({
                message: 'No news to send',
                sent: 0
            });
        }

        // Get active subscribers
        const subscribers = await prisma.newsletterSubscriber.findMany({
            where: {
                isActive: true,
                verifiedAt: { not: null }
            },
            select: {
                email: true,
                name: true,
            }
        });

        if (subscribers.length === 0) {
            return NextResponse.json({
                message: 'No subscribers',
                sent: 0
            });
        }

        console.log(`Sending to ${subscribers.length} subscribers...`);

        // Send emails in batches of 50
        const batchSize = 50;
        let sent = 0;

        for (let i = 0; i < subscribers.length; i += batchSize) {
            const batch = subscribers.slice(i, i + batchSize);
            const emails = batch.map(s => s.email);

            try {
                await sendNewsletter(
                    emails,
                    '🚀 Your Weekly Tech Digest - Aana',
                    featuredNews
                );

                sent += batch.length;
                console.log(`Sent batch ${Math.floor(i / batchSize) + 1}: ${batch.length} emails`);

                // Rate limiting - wait 1 second between batches
                if (i + batchSize < subscribers.length) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (error) {
                console.error(`Error sending batch:`, error);
            }
        }

        // Save to queue for tracking
        await prisma.newsletterQueue.create({
            data: {
                subject: '🚀 Your Weekly Tech Digest - Aana',
                content: JSON.stringify(featuredNews),
                recipients: subscribers.map(s => s.email),
                scheduledFor: new Date(),
                sentAt: new Date(),
                status: 'sent',
            }
        });

        console.log(`Newsletter sent to ${sent} subscribers`);

        return NextResponse.json({
            success: true,
            sent,
            total: subscribers.length,
            newsCount: featuredNews.length
        });

    } catch (error) {
        console.error('Newsletter send error:', error);
        return NextResponse.json(
            { error: 'Failed to send newsletter' },
            { status: 500 }
        );
    }
}
