import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostData, getAllPostSlugs } from "@/lib/posts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/components/blog/bookmark-button";
import { ShareButtons } from "@/components/blog/share-buttons";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { CodeBlock } from "@/components/blog/code-block";

// Revalidate every 60 seconds to show latest content
export const revalidate = 60;

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const paths = await getAllPostSlugs();
    return paths.map((path) => ({
        slug: path.params.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostData(slug);

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    return {
        title: post.title,
        description: post.excerpt,
        keywords: post.tags,
        authors: [{ name: post.author.name }],
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            url: `${baseUrl}/blog/${slug}`,
            publishedTime: post.date,
            authors: [post.author.name],
            tags: post.tags,
            images: [
                {
                    url: post.ogImage.url,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
            images: [post.ogImage.url],
        },
    };
}

export default async function Post({ params }: Props) {
    const { slug } = await params;
    const post = await getPostData(slug);

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
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Badge>{post.category}</Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {post.date}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShareButtons title={post.title} slug={slug} />
                        <BookmarkButton postSlug={slug} />
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">{post.title}</h1>
                <p className="text-xl text-muted-foreground">{post.excerpt}</p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{post.author.name}</span>
                </div>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                        code: ({ node, inline, className, children, ...props }: any) => {
                            if (inline) {
                                return <code className={className} {...props}>{children}</code>;
                            }
                            return (
                                <CodeBlock className={className}>
                                    {String(children).replace(/\n$/, '')}
                                </CodeBlock>
                            );
                        },
                    }}
                >
                    {post.content}
                </ReactMarkdown>
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
