export function getCanonicalUrl(path: string = ''): string {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aanaa.blog';

    // Remove trailing slash from base URL if present
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Remove trailing slash from path (except for root)
    const finalPath = cleanPath.length > 1 && cleanPath.endsWith('/')
        ? cleanPath.slice(0, -1)
        : cleanPath;

    return `${cleanBaseUrl}${finalPath}`;
}

export function getAbsoluteUrl(path: string = ''): string {
    return getCanonicalUrl(path);
}
