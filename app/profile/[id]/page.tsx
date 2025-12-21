import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Bookmark, Calendar, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getPostData } from "@/lib/posts";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: { id },
    });

    return {
        title: user ? `${user.name || "User"}'s Profile - Aanaa Blog` : "User Not Found",
        description: user ? `View ${user.name || "User"}'s activity on Aanaa Blog` : "",
    };
}

export default async function ProfilePage({ params }: Props) {
    const { id } = await params;

    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            comments: {
                orderBy: { createdAt: "desc" },
                take: 20,
            },
            bookmarks: {
                orderBy: { createdAt: "desc" },
                take: 20,
            },
        },
    });

    if (!user) {
        notFound();
    }

    // Fetch post data for comments
    const commentsWithPosts = await Promise.all(
        user.comments.map(async (comment) => {
            try {
                const post = await getPostData(comment.postSlug);
                return { ...comment, post };
            } catch {
                return { ...comment, post: null };
            }
        })
    );

    // Fetch post data for bookmarks
    const bookmarksWithPosts = await Promise.all(
        user.bookmarks.map(async (bookmark) => {
            try {
                const post = await getPostData(bookmark.postSlug);
                return { ...bookmark, post };
            } catch {
                return { ...bookmark, post: null };
            }
        })
    );

    const validComments = commentsWithPosts.filter((c) => c.post !== null);
    const validBookmarks = bookmarksWithPosts.filter((b) => b.post !== null);

    return (
        <div className="container px-4 md:px-6 py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <Card className="mb-8">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-6">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={user.image || undefined} />
                                <AvatarFallback className="text-2xl">
                                    {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-2">{user.name || "Anonymous User"}</h1>
                                <p className="text-muted-foreground mb-4">{user.email}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Comments</CardTitle>
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{user.comments.length}</div>
                            <p className="text-xs text-muted-foreground">Total comments posted</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
                            <Bookmark className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{user.bookmarks.length}</div>
                            <p className="text-xs text-muted-foreground">Posts saved</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="comments" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="comments">Comments</TabsTrigger>
                        <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
                    </TabsList>

                    {/* Comments Tab */}
                    <TabsContent value="comments" className="mt-6">
                        {validComments.length === 0 ? (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">No comments yet</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {validComments.map((comment) => (
                                    <Card key={comment.id}>
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="text-base mb-2">
                                                        <Link
                                                            href={`/blog/${comment.postSlug}`}
                                                            className="hover:underline"
                                                        >
                                                            {comment.post?.title}
                                                        </Link>
                                                    </CardTitle>
                                                    <CardDescription>
                                                        {formatDistanceToNow(new Date(comment.createdAt), {
                                                            addSuffix: true,
                                                        })}
                                                    </CardDescription>
                                                </div>
                                                <Badge variant="outline">{comment.post?.category}</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Bookmarks Tab */}
                    <TabsContent value="bookmarks" className="mt-6">
                        {validBookmarks.length === 0 ? (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">No bookmarks yet</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {validBookmarks.map((bookmark) => (
                                    <Link key={bookmark.id} href={`/blog/${bookmark.postSlug}`}>
                                        <Card className="h-full hover:shadow-lg transition-shadow">
                                            <CardHeader>
                                                <Badge className="w-fit mb-2">{bookmark.post?.category}</Badge>
                                                <CardTitle className="line-clamp-2">
                                                    {bookmark.post?.title}
                                                </CardTitle>
                                                <CardDescription className="line-clamp-2">
                                                    {bookmark.post?.excerpt}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-xs text-muted-foreground">
                                                    Saved{" "}
                                                    {formatDistanceToNow(new Date(bookmark.createdAt), {
                                                        addSuffix: true,
                                                    })}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
