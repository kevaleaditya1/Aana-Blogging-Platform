import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendingUp } from "lucide-react";
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
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";

// Revalidate every 60 seconds to show latest posts
export const revalidate = 60;

export default async function Home() {
  const allPosts = await getSortedPostsData();
  const featuredPost = allPosts[0];
  const latestPosts = allPosts.slice(1);

  // Calculate trending topics from tags
  const tagCount = new Map<string, number>();
  allPosts.forEach(post => {
    post.tags.forEach(tag => {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    });
  });

  // Get top 6 most popular tags
  const trendingTopics = Array.from(tagCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([tag]) => tag);


  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-background to-background" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                ✨ Featured Article
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                <span className="gradient-text">
                  {featuredPost?.title || "Welcome to Aana"}
                </span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {featuredPost?.excerpt ||
                  "Your ultimate destination for tech news, reviews, and guides."}
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="gap-2">
                  <Link href={`/blog/${featuredPost?.slug}`}>
                    Read Article <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/category">Browse Categories</Link>
                </Button>
              </div>

              {/* Newsletter Signup */}
              <div className="mt-8 max-w-md">
                <NewsletterSignup />
              </div>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last border bg-muted/50 shadow-lg hover-lift relative">
              {featuredPost?.coverImage ? (
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground">
                  <span className="text-lg font-medium">Featured Image</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Topics */}
      <section className="py-12 bg-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Trending Topics</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.length > 0 ? (
              trendingTopics.map((topic) => (
                <Badge
                  key={topic}
                  variant="outline"
                  className="text-sm py-1 px-3 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white hover:border-transparent cursor-pointer transition-all duration-300"
                >
                  {topic}
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground">No trending topics yet</p>
            )}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Latest Articles</h2>
            <Link
              href="/blog"
              className="text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              View all articles
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post, index) => {
              // Subtle theme colors for each card
              const themes = [
                'from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20',
                'from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20',
                'from-violet-50/50 to-pink-50/50 dark:from-violet-950/20 dark:to-pink-950/20',
              ];

              return (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block h-full">
                  <Card className={`flex flex-col h-full hover-lift cursor-pointer bg-gradient-to-br ${themes[index % 3]} transition-all`}>
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
                            <span className="font-medium">{post.title}</span>
                          </div>
                        )}
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
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <div className="ml-auto flex items-center gap-1 text-sm text-primary font-medium">
                        Read More <ArrowRight className="h-3 w-3" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
