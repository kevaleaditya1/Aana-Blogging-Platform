import { createClient } from 'pexels';

const client = createClient(process.env.PEXELS_API_KEY || '');

export async function searchWebImage(query: string): Promise<string | null> {
    try {
        // Clean up query - take first 4 words for better results
        const cleanQuery = query.split(' ').slice(0, 4).join(' ');

        const result = await client.photos.search({
            query: cleanQuery,
            per_page: 1,
            orientation: 'landscape',
        });

        if ('photos' in result && result.photos.length > 0) {
            // Return the large size image URL
            return result.photos[0].src.large;
        }

        return null;
    } catch (error) {
        console.error('Error fetching image from Pexels:', error);
        return null;
    }
}

export async function getRandomWebImage(category: string): Promise<string | null> {
    try {
        const result = await client.photos.search({
            query: category,
            per_page: 1,
            orientation: 'landscape',
        });

        if ('photos' in result && result.photos.length > 0) {
            return result.photos[0].src.large;
        }

        return null;
    } catch (error) {
        console.error('Error fetching random image:', error);
        return null;
    }
}
