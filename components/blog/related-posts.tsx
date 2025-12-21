import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/types";

interface RelatedPostsProps {
    posts: Post[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
    if (posts.length === 0) {
        return null;
    }

    return (
        <section className="mt-16 pt-16 border-t">
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tighter mb-2">
                    Related Articles
                </h2>
                <p className="text-muted-foreground">
                    Continue reading with these similar posts
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="block h-full">
                        <Card className="flex flex-col h-full hover-lift cursor-pointer transition-all">
                            <CardHeader className="p-0">
                                <div className="aspect-[16/9] w-full bg-gradient-to-br from-muted/80 to-muted rounded-t-lg overflow-hidden relative">
                                    {post.coverImage ? (
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            <span className="font-medium text-center px-4">
                                                {post.title}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-6">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <Badge variant="secondary" className="text-xs">
                                        {post.category}
                                    </Badge>
                                    {post.trending && (
                                        <Badge variant="destructive" className="text-xs">
                                            🔥 Trending
                                        </Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                        {post.date}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {post.excerpt}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}
