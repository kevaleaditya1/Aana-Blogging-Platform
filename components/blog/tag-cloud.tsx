"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface TagCloudProps {
    className?: string;
}

interface TagData {
    name: string;
    count: number;
}

export function TagCloud({ className = "" }: TagCloudProps) {
    const [tags, setTags] = useState<TagData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch tags from API or calculate from posts
        async function fetchTags() {
            try {
                const response = await fetch("/api/tags");
                const data = await response.json();
                setTags(data);
            } catch (error) {
                console.error("Error fetching tags:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchTags();
    }, []);

    if (loading) {
        return (
            <div className={`space-y-4 ${className}`}>
                <h3 className="text-lg font-semibold">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-8 w-20 bg-muted animate-pulse rounded-md" />
                    ))}
                </div>
            </div>
        );
    }

    if (tags.length === 0) {
        return null;
    }

    // Calculate font sizes based on tag frequency
    const maxCount = Math.max(...tags.map((t) => t.count));
    const minCount = Math.min(...tags.map((t) => t.count));

    const getFontSize = (count: number) => {
        const ratio = (count - minCount) / (maxCount - minCount || 1);
        return `${0.875 + ratio * 0.5}rem`; // 0.875rem to 1.375rem
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <h3 className="text-lg font-semibold">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Link
                        key={tag.name}
                        href={`/search?q=${encodeURIComponent(tag.name)}`}
                        className="transition-all hover:scale-110"
                    >
                        <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            style={{ fontSize: getFontSize(tag.count) }}
                        >
                            {tag.name} ({tag.count})
                        </Badge>
                    </Link>
                ))}
            </div>
        </div>
    );
}
