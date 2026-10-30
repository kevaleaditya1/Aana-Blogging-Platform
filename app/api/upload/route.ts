import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

// Log configuration on startup
console.log("Cloudinary Config:", {
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "NOT SET",
    api_key: process.env.CLOUDINARY_API_KEY ? "SET" : "NOT SET",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "SET" : "NOT SET",
});

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!(file instanceof File) || !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type) || file.size > 10 * 1024 * 1024) {
            console.error("No file in request");
            return NextResponse.json({ error: "Provide a JPG, PNG, WebP or GIF under 10 MB." }, { status: 400 });
        }

        console.log("File received:", file.name, file.type, file.size);

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        console.log("Starting Cloudinary upload...");

        // Upload to Cloudinary
        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: "Aana-blog",
                        resource_type: "auto",
                    },
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary upload error:", error);
                            reject(error);
                        } else {
                            console.log("Upload successful:", result?.secure_url);
                            if (result) resolve(result); else reject(new Error("Upload returned no result"));
                        }
                    }
                )
                .end(buffer);
        });

        return NextResponse.json({
            success: true,
            url: result.secure_url,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            {
                error: "Failed to upload image",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
