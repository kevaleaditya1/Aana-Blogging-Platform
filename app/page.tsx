import Link from "next/link";
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

export default function Home() {
  const allPosts = getSortedPostsData();
  const featuredPost = allPosts[0];
  const latestPosts = allPosts.slice(1);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background z-0" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                Featured Article
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                {featuredPost?.title || "Welcome to Ashitya"}
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
                <Button variant="outline" size="lg">
                  Browse Categories
                </Button>
              </div>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last border bg-muted/50 shadow-xl">
              {/* Placeholder for Hero Image - In a real app, use Next/Image */}
              <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground">
                {featuredPost?.coverImage ? (
                  <span className="text-lg">Cover Image: {featuredPost.title}</span>
                ) : (
                  "Featured Image"
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Topics */}
      <section className="py-12 border-y bg-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Trending Topics</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Smartphones", "AI Tools", "Gadgets", "Reviews", "Android 16", "Apple Intelligence"].map(
              (topic) => (
                <Badge
                  key={topic}
                  variant="outline"
                  className="text-sm py-1 px-3 hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                >
                  {topic}
                </Badge>
              )
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
            {latestPosts.map((post) => (
              <Card key={post.slug} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-[16/9] w-full bg-muted rounded-t-lg overflow-hidden flex items-center justify-center text-muted-foreground">
                    {/* Placeholder */}
                    <span>{post.title} Image</span>
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
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button variant="ghost" size="sm" asChild className="ml-auto gap-1">
                    <Link href={`/blog/${post.slug}`}>
                      Read More <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
