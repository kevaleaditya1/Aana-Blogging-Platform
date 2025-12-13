"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, MessageCircle } from "lucide-react";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        image?: string;
    };
}

interface CommentSectionProps {
    postSlug: string;
}

export function CommentSection({ postSlug }: CommentSectionProps) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [postSlug]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/comments?postSlug=${postSlug}`);
            const data = await response.json();
            setComments(data.comments || []);
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const response = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postSlug,
                    content: newComment,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setComments([data.comment, ...comments]);
                setNewComment("");
            }
        } catch (error) {
            console.error("Failed to post comment:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm("Delete this comment?")) return;

        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setComments(comments.filter((c) => c.id !== commentId));
            }
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };

    return (
        <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageCircle className="h-6 w-6" />
                Comments ({comments.length})
            </h2>

            {/* Add Comment Form */}
            {session?.user ? (
                <Card className="p-4 mb-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full min-h-[100px] p-3 rounded-md border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={submitting}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={submitting || !newComment.trim()}>
                                {submitting ? "Posting..." : "Post Comment"}
                            </Button>
                        </div>
                    </form>
                </Card>
            ) : (
                <Card className="p-6 mb-6 text-center">
                    <p className="text-muted-foreground mb-4">
                        Sign in to join the conversation
                    </p>
                    <Button asChild>
                        <Link href="/login">Sign In</Link>
                    </Button>
                </Card>
            )}

            {/* Comments List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="p-4 animate-pulse">
                            <div className="h-4 bg-secondary rounded w-1/4 mb-2" />
                            <div className="h-3 bg-secondary rounded w-full" />
                        </Card>
                    ))}
                </div>
            ) : comments.length === 0 ? (
                <Card className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">
                        No comments yet. Be the first to comment!
                    </p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <Card key={comment.id} className="p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1">
                                    {comment.user.image ? (
                                        <img
                                            src={comment.user.image}
                                            alt={comment.user.name}
                                            className="h-10 w-10 rounded-full"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-sm font-medium">
                                                {comment.user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium">{comment.user.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                                    </div>
                                </div>
                                {(session?.user?.id === comment.user.id ||
                                    session?.user?.role === "ADMIN") && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(comment.id)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
