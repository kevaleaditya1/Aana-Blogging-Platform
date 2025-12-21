"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Post } from "@/types";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState<string>("");
    const [resultCount, setResultCount] = useState(0);

    useEffect(() => {
        async function performSearch() {
            if (!query) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const url = `/api/search?q=${encodeURIComponent(query)}${category ? `&category=${encodeURIComponent(category)}` : ""
                    }`;
                const response = await fetch(url);
                const data = await response.json();
                setResults(data.results || []);
                setResultCount(data.count || 0);
            } catch (error) {
                console.error("Search error:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }

        performSearch();
    }, [query, category]);

    return (
        <div className="container px-4 md:px-6 py-12 md:py-20">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
                    Search Results
                </h1>
                {query && (
                    <p className="text-muted-foreground text-lg">
                        Showing results for: <span className="font-semibold text-foreground">"{query}"</span>
                    </p>
                )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Filter by:</span>
                </div>
                <Select value={category || "all"} onValueChange={(value) => setCategory(value === "all" ? "" : value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="phones">Phones</SelectItem>
                        <SelectItem value="gadgets">Gadgets</SelectItem>
                        <SelectItem value="ai tools">AI Tools</SelectItem>
                        <SelectItem value="guides">Guides</SelectItem>
                        <SelectItem value="news">News</SelectItem>
                    </SelectContent>
                </Select>
                {resultCount > 0 && (
                    <span className="text-sm text-muted-foreground">
                        {resultCount} {resultCount === 1 ? "result" : "results"} found
                    </span>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-12">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                    <p className="mt-4 text-muted-foreground">Searching...</p>
                </div>
            )}

            {/* No Query */}
            {!loading && !query && (
                <div className="text-center py-12">
                    <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Start Searching</h2>
                    <p className="text-muted-foreground">
                        Use the search bar above to find articles, reviews, and guides.
                    </p>
                </div>
            )}

            {/* No Results */}
            {!loading && query && results.length === 0 && (
                <div className="text-center py-12">
                    <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No Results Found</h2>
                    <p className="text-muted-foreground mb-4">
                        We couldn't find any posts matching "{query}"
                        {category && ` in ${category}`}.
                    </p>
                    <Button asChild variant="outline">
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            )}

            {/* Results Grid */}
            {!loading && results.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {results.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="block h-full">
                            <Card className="flex flex-col h-full hover-lift cursor-pointer transition-all">
                                <CardHeader className="p-0">
                                    <div className="aspect-[16/9] w-full bg-gradient-to-br from-muted/80 to-muted rounded-t-lg overflow-hidden relative">
                                        {post.coverImage ? (
                                            <Image
                                                src={post.coverImage}
                                                alt={post.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                <span className="font-medium">{post.title}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 p-6">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <Badge variant="secondary" className="text-xs">
                                            {post.category}
                                        </Badge>
                                        {post.trending && (
                                            <Badge variant="destructive" className="text-xs">
                                                🔥 Trending
                                            </Badge>
                                        )}
                                        <span className="text-xs text-muted-foreground">
                                            {post.date}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
