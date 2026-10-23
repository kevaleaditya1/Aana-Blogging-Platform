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
                    postSlug,
                    content: newComment,
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

    const handleDelete = async (commentId: string) => {
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
    };

    const handleReply = async (parentId: string) => {
        if (!replyContent.trim() || !session) return;

        setLoading(true);
        try {
            const response = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postSlug,
                    content: replyContent,
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
    };

    const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
        <div className={`${isReply ? "ml-8 md:ml-12 mt-4" : "mt-6"}`}>
            <div className="flex gap-3">
                <Avatar className="h-9 w-9 border border-black/[0.06] dark:border-white/[0.08]">
                    <AvatarImage src={comment.user.image || undefined} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                        {comment.user.name?.charAt(0) || comment.user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="glass-card rounded-2xl p-4 shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <span className="font-semibold text-xs text-foreground">{comment.user.name || "Anonymous"}</span>
                                <span className="text-[11px] text-muted-foreground ml-2">
                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                            {session && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(comment.id)}
                                    className="h-7 w-7 p-0 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            )}
                        </div>
                        <p className="text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                    {!isReply && session && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                            className="mt-1.5 h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground rounded-full"
                        >
                            <Reply className="h-3 w-3 mr-1.5 text-primary" />
                            Reply
                        </Button>
                    )}
                    {replyTo === comment.id && (
                        <div className="mt-3 space-y-2">
                            <Textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write a reply..."
                                className="min-h-[80px] glass-input rounded-2xl text-xs resize-none p-3"
                            />
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleReply(comment.id)}
                                    disabled={loading || !replyContent.trim()}
                                    size="sm"
                                    className="rounded-full text-xs px-4 apple-press"
                                >
                                    {loading ? "Posting..." : "Post Reply"}
                                </Button>
                                <Button
                                    variant="glass"
                                    size="sm"
                                    onClick={() => {
                                        setReplyTo(null);
                                        setReplyContent("");
                                    }}
                                    className="rounded-full text-xs px-4 apple-press"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3">
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
        <div className="mt-16 pt-16 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <MessageCircle className="h-4 w-4" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Comments ({comments.length})
                </h2>
            </div>

            {session ? (
                <form onSubmit={handleSubmit} className="mb-10">
                    <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="min-h-[110px] glass-input rounded-2xl text-xs leading-relaxed p-4 resize-none"
                    />
                    <Button
                        type="submit"
                        disabled={loading || !newComment.trim()}
                        className="mt-3 rounded-full px-5 text-xs apple-press shadow-sm"
                    >
                        {loading ? "Posting..." : "Post Comment"}
                    </Button>
                </form>
            ) : (
                <div className="glass-card rounded-3xl p-6 sm:p-8 mb-10 text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                        Please sign in to join the conversation and leave a comment
                    </p>
                    <Button asChild className="rounded-full px-6 apple-press">
                        <Link href="/login">Sign In</Link>
                    </Button>
                </div>
            )}

            {fetchLoading ? (
                <p className="text-xs text-muted-foreground text-center py-6">Loading comments...</p>
            ) : comments.length === 0 ? (
                <div className="glass-subtle rounded-2xl p-8 text-center text-muted-foreground text-xs">
                    No comments yet. Be the first to share your thoughts!
                </div>
            ) : (
                <div className="space-y-2">
                    {comments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))}
                </div>
            )}
        </div>
    );
}
