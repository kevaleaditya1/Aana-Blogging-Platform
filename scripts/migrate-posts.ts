import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migratePostsToDatabase() {
    try {
        const postsDirectory = path.join(process.cwd(), "content/posts");

        if (!fs.existsSync(postsDirectory)) {
            console.log("❌ No posts directory found at:", postsDirectory);
            return;
        }

        const fileNames = fs.readdirSync(postsDirectory);
        const mdxFiles = fileNames.filter((fileName) => fileName.endsWith(".mdx"));

        console.log(`📚 Found ${mdxFiles.length} MDX files to migrate\n`);

        let migrated = 0;
        let skipped = 0;
        let errors = 0;

        for (const fileName of mdxFiles) {
            const slug = fileName.replace(/\.mdx$/, "");
            const fullPath = path.join(postsDirectory, fileName);

            try {
                const fileContents = fs.readFileSync(fullPath, "utf8");
                const { data, content } = matter(fileContents);

                // Check if post already exists
                const existing = await prisma.post.findUnique({
                    where: { slug },
                });

                if (existing) {
                    console.log(`⏭️  Skipping ${slug} (already exists)`);
                    skipped++;
                    continue;
                }

                // Create post in database
                await prisma.post.create({
                    data: {
                        slug,
                        title: data.title || slug,
                        excerpt: data.excerpt || "",
                        content: content,
                        coverImage: data.coverImage || "/images/default-cover.jpg",
                        category: data.category || "Uncategorized",
                        tags: Array.isArray(data.tags) ? data.tags : [],
                        author: data.author || "Aana",
                        published: true,
                        createdAt: data.date ? new Date(data.date) : new Date(),
                    },
                });

                console.log(`✅ Migrated: ${slug}`);
                migrated++;
            } catch (error) {
                console.error(`❌ Error migrating ${slug}:`, error);
                errors++;
            }
        }

        console.log(`\n🎉 Migration complete!`);
        console.log(`   ✅ Migrated: ${migrated}`);
        console.log(`   ⏭️  Skipped: ${skipped}`);
        console.log(`   ❌ Errors: ${errors}`);

    } catch (error) {
        console.error("❌ Migration failed:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

migratePostsToDatabase()
    .catch((error) => {
        console.error("Fatal error:", error);
        process.exit(1);
    });
