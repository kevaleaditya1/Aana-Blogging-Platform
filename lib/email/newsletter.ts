import { createHash } from "node:crypto";
import prisma from "@/lib/prisma";
import { SITE_URL, plainText } from "@/lib/site";
import { sendUnitpostEmail, unitpostConfiguration } from "@/lib/email/unitpost";
import { unsubscribeLinks } from "@/lib/email/unsubscribe";

interface NewsItem {
    id: string;
    title: string;
    summary: string;
    link: string;
    image?: string;
    source: string;
    category: string;
}

export async function sendNewsletter(to: string[], subject: string, featuredNews: NewsItem[], campaignKey: string) {
    unitpostConfiguration();
    if (!campaignKey || campaignKey.length > 100) throw new Error("A stable newsletter issue key is required.");
    const emails = [...new Set(to.map(email => email.trim().toLowerCase()))];
    const subscribers = await prisma.newsletterSubscriber.findMany({
        where: { email: { in: emails }, isActive: true, verifiedAt: { not: null } },
        select: { id: true, email: true },
    });
    const accepted: Array<{ email: string; id: string }> = [];
    let failed = 0;
    for (const subscriber of subscribers) {
        const links = unsubscribeLinks(subscriber.id);
        const html = generateNewsletterHTML(featuredNews, links.page);
        const recipientHash = createHash("sha256").update(subscriber.email).digest("hex");
        try {
            const result = await sendUnitpostEmail({
                to: subscriber.email, subject, html,
                idempotencyKey: `aana-newsletter/${campaignKey}/${recipientHash}`,
                headers: { "List-Unsubscribe": `<${links.oneClick}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
            });
            accepted.push({ email: subscriber.email, id: result.id });
        } catch {
            failed++;
            console.error("Unitpost did not confirm a newsletter message; consult the provider dashboard.");
        }
    }
    return { accepted, failed, skipped: emails.length - subscribers.length };
}

const escapeHTML = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const safeURL = (value: string) => { try { const url = new URL(value); return url.protocol === "https:" ? escapeHTML(url.href) : ""; } catch { return ""; } };

export function generateNewsletterHTML(news: NewsItem[], unsubscribeURL: string): string {
    news = news.map(item => ({ ...item, title: escapeHTML(plainText(item.title)), summary: escapeHTML(plainText(item.summary).slice(0, 1200)), source: escapeHTML(plainText(item.source)), category: escapeHTML(plainText(item.category)), image: item.image ? safeURL(item.image) : undefined, link: safeURL(item.link) || SITE_URL }));
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aana Tech Newsletter</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #007bff;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #007bff;
      margin: 0;
      font-size: 28px;
    }
    .news-item {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
    .news-item:last-child {
      border-bottom: none;
    }
    .news-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 6px;
      margin-bottom: 15px;
    }
    .news-title {
      font-size: 20px;
      font-weight: 600;
      color: #222;
      margin: 0 0 10px 0;
    }
    .news-meta {
      font-size: 12px;
      color: #666;
      margin-bottom: 10px;
    }
    .news-summary {
      color: #555;
      margin-bottom: 15px;
    }
    .read-more {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #666;
    }
    .footer a {
      color: #007bff;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Aana Tech Newsletter</h1>
      <p style="color: #666; margin: 10px 0 0 0;">Your weekly dose of tech news</p>
    </div>
    
    ${news.map(item => `
      <div class="news-item">
        ${item.image ? `<img src="${item.image}" alt="${item.title}" class="news-image">` : ''}
        <h2 class="news-title">${item.title}</h2>
        <div class="news-meta">
          <span>${item.source}</span> • <span>${item.category}</span>
        </div>
        <p class="news-summary">${item.summary}</p>
        <a href="${item.link}" class="read-more">Read Full Article →</a>
      </div>
    `).join('')}
    
    <div class="footer">
      <p>You're receiving this because you subscribed to Aana Newsletter</p>
      <p>
        <a href="https://aanaa.blog">Visit Website</a> • 
        <a href="${escapeHTML(unsubscribeURL)}">Unsubscribe</a>
      </p>
      <p style="margin-top: 20px;">© ${new Date().getFullYear()} Aana. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}
