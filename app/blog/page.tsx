import { pageMetadata } from "@/lib/site";
import { getSortedPostsData } from "@/lib/posts";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, TrendingUp } from "lucide-react";

export const metadata = pageMetadata('All Technology Articles', 'Browse Aana articles on phones, gadgets, AI tools and practical technology guides.', '/blog');

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
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
                            <Card className="flex flex-col h-full rounded-2xl border border-black/[0.06] dark:border-white/[0.08] glass-card hover-lift transition-all overflow-hidden">
                                {post.ogImage?.url && (
                                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                                        <Image
                                            src={post.ogImage.url}
                                            alt=""
                                            fill
                                            className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                                        />
                                    </div>
                                )}
                                <CardHeader className="p-5 md:p-6 pb-2">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge variant="glass" className="text-[11px]">{post.category}</Badge>
                                        {post.trending && (
                                            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                                                Trending
                                            </span>
                                        )}
                                        {post.featuredPost && (
                                            <Badge variant="default" className="text-[11px]">Featured</Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-lg md:text-xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                        {post.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2 text-sm text-muted-foreground leading-relaxed mt-1">
                                        {post.excerpt}
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="p-5 md:p-6 pt-4 mt-auto flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {new Date(post.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1 font-medium text-primary">
                                        Read <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
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
