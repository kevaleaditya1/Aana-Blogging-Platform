import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestPost() {
    try {
        console.log("Creating test post...");

        const post = await prisma.post.create({
            data: {
                slug: "welcome-to-aana",
                title: "Welcome to Aana - Your Tech Blog",
                excerpt: "Discover the latest in technology, gadgets, and innovation. Welcome to your new home for tech insights!",
                content: `# Welcome to Aana

Welcome to **Aana**, your premier destination for technology news, reviews, and insights!

## What We Cover

- 📱 Latest smartphone reviews
- 💻 Tech tutorials and guides  
- 🚀 Innovation and startups
- 🎮 Gaming news
- 🤖 AI and machine learning

## Our Mission

We're dedicated to bringing you the most relevant and exciting tech content, explained in a way that's accessible to everyone.

Stay tuned for amazing content!`,
                coverImage: "/images/tech-blog.jpg",
                category: "Technology",
                tags: ["welcome", "technology", "blog"],
                author: "Aana",
                published: true,
            },
        });

        console.log("✅ Test post created successfully!");
        console.log("   Slug:", post.slug);
        console.log("   Title:", post.title);
        console.log("\n🎉 You can now view it at: /blog/welcome-to-aana");

    } catch (error) {
        console.error("❌ Error creating test post:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

createTestPost()
    .catch((error) => {
        console.error("Fatal error:", error);
        process.exit(1);
    });
