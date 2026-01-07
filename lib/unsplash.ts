import { createApi } from 'unsplash-js';

const unsplash = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY || '',
});

export async function searchImage(query: string): Promise<string | null> {
    try {
        // Clean up query - take first 3 words for better results
        const cleanQuery = query.split(' ').slice(0, 3).join(' ');

        const result = await unsplash.search.getPhotos({
            query: cleanQuery,
            page: 1,
            perPage: 1,
            orientation: 'landscape',
        });

        if (result.errors) {
            console.error('Unsplash API error:', result.errors);
            return null;
        }

        const photo = result.response?.results[0];
        if (!photo) {
            return null;
        }

        // Return the regular size image URL
        return photo.urls.regular;
    } catch (error) {
        console.error('Error fetching image from Unsplash:', error);
        return null;
    }
}

export async function getRandomImage(category: string): Promise<string | null> {
    try {
        const result = await unsplash.photos.getRandom({
            query: category,
            orientation: 'landscape',
        });

        if (result.errors) {
            console.error('Unsplash API error:', result.errors);
            return null;
        }

        const photo = Array.isArray(result.response) ? result.response[0] : result.response;
        return photo?.urls.regular || null;
    } catch (error) {
        console.error('Error fetching random image:', error);
        return null;
    }
}
