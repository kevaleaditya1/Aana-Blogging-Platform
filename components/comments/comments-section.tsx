"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Trash2, Reply } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        name: string | null;
        email: string | null;
        image: string | null;
    };
    replies?: Comment[];
}

interface CommentsSectionProps {
    postSlug: string;
}

export function CommentsSection({ postSlug }: CommentsSectionProps) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        fetchComments();
    }, [postSlug]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/comments?postSlug=${postSlug}`);
            const data = await response.json();
            setComments(data.comments || []);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !session) return;

        setLoading(true);
        try {
            const response = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: newComment,
                    postSlug,
                }),
            });

            if (response.ok) {
                setNewComment("");
                fetchComments();
            }
        } catch (error) {
            console.error("Error posting comment:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = useCallback(async (commentId: string) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchComments();
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    }, [fetchComments]);

    const handleReply = useCallback(async (parentId: string) => {
        if (!replyContent.trim() || !session) return;

        setLoading(true);
        try {
            const response = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: replyContent,
                    postSlug,
                    parentId,
                }),
            });

            if (response.ok) {
                setReplyContent("");
                setReplyTo(null);
                fetchComments();
            }
        } catch (error) {
            console.error("Error posting reply:", error);
        } finally {
            setLoading(false);
        }
    }, [replyContent, session, postSlug, fetchComments]);


    const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
        <div className={`${isReply ? "ml-12 mt-4" : "mt-6"}`}>
            <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.user.image || undefined} />
                    <AvatarFallback>
                        {comment.user.name?.charAt(0) || comment.user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="bg-secondary/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <span className="font-semibold text-sm">{comment.user.name || "Anonymous"}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                            {session && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(comment.id)}
                                    className="h-8 w-8 p-0"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                    </div>
                    {!isReply && session && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                            className="mt-2"
                        >
                            <Reply className="h-4 w-4 mr-2" />
                            Reply
                        </Button>
                    )}
                    {replyTo === comment.id && (
                        <div className="mt-3">
                            <Textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write a reply..."
                                className="min-h-[80px]"
                            />
                            <div className="flex gap-2 mt-2">
                                <Button
                                    onClick={() => handleReply(comment.id)}
                                    disabled={loading || !replyContent.trim()}
                                    size="sm"
                                >
                                    {loading ? "Posting..." : "Post Reply"}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setReplyTo(null);
                                        setReplyContent("");
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4">
                            {comment.replies.map((reply) => (
                                <CommentItem key={reply.id} comment={reply} isReply />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="mt-16 pt-16 border-t">
            <div className="flex items-center gap-2 mb-8">
                <MessageCircle className="h-6 w-6" />
                <h2 className="text-2xl font-bold">
                    Comments ({comments.length})
                </h2>
            </div>

            {session ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="min-h-[120px]"
                    />
                    <Button
                        type="submit"
                        disabled={loading || !newComment.trim()}
                        className="mt-3"
                    >
                        {loading ? "Posting..." : "Post Comment"}
                    </Button>
                </form>
            ) : (
                <div className="bg-secondary/50 rounded-lg p-6 mb-8 text-center">
                    <p className="text-muted-foreground mb-3">
                        Please sign in to leave a comment
                    </p>
                    <Button asChild>
                        <Link href="/login">Sign In</Link>
                    </Button>
                </div>
            )}

            {fetchLoading ? (
                <p className="text-muted-foreground">Loading comments...</p>
            ) : comments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                    No comments yet. Be the first to comment!
                </p>
            ) : (
                <div>
                    {comments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))}
                </div>
            )}
        </div>
    );
}
