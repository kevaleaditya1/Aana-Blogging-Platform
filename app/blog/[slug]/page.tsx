import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPostSlugs, getPostData } from "@/lib/posts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const paths = getAllPostSlugs();
    return paths.map((path) => ({
        slug: path.params.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostData(slug);

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    return {
        title: `${post.title} - Ashitya`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            url: `/blog/${slug}`,
            images: [
                {
                    url: post.ogImage.url,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
    };
}

export default async function Post({ params }: Props) {
    const { slug } = await params;
    const post = getPostData(slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="container px-4 md:px-6 py-12 md:py-20 max-w-3xl mx-auto">
            <Button variant="ghost" size="sm" asChild className="mb-8 gap-2">
                <Link href="/">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>
            </Button>

            <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2">
                    <Badge>{post.category}</Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {post.date}
                    </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                    {post.title}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{post.author.name}</span>
                </div>
            </div>

            <div className="prose prose-zinc dark:prose-invert max-w-none">
                <MDXRemote source={post.content} />
            </div>

            <div className="mt-12 pt-8 border-t">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>
        </article>
    );
}
