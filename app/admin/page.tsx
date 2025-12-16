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
import {
    Plus,
    Edit,
    Trash2,
    LogOut,
    FileText,
    Users,
    MessageSquare,
    TrendingUp,
    Settings,
    BarChart3
} from "lucide-react";

interface Post {
    slug: string;
    title: string;
    date: string;
    category: string;
    excerpt: string;
}

interface DashboardStats {
    totalPosts: number;
    totalUsers: number;
    totalComments: number;
}

export default function AdminDashboard() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalPosts: 0,
        totalUsers: 0,
        totalComments: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch analytics data (includes posts, users, comments counts)
            const analyticsResponse = await fetch("/api/admin/analytics");
            const analyticsData = await analyticsResponse.json();

            // Fetch recent posts
            const postsResponse = await fetch("/api/admin/posts");
            const postsData = await postsResponse.json();
            const allPosts = postsData.posts || [];
            setPosts(allPosts.slice(0, 5)); // Show only 5 recent posts

            // Set stats from analytics
            setStats({
                totalPosts: analyticsData.totalPosts || 0,
                totalUsers: analyticsData.totalUsers || 0,
                totalComments: analyticsData.totalComments || 0,
            });
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
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
                fetchDashboardData();
            } else {
                alert("Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post");
        }
    };

    if (loading) {
        return (
            <div className="container px-4 md:px-6 py-12">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading dashboard...</p>
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
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-2">Manage your blog content and settings</p>
                </div>
                <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card className="hover-lift">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalPosts}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Published articles
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover-lift">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Registered users
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover-lift">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Comments</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalComments}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total comments
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6 mb-8">
                <Button asChild className="h-auto py-6 flex-col gap-2">
                    <Link href="/admin/posts/new">
                        <Plus className="h-6 w-6" />
                        <span>New Post</span>
                    </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto py-6 flex-col gap-2">
                    <Link href="/admin/posts">
                        <FileText className="h-6 w-6" />
                        <span>All Posts</span>
                    </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto py-6 flex-col gap-2">
                    <Link href="/admin/users">
                        <Users className="h-6 w-6" />
                        <span>Users</span>
                    </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto py-6 flex-col gap-2">
                    <Link href="/admin/comments">
                        <MessageSquare className="h-6 w-6" />
                        <span>Comments</span>
                    </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto py-6 flex-col gap-2">
                    <Link href="/admin/media">
                        <TrendingUp className="h-6 w-6" />
                        <span>Media</span>
                    </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto py-6 flex-col gap-2">
                    <Link href="/admin/analytics">
                        <BarChart3 className="h-6 w-6" />
                        <span>Analytics</span>
                    </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto py-6 flex-col gap-2">
                    <Link href="/admin/settings">
                        <Settings className="h-6 w-6" />
                        <span>Settings</span>
                    </Link>
                </Button>
            </div>

            {/* Recent Posts */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Recent Posts</CardTitle>
                            <CardDescription>Your latest published articles</CardDescription>
                        </div>
                        <Button asChild size="sm">
                            <Link href="/admin/posts">View All</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {posts.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">No posts yet</p>
                            <Button asChild>
                                <Link href="/admin/posts/new">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Your First Post
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <div
                                    key={post.slug}
                                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-secondary/50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold mb-1">{post.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Badge variant="secondary">{post.category}</Badge>
                                            <span>•</span>
                                            <span>{post.date}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
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
