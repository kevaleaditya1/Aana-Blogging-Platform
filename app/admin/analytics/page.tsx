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
import { ArrowLeft, TrendingUp, Eye, Users, MessageSquare, FileText } from "lucide-react";

interface AnalyticsData {
    totalPosts: number;
    totalUsers: number;
    totalComments: number;
    popularPosts: Array<{
        slug: string;
        title: string;
        category: string;
    }>;
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await fetch("/api/admin/analytics");
            const analyticsData = await response.json();
            setData(analyticsData);
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container px-4 md:px-6 py-12">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading analytics...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container px-4 md:px-6 py-8 md:py-12">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground mt-2">View your blog statistics and insights</p>
            </div>

            {/* Statistics Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card className="hover-lift">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.totalPosts || 0}</div>
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
                        <div className="text-2xl font-bold">{data?.totalUsers || 0}</div>
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
                        <div className="text-2xl font-bold">{data?.totalComments || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total comments
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover-lift">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data?.totalPosts ? ((data.totalComments / data.totalPosts) || 0).toFixed(1) : 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Comments per post
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Popular Posts */}
            <Card>
                <CardHeader>
                    <CardTitle>Popular Posts</CardTitle>
                    <CardDescription>Your most engaging content</CardDescription>
                </CardHeader>
                <CardContent>
                    {data?.popularPosts && data.popularPosts.length > 0 ? (
                        <div className="space-y-4">
                            {data.popularPosts.map((post, index) => (
                                <div
                                    key={post.slug}
                                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-secondary/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-sm font-bold text-primary">#{index + 1}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{post.title}</h3>
                                            <p className="text-sm text-muted-foreground">{post.category}</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" asChild>
                                        <Link href={`/blog/${post.slug}`} target="_blank">
                                            View
                                        </Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No posts yet</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
