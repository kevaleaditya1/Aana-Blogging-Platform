import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🔧 Creating test post for hide from category...\n");

    // Create a post that's hidden from entire site
    const hiddenPost = await prisma.post.upsert({
        where: { slug: "hidden-test-post" },
        update: {
            showInCategory: false,
        },
        create: {
            title: "Hidden Test Post - Should Not Appear Anywhere",
            slug: "hidden-test-post",
            excerpt: "This post has showInCategory = false, so it should be hidden from the entire website.",
            content: "# Hidden Post\n\nThis post should not appear on:\n- Homepage\n- Blog page\n- Category pages\n- Anywhere!\n\nBut it's still accessible via direct URL: /blog/hidden-test-post",
            coverImage: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800",
            category: "Gadgets",
            tags: ["Test", "Hidden"],
            author: "Tech Reviewer",
            status: "published",
            showInCategory: false, // This hides it from entire site
            homepagePriority: 85,
        },
    });

    console.log(`✅ Created: ${hiddenPost.title}`);
    console.log(`   Status: ${hiddenPost.status}`);
    console.log(`   Show in Category: ${hiddenPost.showInCategory}`);
    console.log(`   URL: /blog/${hiddenPost.slug}`);
    console.log("\n📝 Test Instructions:");
    console.log("   1. Visit homepage - should NOT see this post");
    console.log("   2. Visit /category/gadgets - should NOT see this post");
    console.log("   3. Visit /blog/hidden-test-post - SHOULD work (direct access)");
    console.log("\n✨ Test post created!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
