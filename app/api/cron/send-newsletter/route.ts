import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewsletter } from '@/lib/email/newsletter';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    if (process.env.NEWSLETTER_CAMPAIGNS_ENABLED !== 'true') return NextResponse.json({ error: 'Newsletter campaigns are disabled until opt-in and unsubscribe verification is complete.' }, { status: 503 });

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

        const formattedNews = featuredNews.map(item => ({
            ...item,
            image: item.image ?? undefined,
        }));

        const issueDate = new Date();
        issueDate.setUTCDate(issueDate.getUTCDate() - issueDate.getUTCDay());
        const campaignKey = issueDate.toISOString().slice(0, 10);
        const result = await sendNewsletter(subscribers.map(subscriber => subscriber.email), 'Your Weekly Tech Digest - Aana', formattedNews, campaignKey);
        const queued = result.accepted.length;
        await prisma.newsletterQueue.create({
            data: {
                subject: 'Your Weekly Tech Digest - Aana', content: JSON.stringify(featuredNews),
                recipients: result.accepted.map(email => ({ email: email.email, providerId: email.id })),
                scheduledFor: new Date(), status: result.failed ? (queued ? 'partial' : 'failed') : 'queued',
            },
        });
        // An API acceptance is queued delivery, not proof of inbox delivery.
        return NextResponse.json({ success: result.failed === 0, queued, failed: result.failed, skipped: result.skipped, total: subscribers.length, newsCount: featuredNews.length }, { status: result.failed && !queued ? 502 : 200 });

    } catch (error) {
        console.error('Newsletter send error:', error);
        return NextResponse.json(
            { error: 'Failed to send newsletter' },
            { status: 500 }
        );
    }
}
