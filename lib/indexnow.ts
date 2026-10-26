const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';
const KEY = '4f84c8f8c78c496383ad6d1f8de090eb';
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://aanaa.blog').replace(/\/$/, '');

export async function submitToIndexNow(urls: string[]) {
    const uniqueUrls = [...new Set(urls)].filter(url => url.startsWith(`${SITE_URL}/`));
    if (uniqueUrls.length === 0) return { submitted: 0 };

    const response = await fetch(INDEXNOW_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
            host: new URL(SITE_URL).host,
            key: KEY,
            keyLocation: `${SITE_URL}/${KEY}.txt`,
            urlList: uniqueUrls,
        }),
    });

    if (!response.ok) {
        throw new Error(`IndexNow returned ${response.status}`);
    }
    return { submitted: uniqueUrls.length };
}
