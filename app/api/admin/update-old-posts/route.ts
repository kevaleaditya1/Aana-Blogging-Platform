import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        // Get all posts without proper SEO metadata
        const postsToUpdate = await prisma.post.findMany({
            where: {
                OR: [
                    { metaTitle: null },
                    { metaDescription: null },
                    { coverImage: '/images/default-blog-cover.jpg' },
                ]
            }
        });

        console.log(`Found ${postsToUpdate.length} posts to update`);

        let updatedCount = 0;

        for (const post of postsToUpdate) {
            try {
                // Fetch cover image if it's the default
                let coverImage = post.coverImage;
                if (coverImage === '/images/default-blog-cover.jpg') {
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
                }

                // Update post with SEO metadata
                await prisma.post.update({
                    where: { id: post.id },
                    data: {
                        coverImage,
                        metaTitle: post.metaTitle || (post.title.length > 60 ? post.title.substring(0, 57) + '...' : post.title),
                        metaDescription: post.metaDescription || (post.excerpt.length > 160 ? post.excerpt.substring(0, 157) + '...' : post.excerpt),
                        focusKeyword: post.focusKeyword || post.tags[0] || post.category,
                        canonicalUrl: post.canonicalUrl || `https://aanaa.blog/blog/${post.slug}`,
                        robots: post.robots || 'index, follow',
                        ogTitle: post.ogTitle || post.title,
                        ogDescription: post.ogDescription || post.excerpt.substring(0, 200),
                        readingTime: post.readingTime || Math.ceil(post.content.split(' ').length / 200),
                        tableOfContents: post.tableOfContents ?? true,
                        commentEnabled: post.commentEnabled ?? true,
                        adsEnabled: post.adsEnabled ?? true,
                        schemaType: post.schemaType || 'Article',
                    }
                });

                updatedCount++;
                console.log(`✓ Updated: ${post.title}`);

            } catch (error) {
                console.error(`Error updating post ${post.id}:`, error);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Updated ${updatedCount} posts with SEO metadata and cover images`,
            updated: updatedCount,
            total: postsToUpdate.length
        });

    } catch (error) {
        console.error('Error updating posts:', error);
        return NextResponse.json(
            { error: 'Failed to update posts' },
            { status: 500 }
        );
    }
}
