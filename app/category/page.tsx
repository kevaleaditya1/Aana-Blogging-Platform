import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Browse Categories - Aana",
    description: "Explore articles by category - Phones, Gadgets, AI Tools, Guides, and more.",
};

export default function CategoriesPage() {
    const allPosts = getSortedPostsData();

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
        <div className="container px-4 md:px-6 py-12 md:py-20">
            <div className="mb-12">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
                    Browse by Category
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Explore our content organized by topics. Find exactly what you're interested in.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category, index) => {
                    const theme = categoryThemes[index % categoryThemes.length];

                    return (
                        <Link key={category.slug} href={`/category/${category.slug}`} className="block h-full">
                            <Card className={`h-full hover-lift cursor-pointer bg-gradient-to-br ${theme.bg} transition-all border-2 border-transparent hover:border-primary/20`}>
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${theme.gradient} mb-4 flex items-center justify-center`}>
                                        <span className="text-2xl text-white font-bold">
                                            {category.name.charAt(0)}
                                        </span>
                                    </div>
                                    <CardTitle className="text-2xl">{category.name}</CardTitle>
                                    <CardDescription>
                                        <Badge variant="secondary" className="mt-2">
                                            {category.count} {category.count === 1 ? 'article' : 'articles'}
                                        </Badge>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Explore all articles in {category.name}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-muted-foreground">No categories available yet.</p>
                </div>
            )}
        </div>
    );
}
