import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const samplePosts = [
    {
        title: "iPhone 16 Pro Max Review: The Ultimate Flagship",
        slug: "iphone-16-pro-max-review",
        excerpt: "An in-depth review of Apple's latest flagship smartphone with stunning camera capabilities and performance.",
        content: `# iPhone 16 Pro Max Review

The iPhone 16 Pro Max represents Apple's most ambitious smartphone yet. With groundbreaking camera technology and the powerful A18 Pro chip, this device sets new standards.

## Design & Build Quality

The titanium frame feels premium and durable. The new Desert Titanium color is absolutely stunning.

## Camera Performance

- **48MP Main Camera**: Incredible detail
- **5x Telephoto**: Perfect for portraits
- **Ultra-wide**: Great for landscapes

## Performance

The A18 Pro chip handles everything effortlessly. Gaming, video editing, multitasking - all smooth.

## Verdict

If you want the best iPhone, this is it. **Highly recommended!**`,
        coverImage: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
        category: "Phones",
        tags: ["iPhone", "Apple", "Review", "Flagship"],
        author: "Tech Reviewer",
        status: "published",
        featuredPost: true,
        trending: true,
        homepagePriority: 100,
    },
    {
        title: "Best Budget Smartphones Under $300 in 2024",
        slug: "best-budget-smartphones-2024",
        excerpt: "Discover the top budget-friendly smartphones that don't compromise on features or performance.",
        content: `# Best Budget Smartphones Under $300

You don't need to spend a fortune for a great smartphone. Here are our top picks for 2024.

## 1. Pixel 7a - $299
Google's mid-ranger with flagship camera quality.

## 2. Samsung Galaxy A54 - $279
Beautiful AMOLED display and solid performance.

## 3. OnePlus Nord N30 - $249
90Hz display and fast charging at an unbeatable price.

## Conclusion
These phones prove that budget doesn't mean compromise!`,
        coverImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
        category: "Phones",
        tags: ["Budget", "Smartphones", "Guide", "2024"],
        author: "Tech Reviewer",
        status: "published",
        pinnedPost: true,
        homepagePriority: 80,
    },
    {
        title: "ChatGPT vs Claude: Which AI Assistant is Better?",
        slug: "chatgpt-vs-claude-comparison",
        excerpt: "A comprehensive comparison of the two leading AI assistants to help you choose the right one.",
        content: `# ChatGPT vs Claude: The Ultimate Comparison

Both are powerful AI assistants, but which one should you use?

## ChatGPT Strengths
- Vast knowledge base
- Creative writing
- Code generation
- Plugin ecosystem

## Claude Strengths
- Longer context window
- Better at analysis
- More nuanced responses
- Constitutional AI safety

## Winner?
It depends on your use case. Try both!`,
        coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
        category: "AI Tools",
        tags: ["AI", "ChatGPT", "Claude", "Comparison"],
        author: "Tech Reviewer",
        status: "published",
        trending: true,
        homepagePriority: 90,
    },
    {
        title: "Top 10 Must-Have Gadgets for 2024",
        slug: "top-10-gadgets-2024",
        excerpt: "From smart home devices to portable tech, here are the gadgets you need this year.",
        content: `# Top 10 Must-Have Gadgets for 2024

Upgrade your tech game with these amazing gadgets!

## 1. Meta Quest 3
VR gaming and productivity combined.

## 2. DJI Mini 4 Pro
Compact drone with 4K camera.

## 3. Anker PowerCore 20K
Never run out of battery again.

## 4. Sony WH-1000XM5
Best noise-canceling headphones.

## 5. Apple Watch Ultra 2
Ultimate smartwatch for adventurers.

*And 5 more amazing gadgets...*`,
        coverImage: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800",
        category: "Gadgets",
        tags: ["Gadgets", "Tech", "2024", "Guide"],
        author: "Tech Reviewer",
        status: "published",
        homepagePriority: 70,
    },
    {
        title: "How to Build Your First PC: Complete Guide",
        slug: "how-to-build-first-pc-guide",
        excerpt: "Step-by-step guide to building your own gaming or productivity PC from scratch.",
        content: `# How to Build Your First PC

Building a PC is easier than you think! Follow this guide.

## What You'll Need
- CPU
- Motherboard
- RAM
- GPU
- Storage
- PSU
- Case

## Step 1: Install CPU
Carefully place the CPU in the socket. Don't force it!

## Step 2: Install RAM
Click the RAM sticks into place until you hear a click.

## Step 3: Mount Motherboard
Secure it with screws. Don't overtighten!

*Continue with detailed steps...*

## Conclusion
You did it! Welcome to the PC Master Race!`,
        coverImage: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800",
        category: "Guides",
        tags: ["PC Building", "Guide", "Gaming", "DIY"],
        author: "Tech Reviewer",
        status: "published",
        pinnedPost: true,
        homepagePriority: 60,
    },
    {
        title: "Breaking: Apple Announces Vision Pro 2",
        slug: "apple-vision-pro-2-announcement",
        excerpt: "Apple's next-generation spatial computer promises even better performance and comfort.",
        content: `# Apple Vision Pro 2 Announced!

Apple just unveiled the Vision Pro 2 with major improvements.

## What's New?
- Lighter design (30% weight reduction)
- M4 chip for better performance
- Improved eye tracking
- Longer battery life (4 hours)
- Lower price: $2,999

## Release Date
Coming Spring 2025

## Our Take
This could finally make spatial computing mainstream!`,
        coverImage: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800",
        category: "News",
        tags: ["Apple", "Vision Pro", "AR", "News"],
        author: "Tech Reviewer",
        status: "published",
        trending: true,
        homepagePriority: 95,
    },
    {
        title: "Secret Unreleased Product Review",
        slug: "secret-unreleased-product",
        excerpt: "This post is hidden from search engines for embargo reasons.",
        content: "This is a secret review under embargo. Not indexed by search engines.",
        coverImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
        category: "Phones",
        tags: ["Secret", "Embargo"],
        author: "Tech Reviewer",
        status: "published",
        hideFromSearch: true,
        homepagePriority: 50,
    },
    {
        title: "Draft Post - Not Published Yet",
        slug: "draft-post-not-published",
        excerpt: "This post is still being written and shouldn't appear on the site.",
        content: "Work in progress...",
        coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
        category: "Gadgets",
        tags: ["Draft"],
        author: "Tech Reviewer",
        status: "draft", // This won't appear on site
        homepagePriority: 0,
    },
];

async function main() {
    console.log("🌱 Seeding sample posts...\n");

    for (const post of samplePosts) {
        const created = await prisma.post.upsert({
            where: { slug: post.slug },
            update: post,
            create: post,
        });
        console.log(`✅ Created: ${created.title}`);
        console.log(`   Status: ${created.status}`);
        console.log(`   Featured: ${created.featuredPost}`);
        console.log(`   Trending: ${created.trending}`);
        console.log(`   Pinned: ${created.pinnedPost}`);
        console.log(`   Hide from Search: ${created.hideFromSearch}`);
        console.log("");
    }

    console.log("✨ Seeding complete!\n");
    console.log("📊 Summary:");
    console.log(`   Total posts: ${samplePosts.length}`);
    console.log(`   Published: ${samplePosts.filter(p => p.status === "published").length}`);
    console.log(`   Drafts: ${samplePosts.filter(p => p.status === "draft").length}`);
    console.log(`   Featured: ${samplePosts.filter(p => p.featuredPost).length}`);
    console.log(`   Trending: ${samplePosts.filter(p => p.trending).length}`);
    console.log(`   Pinned: ${samplePosts.filter(p => p.pinnedPost).length}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
