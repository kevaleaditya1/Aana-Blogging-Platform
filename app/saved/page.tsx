import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPostData } from "@/lib/posts";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Saved Posts - Aanaa Blog",
    description: "Your bookmarked articles",
};

export default async function SavedPostsPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        redirect("/login");
    }

    const bookmarks = await prisma.bookmark.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
    });

    // Fetch post data for each bookmark
    const posts = await Promise.all(
        bookmarks.map(async (bookmark) => {
            try {
                const post = await getPostData(bookmark.postSlug);
                return { ...post, bookmarkedAt: bookmark.createdAt };
            } catch {
                return null;
            }
        })
    );

    const validPosts = posts.filter((post) => post !== null);

    return (
        <div className="container px-4 md:px-6 py-12 md:py-20">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <Bookmark className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-4xl font-bold tracking-tighter">Saved Posts</h1>
                        <p className="text-muted-foreground mt-2">
                            {validPosts.length} {validPosts.length === 1 ? "article" : "articles"} saved for later
                        </p>
                    </div>
                </div>

                {validPosts.length === 0 ? (
                    <Card className="text-center py-16">
                        <CardContent>
                            <Bookmark className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h2 className="text-2xl font-bold mb-2">No saved posts yet</h2>
                            <p className="text-muted-foreground mb-6">
                                Start bookmarking articles you want to read later
                            </p>
                            <Button asChild>
                                <Link href="/">Browse Articles</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {validPosts.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`}>
                                <Card className="h-full hover:shadow-lg transition-shadow">
                                    {post.image && (
                                        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                                            <Image
                                                src={post.image}
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
                                                <Badge variant="secondary">Trending</Badge>
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
                )}
            </div>
        </div>
    );
}
