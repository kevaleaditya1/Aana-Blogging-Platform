import { Metadata } from "next";
import { getSortedPostsData } from "@/lib/posts";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
    title: "All Articles - Aanaa Blog",
    description: "Browse all articles on Aanaa Blog",
};

export const revalidate = 60;

export default async function BlogPage() {
    const allPosts = await getSortedPostsData();

    return (
        <div className="container px-4 md:px-6 py-12 md:py-20">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        All Articles
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Browse all {allPosts.length} articles
                    </p>
                </div>

                {/* Articles Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {allPosts.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`}>
                            <Card className="h-full hover:shadow-lg transition-shadow">
                                {post.ogImage && (
                                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                                        <Image
                                            src={post.ogImage.url}
                                            alt={post.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge>{post.category}</Badge>
                                        {post.trending && (
                                            <Badge variant="secondary" className="gap-1">
                                                <TrendingUp className="h-3 w-3" />
                                                Trending
                                            </Badge>
                                        )}
                                        {post.featuredPost && (
                                            <Badge variant="secondary">Featured</Badge>
                                        )}
                                    </div>
                                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {post.excerpt}
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(post.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-medium text-primary">
                                        Read <ArrowRight className="h-4 w-4" />
                                    </div>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>

                {allPosts.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <p className="text-muted-foreground">No articles found</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
