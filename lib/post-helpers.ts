// Helper functions for blog post management

/**
 * Calculate reading time based on word count
 * Average reading speed: 200 words per minute
 */
export function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
}

/**
 * Generate SEO-friendly slug from title
 */
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

/**
 * Extract headings from markdown content for table of contents
 */
export function extractHeadings(content: string): { level: number; text: string; id: string }[] {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: { level: number; text: string; id: string }[] = [];

    let match;
    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = generateSlug(text);
        headings.push({ level, text, id });
    }

    return headings;
}

/**
 * Calculate SEO score based on various factors
 */
export function calculateSEOScore(data: {
    title: string;
    metaDescription?: string;
    focusKeyword?: string;
    content: string;
    headings: string[];
}): { score: number; suggestions: string[] } {
    let score = 0;
    const suggestions: string[] = [];

    // Title length (50-60 chars is optimal)
    if (data.title.length >= 50 && data.title.length <= 60) {
        score += 20;
    } else if (data.title.length < 50) {
        suggestions.push('Title is too short. Aim for 50-60 characters.');
    } else {
        suggestions.push('Title is too long. Keep it under 60 characters.');
    }

    // Meta description (150-160 chars is optimal)
    if (data.metaDescription) {
        if (data.metaDescription.length >= 150 && data.metaDescription.length <= 160) {
            score += 20;
        } else if (data.metaDescription.length < 150) {
            suggestions.push('Meta description is too short. Aim for 150-160 characters.');
        } else {
            suggestions.push('Meta description is too long. Keep it under 160 characters.');
        }
    } else {
        suggestions.push('Add a meta description for better SEO.');
    }

    // Focus keyword in title
    if (data.focusKeyword && data.title.toLowerCase().includes(data.focusKeyword.toLowerCase())) {
        score += 15;
    } else if (data.focusKeyword) {
        suggestions.push('Include focus keyword in title.');
    }

    // Focus keyword in content
    if (data.focusKeyword) {
        const keywordCount = (data.content.toLowerCase().match(new RegExp(data.focusKeyword.toLowerCase(), 'g')) || []).length;
        const wordCount = data.content.split(/\s+/).length;
        const density = (keywordCount / wordCount) * 100;

        if (density >= 0.5 && density <= 2.5) {
            score += 15;
        } else if (density < 0.5) {
            suggestions.push('Use focus keyword more in content (0.5-2.5% density).');
        } else {
            suggestions.push('Reduce focus keyword usage to avoid keyword stuffing.');
        }
    }

    // Content length (min 300 words)
    const wordCount = data.content.split(/\s+/).length;
    if (wordCount >= 1000) {
        score += 15;
    } else if (wordCount >= 500) {
        score += 10;
    } else if (wordCount >= 300) {
        score += 5;
    } else {
        suggestions.push('Content is too short. Aim for at least 300 words.');
    }

    // Headings structure
    if (data.headings.length >= 3) {
        score += 15;
    } else {
        suggestions.push('Add more headings (H2, H3) to structure your content.');
    }

    return { score, suggestions };
}

/**
 * Generate meta description from content if not provided
 */
export function generateMetaDescription(content: string, maxLength: number = 160): string {
    // Remove markdown syntax
    const plainText = content
        .replace(/#{1,6}\s+/g, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .trim();

    // Get first sentence or first maxLength characters
    const firstSentence = plainText.split(/[.!?]/)[0];
    if (firstSentence.length <= maxLength) {
        return firstSentence + '.';
    }

    return plainText.substring(0, maxLength - 3) + '...';
}

/**
 * Optimize image filename for SEO
 */
export function optimizeImageFilename(filename: string, title: string): string {
    const ext = filename.split('.').pop();
    const slug = generateSlug(title);
    return `${slug}.${ext}`;
}

/**
 * Validate required fields before publishing
 */
export function validatePost(data: {
    title: string;
    excerpt: string;
    content: string;
    coverImage: string;
    category: string;
    metaTitle?: string;
    metaDescription?: string;
}): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.title || data.title.trim().length === 0) {
        errors.push('Title is required');
    }

    if (!data.excerpt || data.excerpt.trim().length === 0) {
        errors.push('Excerpt is required');
    }

    if (!data.content || data.content.trim().length === 0) {
        errors.push('Content is required');
    }

    if (!data.coverImage || data.coverImage.trim().length === 0) {
        errors.push('Cover image is required');
    }

    if (!data.category || data.category.trim().length === 0) {
        errors.push('Category is required');
    }

    if (data.title && data.title.length > 120) {
        errors.push('Title must be 120 characters or less');
    }

    if (data.excerpt && data.excerpt.length > 300) {
        errors.push('Excerpt must be 300 characters or less');
    }

    if (data.metaTitle && data.metaTitle.length > 60) {
        errors.push('Meta title must be 60 characters or less');
    }

    if (data.metaDescription && data.metaDescription.length > 160) {
        errors.push('Meta description must be 160 characters or less');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
