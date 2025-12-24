"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Eye } from "lucide-react";
import { useEffect, useState } from "react";

interface PopularPost {
    slug: string;
    title: string;
    category: string;
    views?: number;
}

export function PopularPosts() {
    const [posts, setPosts] = useState<PopularPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPopularPosts() {
            try {
                const response = await fetch("/api/popular-posts");
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error("Error fetching popular posts:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPopularPosts();
    }, []);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Popular Posts
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 bg-muted animate-pulse rounded" />
                            <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (posts.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Popular Posts
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {posts.map((post, index) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="block group"
                    >
                        <div className="space-y-2">
                            <div className="flex items-start gap-2">
                                <span className="text-2xl font-bold text-muted-foreground/30">
                                    {index + 1}
                                </span>
                                <div className="flex-1 space-y-1">
                                    <h4 className="font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                        {post.title}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                            {post.category}
                                        </Badge>
                                        {post.views && (
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Eye className="h-3 w-3" />
                                                {post.views}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}
