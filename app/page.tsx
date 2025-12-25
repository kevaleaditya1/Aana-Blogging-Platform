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
import { NewsletterSection } from "@/components/newsletter/newsletter-section";

// Revalidate immediately to show latest posts
export const revalidate = 0;

export default async function Home() {
  const allPosts = await getSortedPostsData();

  // Get actual featured post or fallback to first post
  const featuredPost = allPosts.find(p => p.featuredPost) || allPosts[0];
  const latestPosts = allPosts; // Show all posts

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
      <section className="relative py-20 md:py-32 min-h-[60vh] flex items-end justify-center pb-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            {/* Glassmorphic Card */}
            <div className="relative backdrop-blur-md bg-white/5 dark:bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 rounded-2xl pointer-events-none" />

              <div className="relative z-10 text-center space-y-6">
                <Badge variant="secondary" className="w-fit mx-auto bg-white/10 backdrop-blur-sm border-white/20">
                  ✨ Tech Insights & Reviews
                </Badge>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Welcome to Aana
                </h1>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  Your ultimate destination for tech news, smartphone reviews, gadget guides, and AI tools. Stay ahead with the latest insights and expert recommendations.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center pt-4">
                  <Button asChild size="lg" className="gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-gray-900 dark:text-white">
                    <Link href="/blog">
                      Explore Articles <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="bg-white/5 backdrop-blur-sm hover:bg-white/10 border-white/20 text-gray-900 dark:text-white">
                    <Link href="/category">Browse Categories</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Topics */}
      <section className="py-6">
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
                  className="text-sm py-1 px-3"
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
      < section className="py-12 md:py-24 lg:py-32" >
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
                            priority={index < 3} // Prioritize first 3 images for LCP
                            loading={index < 3 ? "eager" : "lazy"}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <span className="font-medium">{post.title}</span>
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
      </section >

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}
