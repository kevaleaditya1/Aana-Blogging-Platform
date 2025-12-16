"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Search, ArrowLeft } from "lucide-react";

interface Post {
    slug: string;
    title: string;
    date: string;
    category: string;
    excerpt: string;
}

export default function AllPostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        filterPosts();
    }, [searchQuery, selectedCategory, posts]);

    const fetchPosts = async () => {
        try {
            const response = await fetch("/api/admin/posts");
            const data = await response.json();
            setPosts(data.posts || []);
            setFilteredPosts(data.posts || []);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterPosts = () => {
        let filtered = posts;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== "all") {
            filtered = filtered.filter(post => post.category === selectedCategory);
        }

        setFilteredPosts(filtered);
    };

    const handleDelete = async (slug: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            const response = await fetch(`/api/admin/posts/${slug}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchPosts();
            } else {
                alert("Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post");
        }
    };

    // Get unique categories
    const categories = ["all", ...Array.from(new Set(posts.map(post => post.category)))];

    if (loading) {
        return (
            <div className="container px-4 md:px-6 py-12">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading posts...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container px-4 md:px-6 py-8 md:py-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Link>
                        </Button>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">All Posts</h1>
                    <p className="text-muted-foreground mt-2">Manage all your blog posts</p>
                </div>
                <Button asChild>
                    <Link href="/admin/posts/new">
                        <Plus className="h-4 w-4 mr-2" />
                        New Post
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category === "all" ? "All Categories" : category}
                                </option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Posts List */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Posts ({filteredPosts.length})</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground mb-4">
                                {searchQuery || selectedCategory !== "all"
                                    ? "No posts found matching your filters"
                                    : "No posts yet"}
                            </p>
                            {!searchQuery && selectedCategory === "all" && (
                                <Button asChild>
                                    <Link href="/admin/posts/new">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Your First Post
                                    </Link>
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredPosts.map((post) => (
                                <div
                                    key={post.slug}
                                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-secondary/50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold mb-1">{post.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Badge variant="secondary">{post.category}</Badge>
                                            <span>•</span>
                                            <span>{post.date}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" variant="outline" asChild>
                                            <Link href={`/blog/${post.slug}`} target="_blank">
                                                View
                                            </Link>
                                        </Button>
                                        <Button size="sm" variant="ghost" asChild>
                                            <Link href={`/admin/posts/${post.slug}/edit`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDelete(post.slug)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
