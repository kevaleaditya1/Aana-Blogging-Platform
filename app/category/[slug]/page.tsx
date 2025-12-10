import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSortedPostsData } from "@/lib/posts";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const posts = getSortedPostsData();
    const categories = Array.from(new Set(posts.map((post) => post.category.toLowerCase().replace(/\s+/g, "-"))));

    return categories.map((slug) => ({
        slug,
    }));
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const categoryName = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    return {
        title: `${categoryName} - Ashitya`,
        description: `Latest articles in ${categoryName}`,
    };
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;
    const categoryName = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    const allPosts = getSortedPostsData();
    const categoryPosts = allPosts.filter((post) => {
        const postCategorySlug = post.category.toLowerCase().replace(/\s+/g, "-");
        return postCategorySlug === slug;
    });

    if (categoryPosts.length === 0) {
        // Optional: Handle empty category or show all posts if "all"
        // For now, let's just show a message
    }

    return (
        <div className="container px-4 md:px-6 py-12 md:py-20">
            <div className="mb-8">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
                    {categoryName}
                </h1>
                <p className="text-muted-foreground text-lg">
                    Explore the latest articles, news, and reviews in {categoryName}.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categoryPosts.length > 0 ? (
                    categoryPosts.map((post) => (
                        <Card key={post.slug} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                            <CardHeader className="p-0">
                                <div className="aspect-[16/9] w-full bg-muted rounded-t-lg overflow-hidden flex items-center justify-center text-muted-foreground">
                                    {/* Placeholder */}
                                    <span>{post.title} Image</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="secondary" className="text-xs">
                                        {post.category}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {post.date}
                                    </span>
                                </div>
                                <CardTitle className="line-clamp-2 mb-2">
                                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                                        {post.title}
                                    </Link>
                                </CardTitle>
                                <CardDescription className="line-clamp-3">
                                    {post.excerpt}
                                </CardDescription>
                            </CardContent>
                            <CardFooter className="p-6 pt-0">
                                <Button variant="ghost" size="sm" asChild className="ml-auto gap-1">
                                    <Link href={`/blog/${post.slug}`}>
                                        Read More <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20">
                        <p className="text-muted-foreground">No articles found in this category.</p>
                        <Button asChild className="mt-4">
                            <Link href="/">Go Home</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
