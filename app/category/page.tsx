import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Browse Categories - Aana",
    description: "Explore articles by category - Phones, Gadgets, AI Tools, Guides, and more.",
};

export default async function CategoriesPage() {
    const allPosts = await getSortedPostsData();

    // Get all unique categories with post counts
    const categoryMap = new Map<string, { name: string; count: number; slug: string }>();

    allPosts.forEach((post) => {
        const slug = post.category.toLowerCase().replace(/\s+/g, "-");
        if (categoryMap.has(slug)) {
            const cat = categoryMap.get(slug)!;
            cat.count++;
        } else {
            categoryMap.set(slug, {
                name: post.category,
                count: 1,
                slug: slug,
            });
        }
    });

    const categories = Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);

    // Category icons/colors
    const categoryThemes = [
        { gradient: 'from-indigo-500 to-purple-500', bg: 'from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30' },
        { gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30' },
        { gradient: 'from-violet-500 to-pink-500', bg: 'from-violet-50 to-pink-50 dark:from-violet-950/30 dark:to-pink-950/30' },
        { gradient: 'from-emerald-500 to-teal-500', bg: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30' },
        { gradient: 'from-orange-500 to-red-500', bg: 'from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30' },
        { gradient: 'from-pink-500 to-rose-500', bg: 'from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30' },
    ];

    return (
        <div className="container px-4 md:px-8 max-w-7xl mx-auto py-12 md:py-20">
            <div className="mb-12 max-w-3xl">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 block">
                    Directory
                </span>
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground mb-3">
                    Browse Topics & Categories
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                    Explore curated tech intelligence categorized by domain — from smartphone hardware architectures to emerging neural networks.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                    <Link key={category.slug} href={`/category/${category.slug}`} className="group block h-full">
                        <Card className="h-full rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card hover-lift transition-all p-6 flex flex-col justify-between">
                            <CardHeader className="p-0 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-secondary border border-border/50 flex items-center justify-center text-foreground font-semibold text-base mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    {category.name.charAt(0)}
                                </div>
                                <CardTitle className="text-xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                                    {category.name}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    <Badge variant="secondary" className="text-[11px] font-normal">
                                        {category.count} {category.count === 1 ? 'article' : 'articles'}
                                    </Badge>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Explore all analysis and reviews in {category.name} →
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-muted-foreground">No categories available yet.</p>
                </div>
            )}
        </div>
    );
}
