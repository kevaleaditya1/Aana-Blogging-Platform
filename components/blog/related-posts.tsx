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
        <section className="mt-16 pt-16 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                    Related Articles
                </h2>
                <p className="text-sm text-muted-foreground">
                    Continue reading with these similar posts
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
                        <Card className="flex flex-col h-full rounded-2xl glass-card hover-lift transition-all overflow-hidden border border-black/[0.06] dark:border-white/[0.08]">
                            <CardHeader className="p-0">
                                <div className="aspect-[16/10] w-full bg-muted overflow-hidden relative">
                                    {post.coverImage ? (
                                        <Image
                                            src={post.coverImage}
                                            alt=""
                                            fill
                                            className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground p-4 text-center">
                                            <span className="font-medium text-xs">
                                                {post.title}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-5 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <Badge variant="glass" className="text-[11px]">
                                            {post.category}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground ml-auto">
                                            {post.date}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-base tracking-tight text-foreground group-hover:text-primary transition-colors mb-1.5 line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}
