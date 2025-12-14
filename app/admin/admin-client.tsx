"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
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
import { Plus, Edit, Trash2, LogOut } from "lucide-react";

interface Post {
    slug: string;
    title: string;
    date: string;
    category: string;
    excerpt: string;
}

interface AdminDashboardClientProps {
    session: any;
}

export default function AdminDashboardClient({ session }: AdminDashboardClientProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch("/api/admin/posts");
            const data = await response.json();
            setPosts(data.posts || []);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
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

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/admin/login" });
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b">
                <div className="container px-4 md:px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your blog posts
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href="/admin/posts/new">
                                <Plus className="h-4 w-4 mr-2" />
                                New Post
                            </Link>
                        </Button>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container px-4 md:px-6 py-8">
                {loading ? (
                    <p className="text-center text-muted-foreground">Loading posts...</p>
                ) : posts.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <p className="text-muted-foreground mb-4">No posts yet</p>
                            <Button asChild>
                                <Link href="/admin/posts/new">Create your first post</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {posts.map((post) => (
                            <Card key={post.slug}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="mb-2">{post.title}</CardTitle>
                                            <CardDescription>{post.excerpt}</CardDescription>
                                            <div className="flex items-center gap-2 mt-3">
                                                <Badge variant="secondary">{post.category}</Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {post.date}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link href={`/admin/posts/${post.slug}/edit`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(post.slug)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
