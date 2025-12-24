"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    BarChart3,
    Users,
    FileText,
    MessageSquare,
    Bookmark,
    TrendingUp,
    Loader2,
} from "lucide-react";

interface AnalyticsData {
    overview: {
        totalPosts: number;
        totalSubscribers: number;
        totalComments: number;
        totalBookmarks: number;
        totalUsers: number;
    };
    postsByCategory: Record<string, number>;
    topTags: Array<{ tag: string; count: number }>;
    recentComments: Array<{
        id: string;
        content: string;
        userName: string;
        userEmail: string;
        createdAt: string;
        postSlug: string;
    }>;
}

export function AnalyticsDashboard() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const response = await fetch("/api/admin/analytics");
                const analyticsData = await response.json();
                setData(analyticsData);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center p-12">
                <p className="text-muted-foreground">Failed to load analytics data</p>
            </div>
        );
    }

    const stats = [
        {
            title: "Total Posts",
            value: data.overview.totalPosts,
            icon: FileText,
            color: "text-blue-500",
        },
        {
            title: "Subscribers",
            value: data.overview.totalSubscribers,
            icon: Users,
            color: "text-green-500",
        },
        {
            title: "Comments",
            value: data.overview.totalComments,
            icon: MessageSquare,
            color: "text-purple-500",
        },
        {
            title: "Bookmarks",
            value: data.overview.totalBookmarks,
            icon: Bookmark,
            color: "text-orange-500",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Posts by Category */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Posts by Category
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(data.postsByCategory)
                                .sort((a, b) => b[1] - a[1])
                                .map(([category, count]) => (
                                    <div key={category} className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{category}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 bg-primary rounded-full" style={{ width: `${(count / data.overview.totalPosts) * 100}px` }} />
                                            <span className="text-sm text-muted-foreground">{count}</span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Tags */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Top Tags
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {data.topTags.map(({ tag, count }) => (
                                <Badge key={tag} variant="outline">
                                    {tag} ({count})
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Comments */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Recent Comments
                    </CardTitle>
                    <CardDescription>Latest comments from your readers</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.recentComments.map((comment) => (
                            <div key={comment.id} className="border-b pb-4 last:border-0">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-medium text-sm">{comment.userName}</p>
                                        <p className="text-xs text-muted-foreground">{comment.userEmail}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{comment.content}...</p>
                                <a
                                    href={`/blog/${comment.postSlug}`}
                                    className="text-xs text-primary hover:underline"
                                >
                                    View post →
                                </a>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
