"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookmarkCheck, Trash2, ArrowRight } from "lucide-react";

interface Bookmark {
    id: string;
    postSlug: string;
    createdAt: string;
}

interface Post {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
}

export default function BookmarksPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchData();
        }
    }, [status]);

    const fetchData = async () => {
        try {
            // Fetch bookmarks
            const bookmarksRes = await fetch("/api/bookmarks");
            const bookmarksData = await bookmarksRes.json();
            setBookmarks(bookmarksData.bookmarks || []);

            // Fetch all posts
            const postsRes = await fetch("/api/posts");
            const postsData = await postsRes.json();
            setPosts(postsData.posts || []);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const removeBookmark = async (postSlug: string) => {
        try {
            const response = await fetch(`/api/bookmarks?postSlug=${postSlug}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setBookmarks(bookmarks.filter((b) => b.postSlug !== postSlug));
            }
        } catch (error) {
            console.error("Failed to remove bookmark:", error);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="container px-4 md:px-6 py-12 md:py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="h-8 w-48 bg-secondary rounded animate-pulse mb-8" />
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-6">
                                    <div className="h-6 bg-secondary rounded w-3/4 mb-2" />
                                    <div className="h-4 bg-secondary rounded w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const bookmarkedPosts = posts.filter((post) =>
        bookmarks.some((b) => b.postSlug === post.slug)
    );

    return (
        <div className="container px-4 md:px-6 py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
                        <BookmarkCheck className="h-8 w-8" />
                        My Bookmarks
                    </h1>
                    <p className="text-muted-foreground">
                        Articles you've saved for later
                    </p>
                </div>

                {bookmarkedPosts.length === 0 ? (
                    <Card className="p-12 text-center">
                        <BookmarkCheck className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h2 className="text-xl font-semibold mb-2">No bookmarks yet</h2>
                        <p className="text-muted-foreground mb-6">
                            Start saving articles to read them later
                        </p>
                        <Button asChild>
                            <Link href="/">Browse Articles</Link>
                        </Button>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {bookmarkedPosts.map((post) => (
                            <Card key={post.slug} className="group hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
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
                                            <div className="flex items-center gap-3">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/blog/${post.slug}`} className="gap-2">
                                                        Read Article <ArrowRight className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeBookmark(post.slug)}
                                                    className="text-destructive hover:text-destructive gap-2"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
