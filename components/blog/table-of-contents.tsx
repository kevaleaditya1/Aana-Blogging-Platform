"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
    id: string;
    text: string;
    level: number;
}

export function TableOfContents() {
    const [headings, setHeadings] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        // Extract headings from the article
        const article = document.querySelector("article");
        if (!article) return;

        const headingElements = article.querySelectorAll("h2, h3");
        const items: TocItem[] = [];

        headingElements.forEach((heading, index) => {
            const id = heading.id || `heading-${index}`;
            if (!heading.id) {
                heading.id = id;
            }

            items.push({
                id,
                text: heading.textContent || "",
                level: parseInt(heading.tagName[1]),
            });
        });

        setHeadings(items);

        // Set up intersection observer for active heading
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "-100px 0px -80% 0px",
            }
        );

        headingElements.forEach((heading) => observer.observe(heading));

        return () => observer.disconnect();
    }, []);

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80; // Account for fixed header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    if (headings.length === 0) {
        return null;
    }

    return (
        <div className="hidden xl:block">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-3">Table of Contents</h4>
                </div>
                <nav className="space-y-1">
                    {headings.map((heading) => (
                        <button
                            key={heading.id}
                            onClick={() => scrollToHeading(heading.id)}
                            className={cn(
                                "block w-full text-left text-sm transition-colors hover:text-foreground",
                                heading.level === 3 && "pl-4",
                                activeId === heading.id
                                    ? "text-foreground font-medium border-l-2 border-primary pl-3"
                                    : "text-muted-foreground border-l-2 border-transparent pl-3"
                            )}
                        >
                            {heading.text}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
}
