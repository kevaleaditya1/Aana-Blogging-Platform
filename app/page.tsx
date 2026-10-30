import { pageMetadata } from "@/lib/site";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSortedPostsData } from "@/lib/posts";
import { NewsletterSection } from "@/components/newsletter/newsletter-section";

// Revalidate immediately to show latest posts
export const revalidate = 0;

export const metadata = pageMetadata('Tech for the Future', "Smartphone reviews, gadget guides and AI insights. Explore Aana's latest technology articles.", '/');

export default async function Home() {
  const allPosts = await getSortedPostsData();

  // Get actual featured post or fallback to first post
  const featuredPost = allPosts.find(p => p.featuredPost) || allPosts[0];
  const latestPosts = allPosts.slice(0, 12);

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
      {/* Hero Section - Apple Newsroom Style with Glass Accents */}
      <section className="relative pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden">
        <div className="container px-4 md:px-8 max-w-7xl mx-auto">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-subtle text-primary text-[12px] font-semibold uppercase tracking-wider shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>Next-Gen Tech Editorial</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.06]">
              Future tech, <br />
              <span className="text-muted-foreground font-normal">distilled for everyone.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground font-normal leading-relaxed max-w-2xl">
              Independent analysis, deep smartphone reviews, actionable gadget guides, and curated AI insights.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild size="lg" className="rounded-full px-6 gap-2 bg-foreground text-background hover:opacity-90 apple-press shadow-md">
                <Link href="/blog">
                  Explore Articles <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="glass" size="lg" asChild className="rounded-full px-6 apple-press">
                <Link href="/category">Browse Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Story Bento Showcase with Liquid Glass Treatment */}
      {featuredPost && (
        <section className="pb-12 md:pb-16">
          <div className="container px-4 md:px-8 max-w-7xl mx-auto">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Featured Story
              </span>
            </div>

            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div className="relative rounded-3xl overflow-hidden glass-card hover-lift transition-all">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
                  {/* Image Column */}
                  <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-[16/11] w-full overflow-hidden bg-muted">
                    {featuredPost.coverImage ? (
                      <Image
                        src={featuredPost.coverImage}
                        alt=""
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                        priority
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <span className="font-medium">{featuredPost.title}</span>
                      </div>
                    )}
                  </div>

                  {/* Content Column */}
                  <div className="lg:col-span-5 p-6 md:p-10 lg:p-12 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="default" className="text-xs">
                          {featuredPost.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {featuredPost.date}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
                        {featuredPost.title}
                      </h2>

                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:underline underline-offset-4">
                        Read Story <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Trending Topics Frosted Glass Strip */}
      {trendingTopics.length > 0 && (
        <section className="py-6 border-y border-black/[0.05] dark:border-white/[0.08] glass-subtle">
          <div className="container px-4 md:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Trending</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {trendingTopics.map((topic) => (
                <Link
                  key={topic}
                  href={`/search?q=${encodeURIComponent(topic)}`}
                  className="px-3.5 py-1 text-xs font-medium rounded-full glass-subtle text-foreground hover:bg-black/[0.06] dark:hover:bg-white/[0.1] hover-lift transition-all shadow-xs"
                >
                  {topic}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles Bento Grid with Frosted Glass Cards */}
      <section className="py-12 md:py-20 lg:py-24">
        <div className="container px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-1 block">
                Latest Updates
              </span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                All Stories & Reviews
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-xs md:text-sm font-medium text-primary hover:underline underline-offset-4 flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post, index) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
                <Card className="flex flex-col h-full rounded-2xl glass-card hover-lift transition-all overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="aspect-[16/10] w-full bg-muted overflow-hidden relative">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt=""
                          fill
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={false}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground p-4 text-center">
                          <span className="font-medium text-sm">{post.title}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge variant="glass" className="text-[11px]">
                          {post.category}
                        </Badge>
                        {post.trending && (
                          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                            Trending
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto">
                          {post.date}
                        </span>
                      </div>
                      <CardTitle className="text-lg md:text-xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                        {post.excerpt}
                      </CardDescription>
                    </div>

                    <div className="pt-4 mt-auto flex items-center text-xs font-medium text-primary">
                      <span>Read Story</span>
                      <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Bento Section with Glass Card */}
      <NewsletterSection />
    </div>
  );
}
