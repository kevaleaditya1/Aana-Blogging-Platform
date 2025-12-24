import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

interface NewPostEmailData {
    postTitle: string;
    postExcerpt: string;
    postSlug: string;
    postCategory: string;
}

export async function sendNewPostNotification(data: NewPostEmailData) {
    try {
        // Get all active subscribers
        const subscribers = await prisma.subscriber.findMany({
            where: {
                active: true,
            },
            select: {
                email: true,
            },
        });

        if (subscribers.length === 0) {
            console.log("No active subscribers to notify");
            return { success: true, sent: 0 };
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const postUrl = `${siteUrl}/blog/${data.postSlug}`;

        // Send email to all subscribers
        const emailPromises = subscribers.map((subscriber) =>
            resend.emails.send({
                from: "Aana Blog <noreply@yourdomain.com>", // Update with your domain
                to: subscriber.email,
                subject: `New Post: ${data.postTitle}`,
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                            .badge { display: inline-block; background: #667eea; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; margin-bottom: 15px; }
                            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>📰 New Post Published!</h1>
                            </div>
                            <div class="content">
                                <span class="badge">${data.postCategory}</span>
                                <h2>${data.postTitle}</h2>
                                <p>${data.postExcerpt}</p>
                                <a href="${postUrl}" class="button">Read Full Article →</a>
                            </div>
                            <div class="footer">
                                <p>You're receiving this because you subscribed to Aana Blog.</p>
                                <p><a href="${siteUrl}/unsubscribe">Unsubscribe</a></p>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
            })
        );

        const results = await Promise.allSettled(emailPromises);
        const successCount = results.filter((r) => r.status === "fulfilled").length;

        console.log(`Sent ${successCount}/${subscribers.length} email notifications`);

        return {
            success: true,
            sent: successCount,
            total: subscribers.length,
        };
    } catch (error) {
        console.error("Error sending new post notifications:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
