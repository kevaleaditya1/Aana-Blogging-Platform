export interface Post {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    coverImage: string;
    category: string;
    author: {
        name: string;
        picture: string;
    };
    ogImage: {
        url: string;
    };
    content: string;
    tags: string[];
    // Visibility fields
    featuredPost?: boolean;
    pinnedPost?: boolean;
    trending?: boolean;
    homepagePriority?: number;
    showInCategory?: boolean;
    hideFromSearch?: boolean;
}
