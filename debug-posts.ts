// Quick debug script to check posts in database
import prisma from "./lib/prisma";

async function checkPosts() {
    console.log("Checking all posts in database...\n");

    const allPosts = await prisma.post.findMany({
        select: {
            slug: true,
            title: true,
            published: true,
            status: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    console.log(`Total posts: ${allPosts.length}\n`);

    allPosts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   Published (old): ${post.published}`);
        console.log(`   Status (new): ${post.status}`);
        console.log(`   Created: ${post.createdAt}`);
        console.log("");
    });

    const publishedOld = allPosts.filter(p => p.published === true);
    const publishedNew = allPosts.filter(p => p.status === "published");

    console.log(`Posts with published=true: ${publishedOld.length}`);
    console.log(`Posts with status="published": ${publishedNew.length}`);
}

checkPosts()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
