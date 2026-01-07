import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

interface NewsItem {
    title: string;
    summary: string;
    content?: string;
    category: string;
    tags: string[];
}

export async function generateBlogPost(newsItems: NewsItem[]): Promise<{
    title: string;
    content: string;
    excerpt: string;
    category: string;
    tags: string[];
}> {
    const newsContext = newsItems.map((item, i) =>
        `${i + 1}. ${item.title}\n${item.summary}`
    ).join('\n\n');

    const prompt = `You are a professional tech blogger. Based on these trending news items, write a comprehensive, engaging blog post:

${newsContext}

Create a blog post (800-1200 words) that:
1. Has a catchy, SEO-friendly title
2. Includes an engaging introduction
3. Covers the main points from the news with analysis
4. Adds your expert insights and commentary
5. Includes practical takeaways for readers
6. Ends with a strong conclusion
7. Uses Markdown formatting (headers, lists, bold, code blocks where relevant)
8. Include 2-3 image placeholders using this format: ![Image description](IMAGE_PLACEHOLDER_1), ![Another image](IMAGE_PLACEHOLDER_2), etc.
9. Place images strategically throughout the content to break up text and illustrate key points

Return ONLY a JSON object with this exact structure:
{
  "title": "Your catchy blog post title",
  "content": "Full markdown content of the blog post with image placeholders",
  "excerpt": "A compelling 2-3 sentence summary",
  "category": "${newsItems[0].category}",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;

    try {
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile', // Free, powerful model
            messages: [
                {
                    role: 'system',
                    content: 'You are a professional tech blogger who writes engaging, informative content. Always respond with valid JSON only.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 3000,
            response_format: { type: 'json_object' }
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No content generated');
        }

        const blogPost = JSON.parse(content);
        return blogPost;

    } catch (error) {
        console.error('Groq generation error:', error);
        throw error;
    }
}

export async function generateMultiplePosts(
    newsItems: NewsItem[],
    count: number = 2
): Promise<Array<{
    title: string;
    content: string;
    excerpt: string;
    category: string;
    tags: string[];
}>> {
    const posts = [];
    const itemsPerPost = Math.ceil(newsItems.length / count);

    for (let i = 0; i < count; i++) {
        const startIdx = i * itemsPerPost;
        const endIdx = Math.min(startIdx + itemsPerPost, newsItems.length);
        const newsGroup = newsItems.slice(startIdx, endIdx);

        if (newsGroup.length > 0) {
            try {
                const post = await generateBlogPost(newsGroup);
                posts.push(post);
                console.log(`✓ Generated post ${i + 1}: ${post.title}`);

                // Rate limiting - wait 1 second between API calls
                if (i < count - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (error) {
                console.error(`Error generating post ${i + 1}:`, error);
            }
        }
    }

    return posts;
}
