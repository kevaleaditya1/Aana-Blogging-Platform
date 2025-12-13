"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface BookmarkButtonProps {
    postSlug: string;
}

export function BookmarkButton({ postSlug }: BookmarkButtonProps) {
    const { data: session } = useSession();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session?.user) {
            checkBookmarkStatus();
        }
    }, [session, postSlug]);

    const checkBookmarkStatus = async () => {
        try {
            const response = await fetch("/api/bookmarks");
            const data = await response.json();
            const bookmarked = data.bookmarks?.some(
                (b: any) => b.postSlug === postSlug
            );
            setIsBookmarked(bookmarked);
        } catch (error) {
            console.error("Failed to check bookmark status:", error);
        }
    };

    const toggleBookmark = async () => {
        if (!session?.user) {
            window.location.href = "/login";
            return;
        }

        setLoading(true);
        try {
            if (isBookmarked) {
                // Remove bookmark
                const response = await fetch(`/api/bookmarks?postSlug=${postSlug}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    setIsBookmarked(false);
                }
            } else {
                // Add bookmark
                const response = await fetch("/api/bookmarks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ postSlug }),
                });
                if (response.ok) {
                    setIsBookmarked(true);
                }
            }
        } catch (error) {
            console.error("Failed to toggle bookmark:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant={isBookmarked ? "default" : "outline"}
            size="sm"
            onClick={toggleBookmark}
            disabled={loading}
            className="gap-2"
        >
            {isBookmarked ? (
                <>
                    <BookmarkCheck className="h-4 w-4" />
                    Saved
                </>
            ) : (
                <>
                    <Bookmark className="h-4 w-4" />
                    Save
                </>
            )}
        </Button>
    );
}
