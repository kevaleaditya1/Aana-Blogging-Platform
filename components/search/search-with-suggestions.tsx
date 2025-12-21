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
        <div ref={wrapperRef} className="relative w-full md:w-64">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity blur" />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                <Input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                    placeholder="Search articles..."
                    className="w-full pl-10 pr-4 h-10 bg-secondary/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-full relative"
                />
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg z-50 overflow-hidden">
                    {suggestions.map((post, index) => (
                        <button
                            key={post.slug}
                            onClick={() => handleSuggestionClick(post.slug)}
                            className={`w-full text-left px-4 py-3 hover:bg-secondary/50 transition-colors border-b last:border-b-0 ${index === selectedIndex ? "bg-secondary/50" : ""
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <Search className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm line-clamp-1">{post.title}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-muted-foreground">{post.category}</span>
                                        {post.trending && (
                                            <span className="text-xs">🔥</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                    {suggestions.length > 0 && (
                        <button
                            onClick={handleSubmit}
                            className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-secondary/50 transition-colors font-medium"
                        >
                            See all results for "{query}" →
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
