"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Post } from "@/types";

export function SearchWithSuggestions() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Post[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const router = useRouter();
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Fetch suggestions when query changes
    useEffect(() => {
        if (query.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const fetchSuggestions = async () => {
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                setSuggestions(data.results.slice(0, 5)); // Show top 5 results
                setShowSuggestions(true);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    // Close suggestions when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (slug: string) => {
        router.push(`/blog/${slug}`);
        setShowSuggestions(false);
        setQuery("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === "Enter" && selectedIndex >= 0) {
            e.preventDefault();
            handleSuggestionClick(suggestions[selectedIndex].slug);
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-full md:w-56">
            <form onSubmit={handleSubmit} className="relative group">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none z-10" />
                <Input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                    placeholder="Search..."
                    className="w-full pl-8 pr-3 h-8 bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] focus-visible:ring-2 focus-visible:ring-primary/30 rounded-full text-xs"
                />
            </form>

            {/* Suggestions Dropdown - Apple Frosted Glass Popover */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-80 right-0 bg-background/95 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.12] rounded-2xl shadow-2xl z-50 overflow-hidden p-1.5 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/40 mb-1">
                        Quick Suggestions
                    </div>
                    {suggestions.map((post, index) => (
                        <button
                            key={post.slug}
                            onClick={() => handleSuggestionClick(post.slug)}
                            className={`w-full text-left px-3 py-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors ${index === selectedIndex ? "bg-black/[0.05] dark:bg-white/[0.08]" : ""
                                }`}
                        >
                            <div className="flex items-start gap-2.5">
                                <Search className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-xs text-foreground line-clamp-1">{post.title}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] text-muted-foreground">{post.category}</span>
                                        {post.trending && (
                                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Trending</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                    {suggestions.length > 0 && (
                        <button
                            onClick={handleSubmit}
                            className="w-full text-left px-3 py-2 mt-1 border-t border-border/40 text-xs text-primary hover:underline underline-offset-4 font-medium flex items-center justify-between"
                        >
                            <span>Explore all results for "{query}"</span>
                            <span>→</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
