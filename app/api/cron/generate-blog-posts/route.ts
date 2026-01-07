import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateMultiplePosts } from '@/lib/ai/blog-generator';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        console.log('Starting auto blog generation...');

        // Get top news (all time for testing)
        const topNews = await prisma.newsItem.findMany({
            orderBy: { aiScore: 'desc' },
            take: 10,
            select: {
                title: true,
                summary: true,
                content: true,
                category: true,
                tags: true,
                link: true,
                source: true,
                image: true,
            }
        });

        console.log(`Found ${topNews.length} news items`);

        if (topNews.length < 3) {
            return NextResponse.json({
                message: 'Not enough news to generate posts',
                generated: 0
            });
        }

        console.log(`Generating blog posts from ${topNews.length} news items...`);

        // Generate 1-2 blog posts using Groq AI (FREE!)
        let generatedPosts = [];
        try {
            console.log('Calling Groq AI to generate posts...');
            const { generateMultiplePosts } = await import('@/lib/ai/blog-generator');
            generatedPosts = await generateMultiplePosts(topNews, 2);
            console.log(`AI generated ${generatedPosts.length} posts`);
        } catch (error) {
            console.error('Error in generateMultiplePosts:', error);
            return NextResponse.json({
                error: 'Failed to generate posts with AI',
                details: error instanceof Error ? error.message : 'Unknown error'
            }, { status: 500 });
        }

        if (generatedPosts.length === 0) {
            return NextResponse.json({
                message: 'AI generated 0 posts',
                generated: 0
            });
        }

        // Save posts to database
        const savedPosts = [];
        for (const post of generatedPosts) {
            try {
                // Create slug from title with timestamp to ensure uniqueness
                const slug = post.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '') + '-' + Date.now();

                // Fetch cover image from web using Pexels
                let coverImage = '/images/default-blog-cover.jpg';
                try {
                    const { searchWebImage } = await import('@/lib/pexels');
                    const webImage = await searchWebImage(post.title);
                    if (webImage) {
                        coverImage = webImage;
                        console.log(`✓ Found cover image for: ${post.title}`);
                    }
                } catch (error) {
                    console.error('Error fetching cover image:', error);
                }

                // Replace image placeholders with actual images
                let contentWithImages = post.content;
                const imagePlaceholders = post.content.match(/IMAGE_PLACEHOLDER_\d+/g) || [];

                for (let i = 0; i < imagePlaceholders.length; i++) {
                    const placeholder = imagePlaceholders[i];
                    let imageUrl = null;

                    // Try to get image from news items first
                    if (topNews[i] && topNews[i].image) {
                        imageUrl = topNews[i].image;
                        console.log(`✓ Using news image ${i + 1}`);
                    } else {
                        // Fallback to Pexels search based on post tags
                        try {
                            const { searchWebImage } = await import('@/lib/pexels');
                            const searchTerm = post.tags[i] || post.category;
                            imageUrl = await searchWebImage(searchTerm);
                            if (imageUrl) {
                                console.log(`✓ Found Pexels image for: ${searchTerm}`);
                            }
                        } catch (error) {
                            console.error(`Error fetching image ${i + 1}:`, error);
                        }
                    }

                    // Replace placeholder with actual image URL or remove if not found
                    if (imageUrl) {
                        contentWithImages = contentWithImages.replace(placeholder, imageUrl);
                    } else {
                        // Remove the entire image markdown if no image found
                        contentWithImages = contentWithImages.replace(new RegExp(`!\\[.*?\\]\\(${placeholder}\\)\\s*`, 'g'), '');
                    }
                }

                // Add source references to content
                const newsLinks = topNews.map((news: any) =>
                    `- [${news.title}](${news.link || '#'}) - *${news.source}*`
                ).join('\n');

                const contentWithReferences = `${contentWithImages}\n\n## 📚 Sources & References\n\nThis article was compiled from the following news sources:\n\n${newsLinks}\n\n*Click the links above to read the full articles from the original sources.*`;

                // Create post with comprehensive SEO
                const savedPost = await prisma.post.create({
                    data: {
                        title: post.title,
                        slug,
                        excerpt: post.excerpt,
                        content: contentWithReferences,
                        category: post.category,
                        tags: post.tags,
                        coverImage,
                        published: true,
                        status: 'published',
                        featuredPost: false,
                        trending: true,
                        // SEO Metadata
                        metaTitle: post.title.length > 60 ? post.title.substring(0, 57) + '...' : post.title,
                        metaDescription: post.excerpt.length > 160 ? post.excerpt.substring(0, 157) + '...' : post.excerpt,
                        focusKeyword: post.tags[0] || post.category,
                        canonicalUrl: `https://aanaa.blog/blog/${slug}`,
                        robots: 'index, follow',
                        ogTitle: post.title,
                        ogDescription: post.excerpt.substring(0, 200),
                        readingTime: Math.ceil(post.content.split(' ').length / 200),
                        tableOfContents: true,
                        commentEnabled: true,
                        adsEnabled: true,
                        schemaType: 'Article',
                    }
                });

                savedPosts.push(savedPost);
                console.log(`✓ Created post: ${savedPost.title}`);

            } catch (error) {
                console.error('Error saving post:', error);
            }
        }

        console.log(`Auto-generated ${savedPosts.length} blog posts`);

        return NextResponse.json({
            success: true,
            generated: savedPosts.length,
            posts: savedPosts.map(p => ({ title: p.title, slug: p.slug }))
        });

    } catch (error) {
        console.error('Auto blog generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate blog posts' },
            { status: 500 }
        );
    }
}
