import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const additionalPosts = [
    {
        title: "iPhone 15 vs iPhone 16: Which Should You Buy?",
        slug: "iphone-15-vs-16-comparison",
        excerpt: "Detailed comparison between iPhone 15 and iPhone 16 to help you make the right choice.",
        content: `# iPhone 15 vs iPhone 16 Comparison

Wondering if you should upgrade to the iPhone 16 or stick with the iPhone 15? Let's compare.

## Design Changes
The iPhone 16 features a new titanium frame, while the 15 has stainless steel.

## Camera Improvements
- iPhone 16: 48MP main + 5x telephoto
- iPhone 15: 48MP main + 3x telephoto

## Performance
The A18 Pro chip in iPhone 16 is 30% faster than the A17 Pro.

## Verdict
If you have iPhone 15, wait. If upgrading from older models, go for iPhone 16!`,
        coverImage: "https://images.unsplash.com/photo-1592286927505-b0501739c61b?w=800",
        category: "Phones",
        tags: ["iPhone", "Apple", "Comparison", "iPhone 15", "iPhone 16"],
        author: "Tech Reviewer",
        status: "published",
        trending: true,
        homepagePriority: 85,
    },
    {
        title: "Samsung Galaxy S24 Ultra Review: Android's Best",
        slug: "samsung-galaxy-s24-ultra-review",
        excerpt: "Samsung's flagship smartphone sets new standards for Android devices with incredible features.",
        content: `# Samsung Galaxy S24 Ultra Review

The Galaxy S24 Ultra is Samsung's most powerful smartphone yet.

## S Pen Integration
Built-in S Pen makes this phone perfect for productivity.

## Camera System
- 200MP main camera
- 10x periscope zoom
- Incredible night mode

## Display
6.8" Dynamic AMOLED with 120Hz refresh rate.

## Verdict
Best Android phone of 2024!`,
        coverImage: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
        category: "Phones",
        tags: ["Samsung", "Android", "Review", "Flagship"],
        author: "Tech Reviewer",
        status: "published",
        homepagePriority: 75,
    },
    {
        title: "Google Pixel 8 Pro: AI-Powered Photography",
        slug: "google-pixel-8-pro-review",
        excerpt: "Google's AI magic makes the Pixel 8 Pro the best camera phone you can buy.",
        content: `# Google Pixel 8 Pro Review

The Pixel 8 Pro combines Google's AI prowess with excellent hardware.

## AI Features
- Magic Eraser
- Best Take
- Audio Magic Eraser
- Real-time translation

## Camera
Google's computational photography is unmatched.

## Pure Android
Clean Android experience with 7 years of updates!

## Verdict
Best camera phone, hands down!`,
        coverImage: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
        category: "Phones",
        tags: ["Google", "Pixel", "AI", "Camera", "Review"],
        author: "Tech Reviewer",
        status: "published",
        homepagePriority: 70,
    },
    {
        title: "Midjourney vs DALL-E 3: AI Art Showdown",
        slug: "midjourney-vs-dalle-comparison",
        excerpt: "Which AI image generator creates better art? We compare the two leading platforms.",
        content: `# Midjourney vs DALL-E 3

Both are incredible AI art generators, but which one is better?

## Midjourney Strengths
- Artistic, painterly style
- Great for creative projects
- Active community

## DALL-E 3 Strengths
- Better text rendering
- More accurate prompts
- Integrated with ChatGPT

## Pricing
- Midjourney: $10-60/month
- DALL-E 3: Pay per image

## Winner?
Depends on your needs!`,
        coverImage: "https://images.unsplash.com/photo-1686191128892-c1c1f4f9c1fc?w=800",
        category: "AI Tools",
        tags: ["AI", "Midjourney", "DALL-E", "Comparison", "Art"],
        author: "Tech Reviewer",
        status: "published",
        trending: true,
        homepagePriority: 88,
    },
    {
        title: "Best AI Tools for Content Creators in 2024",
        slug: "best-ai-tools-content-creators",
        excerpt: "Supercharge your content creation workflow with these amazing AI tools.",
        content: `# Best AI Tools for Content Creators

AI is revolutionizing content creation. Here are the must-have tools.

## 1. ChatGPT
Perfect for writing, brainstorming, and editing.

## 2. Midjourney
Create stunning visuals for your content.

## 3. Descript
AI-powered video editing with text.

## 4. Jasper
AI copywriting for marketing.

## 5. Runway ML
Advanced video AI tools.

Transform your workflow today!`,
        coverImage: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800",
        category: "AI Tools",
        tags: ["AI", "Content Creation", "ChatGPT", "Tools", "Productivity"],
        author: "Tech Reviewer",
        status: "published",
        homepagePriority: 82,
    },
    {
        title: "AirPods Pro 2 vs Sony WF-1000XM5: Battle of the Buds",
        slug: "airpods-pro-2-vs-sony-comparison",
        excerpt: "Which premium wireless earbuds should you buy? We compare the top contenders.",
        content: `# AirPods Pro 2 vs Sony WF-1000XM5

Both are excellent, but which one wins?

## AirPods Pro 2
- Seamless Apple integration
- Spatial audio
- Great ANC
- $249

## Sony WF-1000XM5
- Best ANC in class
- Superior sound quality
- LDAC support
- $299

## Winner?
iPhone users: AirPods Pro 2
Audiophiles: Sony WF-1000XM5`,
        coverImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
        category: "Gadgets",
        tags: ["Earbuds", "Apple", "Sony", "Comparison", "Audio"],
        author: "Tech Reviewer",
        status: "published",
        homepagePriority: 65,
    },
    {
        title: "Meta Quest 3: The Future of VR Gaming",
        slug: "meta-quest-3-review",
        excerpt: "Meta's latest VR headset brings mixed reality to the mainstream with incredible features.",
        content: `# Meta Quest 3 Review

The Quest 3 is the best standalone VR headset you can buy.

## Mixed Reality
Full-color passthrough makes AR experiences incredible.

## Performance
Snapdragon XR2 Gen 2 delivers smooth gameplay.

## Game Library
Access to thousands of VR games and apps.

## Price
$499 for 128GB - great value!

## Verdict
VR gaming has never been better!`,
        coverImage: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800",
        category: "Gadgets",
        tags: ["VR", "Meta", "Gaming", "Review", "AR"],
        author: "Tech Reviewer",
        status: "published",
        trending: true,
        homepagePriority: 78,
    },
    {
        title: "How to Set Up Your First Smart Home",
        slug: "smart-home-setup-guide",
        excerpt: "Complete beginner's guide to creating an automated smart home on any budget.",
        content: `# Smart Home Setup Guide

Turn your house into a smart home with this step-by-step guide.

## Step 1: Choose Your Ecosystem
- Apple HomeKit
- Google Home
- Amazon Alexa

## Step 2: Start with Basics
- Smart lights (Philips Hue)
- Smart speaker
- Smart plug

## Step 3: Add Security
- Video doorbell
- Smart locks
- Security cameras

## Step 4: Automation
Create routines and scenes!

## Budget
Start from $200, scale up as needed.`,
        coverImage: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800",
        category: "Guides",
        tags: ["Smart Home", "Guide", "Automation", "Beginner"],
        author: "Tech Reviewer",
        status: "published",
        pinnedPost: true,
        homepagePriority: 90,
    },
];

async function main() {
    console.log("🌱 Adding more sample posts for testing...\n");

    for (const post of additionalPosts) {
        const created = await prisma.post.upsert({
            where: { slug: post.slug },
            update: post,
            create: post,
        });
        console.log(`✅ Created: ${created.title}`);
        console.log(`   Category: ${created.category}`);
        console.log(`   Tags: ${created.tags.join(", ")}`);
        console.log(`   Trending: ${created.trending || false}`);
        console.log("");
    }

    console.log("✨ Additional posts created!\n");
    console.log("📊 Testing scenarios:");
    console.log("   1. iPhone posts will show related iPhone posts");
    console.log("   2. AI Tools posts will show related AI posts");
    console.log("   3. Gadgets posts will show related gadgets");
    console.log("   4. Posts with overlapping tags will appear as related");
    console.log("\n🎯 Visit any blog post to see related posts in action!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
