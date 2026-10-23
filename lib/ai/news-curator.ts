import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'models/gemini-pro' });

async function summarizeNews(content: string): Promise<string> {
    try {
        const prompt = `Summarize this tech news article in 3-5 concise sentences, focusing on key points:\n\n${content.substring(0, 2000)}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        return summary || content.substring(0, 200);
    } catch (error) {
        console.error('Error summarizing news:', error);
        return content.substring(0, 200);
    }
}

async function categorizeNews(title: string, content: string): Promise<string> {
    try {
        const prompt = `Categorize this tech news into ONE of these categories: Smartphones, AI, Gadgets, Software, Gaming, Reviews, Guides, News\n\nTitle: ${title}\nContent: ${content.substring(0, 500)}\n\nRespond with ONLY the category name.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const category = response.text().trim();

        const validCategories = ['Smartphones', 'AI', 'Gadgets', 'Software', 'Gaming', 'Reviews', 'Guides', 'News'];
        return validCategories.includes(category) ? category : 'News';
    } catch (error) {
        console.error('Error categorizing news:', error);
        return 'News';
    }
}

async function extractTags(title: string, content: string): Promise<string[]> {
    try {
        const prompt = `Extract 3-5 relevant tags from this article. Return ONLY comma-separated tags.\n\nTitle: ${title}\nContent: ${content.substring(0, 500)}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const tagsText = response.text();

        const tags = tagsText
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0)
            .slice(0, 5);

        return tags.length > 0 ? tags : ['tech'];
    } catch (error) {
        console.error('Error extracting tags:', error);
        return ['tech'];
    }
}

function calculateRelevanceScore(title: string, content: string, publishedAt: Date): number {
    // Keywords that indicate high relevance
    const highPriorityKeywords = [
        'AI', 'iPhone', 'Android', 'launch', 'release', 'new', 'update',
        'review', 'announced', 'breakthrough', 'revolutionary'
    ];

    const mediumPriorityKeywords = [
        'smartphone', 'gadget', 'app', 'software', 'hardware',
        'tech', 'device', 'feature', 'upgrade'
    ];

    let score = 0;
    const lowerTitle = title.toLowerCase();
    const lowerContent = content.toLowerCase();

    // High priority keywords
    highPriorityKeywords.forEach(keyword => {
        if (lowerTitle.includes(keyword.toLowerCase())) score += 3;
        if (lowerContent.includes(keyword.toLowerCase())) score += 1;
    });

    // Medium priority keywords
    mediumPriorityKeywords.forEach(keyword => {
        if (lowerTitle.includes(keyword.toLowerCase())) score += 2;
        if (lowerContent.includes(keyword.toLowerCase())) score += 0.5;
    });

    // Favor stories published recently, with relevance contributing up to half
    // of the final score. This lets the generator rank current stories instead
    // of repeatedly selecting old high-keyword items.
    const ageHours = Math.max(0, (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60));
    const recency = Math.exp(-ageHours / 36);
    const relevance = Math.min(score / 20, 1);
    return Number((recency * 0.6 + relevance * 0.4).toFixed(4));
}

export async function processNewsItem(item: {
    title: string;
    content: string;
    summary: string;
    publishedAt?: Date;
}) {
    const [summary, category, tags, aiScore] = await Promise.all([
        summarizeNews(item.content || item.summary),
        categorizeNews(item.title, item.content || item.summary),
        extractTags(item.title, item.content || item.summary),
        Promise.resolve(calculateRelevanceScore(item.title, item.content || item.summary, item.publishedAt ?? new Date())),
    ]);

    return {
        summary,
        category,
        tags,
        aiScore,
    };
}
