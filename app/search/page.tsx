"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";

function SearchContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<any[]>([]);
    const [allPosts, setAllPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        if (query.trim() && allPosts.length > 0) {
            performSearch(query);
        } else {
            setResults([]);
        }
    }, [query, allPosts]);

    const fetchPosts = async () => {
        try {
            const response = await fetch("/api/posts");
            const data = await response.json();
            setAllPosts(data.posts || []);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const performSearch = (searchQuery: string) => {
        const lowercaseQuery = searchQuery.toLowerCase();
        const filtered = allPosts.filter((post) => {
            return (
                post.title.toLowerCase().includes(lowercaseQuery) ||
                post.excerpt.toLowerCase().includes(lowercaseQuery) ||
                post.category.toLowerCase().includes(lowercaseQuery)
            );
        });
        setResults(filtered);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(query);
    };

    return (
        <div className="container px-4 md:px-6 py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-6 flex items-center gap-2">
                        <Search className="h-8 w-8" />
                        Search Articles
                    </h1>
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by title, category, or tags..."
                            className="pl-10 h-12 text-lg"
                            autoFocus
                        />
                    </form>
                </div>

                {query.trim() && (
                    <div className="mb-4 text-muted-foreground">
                        {results.length} {results.length === 1 ? "result" : "results"} for "{query}"
                    </div>
                )}

                {results.length === 0 && query.trim() ? (
                    <Card className="p-12 text-center">
                        <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h2 className="text-xl font-semibold mb-2">No results found</h2>
                        <p className="text-muted-foreground mb-6">
                            Try different keywords or browse all articles
                        </p>
                        <Button asChild>
                            <Link href="/">Browse All Articles</Link>
                        </Button>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {results.map((post) => (
                            <Card key={post.slug} className="group hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge>{post.category}</Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {post.date}
                                        </span>
                                    </div>
                                    <Link href={`/blog/${post.slug}`}>
                                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h3>
                                    </Link>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center gap-2 flex-wrap mb-3">
                                        {post.tags.map((tag: string) => (
                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/blog/${post.slug}`} className="gap-2">
                                            Read Article <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="container px-4 md:px-6 py-12 md:py-20"><div className="max-w-4xl mx-auto">Loading...</div></div>}>
            <SearchContent />
        </Suspense>
    );
}
