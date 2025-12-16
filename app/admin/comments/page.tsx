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
import { ArrowLeft, Search, Trash2, Check, X } from "lucide-react";

interface Comment {
    id: string;
    content: string;
    postSlug: string;
    createdAt: string;
    user: {
        name: string | null;
        email: string;
    };
}

export default function CommentsPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchComments();
    }, []);

    useEffect(() => {
        filterComments();
    }, [searchQuery, comments]);

    const fetchComments = async () => {
        try {
            const response = await fetch("/api/admin/comments");
            const data = await response.json();
            setComments(data.comments || []);
            setFilteredComments(data.comments || []);
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterComments = () => {
        let filtered = comments;

        if (searchQuery) {
            filtered = filtered.filter(comment =>
                comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                comment.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                comment.postSlug.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredComments(filtered);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        try {
            const response = await fetch(`/api/admin/comments/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchComments();
            } else {
                alert("Failed to delete comment");
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("Failed to delete comment");
        }
    };

    if (loading) {
        return (
            <div className="container px-4 md:px-6 py-12">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading comments...</p>
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
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Comments Management</h1>
                    <p className="text-muted-foreground mt-2">Moderate and manage user comments</p>
                </div>
            </div>

            {/* Search */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Search Comments</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by content, author, or post..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Comments List */}
            <Card>
                <CardHeader>
                    <CardTitle>Comments ({filteredComments.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredComments.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                {searchQuery ? "No comments found matching your search" : "No comments yet"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredComments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="p-4 rounded-lg border hover:bg-secondary/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-sm">
                                                    {comment.user.name || "Anonymous"}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {comment.user.email}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                On post: <Link href={`/blog/${comment.postSlug}`} className="text-primary hover:underline">{comment.postSlug}</Link>
                                            </p>
                                            <p className="text-sm">{comment.content}</p>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {new Date(comment.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDelete(comment.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
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
