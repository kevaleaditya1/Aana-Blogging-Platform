import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminNewsPage() {
    const news = await prisma.newsItem.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
    });

    const stats = {
        total: await prisma.newsItem.count(),
        today: await prisma.newsItem.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
            }
        }),
        subscribers: await prisma.newsletterSubscriber.count({
            where: { isActive: true }
        }),
    };

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">News Management</h1>
                <p className="text-muted-foreground">
                    Manage AI-curated news items
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Total News</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.total}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.today}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Subscribers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.subscribers}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
                <form action="/api/admin/trigger-news" method="POST">
                    <Button type="submit">Fetch News Now</Button>
                </form>
                <form action="/api/admin/trigger-newsletter" method="POST">
                    <Button type="submit" variant="outline">Send Newsletter</Button>
                </form>
                <form action="/api/admin/trigger-blog-posts" method="POST">
                    <Button type="submit" variant="secondary">🤖 Generate Blog Posts</Button>
                </form>
                <form action="/api/admin/update-old-posts" method="POST">
                    <Button type="submit" variant="outline">🔄 Update Old Posts</Button>
                </form>
            </div>

            {/* News Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent News Items</CardTitle>
                    <CardDescription>Latest 50 news items</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-2">Title</th>
                                    <th className="text-left p-2">Source</th>
                                    <th className="text-left p-2">Category</th>
                                    <th className="text-left p-2">AI Score</th>
                                    <th className="text-left p-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {news.map((item) => (
                                    <tr key={item.id} className="border-b hover:bg-muted/50">
                                        <td className="p-2">
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline line-clamp-2"
                                            >
                                                {item.title}
                                            </a>
                                        </td>
                                        <td className="p-2">
                                            <Badge variant="secondary">{item.source}</Badge>
                                        </td>
                                        <td className="p-2">
                                            <Badge>{item.category}</Badge>
                                        </td>
                                        <td className="p-2">
                                            {item.aiScore ? (item.aiScore * 100).toFixed(0) + '%' : 'N/A'}
                                        </td>
                                        <td className="p-2 text-sm text-muted-foreground">
                                            {new Date(item.publishedAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
