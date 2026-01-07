import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

interface SearchParams {
    category?: string;
    page?: string;
}

export default async function NewsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const params = await searchParams;
    const category = params.category;
    const page = parseInt(params.page || '1');
    const perPage = 12;

    // Fetch news items
    const where = category ? { category } : {};

    const [news, total] = await Promise.all([
        prisma.newsItem.findMany({
            where,
            orderBy: { publishedAt: 'desc' },
            take: perPage,
            skip: (page - 1) * perPage,
        }),
        prisma.newsItem.count({ where }),
    ]);

    const totalPages = Math.ceil(total / perPage);

    // Get unique categories
    const categories = await prisma.newsItem.findMany({
        select: { category: true },
        distinct: ['category'],
    });

    return (
        <div className="container py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">Latest Tech News</h1>
                <p className="text-muted-foreground">
                    AI-curated tech news from top sources
                </p>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 mb-8 flex-wrap">
                <Link href="/news">
                    <Badge variant={!category ? 'default' : 'outline'}>
                        All
                    </Badge>
                </Link>
                {categories.map((cat) => (
                    <Link key={cat.category} href={`/news?category=${cat.category}`}>
                        <Badge variant={category === cat.category ? 'default' : 'outline'}>
                            {cat.category}
                        </Badge>
                    </Link>
                ))}
            </div>

            {/* News Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {news.map((item) => (
                    <a
                        key={item.id}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full"
                    >
                        <Card className="h-full hover:shadow-lg transition-shadow">
                            {item.image && (
                                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                            )}
                            <CardHeader>
                                <div className="flex gap-2 mb-2">
                                    <Badge variant="secondary" className="text-xs">
                                        {item.source}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        {item.category}
                                    </Badge>
                                </div>
                                <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                                <CardDescription className="text-xs">
                                    {new Date(item.publishedAt).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {item.summary}
                                </p>
                                <div className="flex gap-1 mt-3 flex-wrap">
                                    {item.tags.slice(0, 3).map((tag) => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </a>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {page > 1 && (
                        <Link
                            href={`/news?${category ? `category=${category}&` : ''}page=${page - 1}`}
                            className="px-4 py-2 border rounded hover:bg-muted"
                        >
                            Previous
                        </Link>
                    )}
                    <span className="px-4 py-2">
                        Page {page} of {totalPages}
                    </span>
                    {page < totalPages && (
                        <Link
                            href={`/news?${category ? `category=${category}&` : ''}page=${page + 1}`}
                            className="px-4 py-2 border rounded hover:bg-muted"
                        >
                            Next
                        </Link>
                    )}
                </div>
            )}

            {news.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No news items found.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        News will be automatically aggregated every 6 hours.
                    </p>
                </div>
            )}
        </div>
    );
}
