// Run this script to create your admin account
// Usage: npx tsx create-admin.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        const email = "kevaleaditya1@gmail.com";
        const password = "Ashitya@2605";
        const name = "Aditya";

        // Check if user already exists
        const existing = await prisma.user.findUnique({
            where: { email },
        });

        if (existing) {
            console.log("❌ User already exists!");
            console.log("Try logging in or reset your password.");
            process.exit(1);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin user
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: "ADMIN",
            },
        });

        console.log("✅ Admin account created successfully!");
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Role:", user.role);
        console.log("\nYou can now login at /admin/login");

        await prisma.$disconnect();
        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating admin:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

createAdmin();
