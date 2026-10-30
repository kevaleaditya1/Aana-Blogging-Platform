import { randomBytes } from "node:crypto";
import prisma from "@/lib/prisma";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";
import { sendUnitpostEmail, unitpostConfiguration } from "@/lib/email/unitpost";
import { confirmationURL } from "@/lib/email/confirmation";
import { unsubscribeLinks } from "@/lib/email/unsubscribe";

const escapeHTML = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
function emailCard(title: string, content: string) {
    return `<!doctype html><html lang="en"><body style="margin:0;background:#f5f5f7;font-family:Arial,sans-serif;color:#1d1d1f"><div style="max-width:560px;margin:32px auto;padding:32px;background:#ffffff;border-radius:20px"><p style="font-size:32px;letter-spacing:-1px;margin:0 0 24px">aana</p><h1 style="font-size:24px">${title}</h1>${content}<p style="margin-top:32px;font-size:13px">Need help? <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p></div></body></html>`;
}

// Called only by Auth.js's successful-sign-in event, not sign-in page visits or authorization attempts.
export async function sendAccountWelcome(email: string) {
    const user = await prisma.user.findUnique({ where: { email: email.trim() }, select: { id: true, email: true, welcomeEmailQueuedAt: true } });
    if (!user?.email || user.welcomeEmailQueuedAt) return;
    const result = await sendUnitpostEmail({
        to: user.email, subject: "Welcome to Aana",
        html: emailCard("Welcome to Aana", `<p>Your account is ready. You can save articles and join discussions.</p><p><a href="${SITE_URL}/blog">Explore the latest articles</a></p><p>This email follows your first successful sign-in. You have not been subscribed to the newsletter.</p>`),
        text: `Welcome to Aana. Your account is ready. Explore articles at ${SITE_URL}/blog. This email follows your first successful sign-in and does not subscribe you to the newsletter. Contact: ${CONTACT_EMAIL}`,
        idempotencyKey: `aana-account-welcome/v1/${user.id}`,
    });
    await prisma.user.updateMany({ where: { id: user.id, welcomeEmailQueuedAt: null }, data: { welcomeEmailQueuedAt: new Date(), welcomeEmailId: result.id } });
}

export async function requestNewsletterWelcome(email: string) {
    unitpostConfiguration();
    const now = new Date();
    const version = randomBytes(16).toString("hex");
    const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    let subscriber = await prisma.newsletterSubscriber.upsert({
        where: { email }, update: {},
        create: { email, isActive: false, confirmationVersion: version, confirmationExpiresAt: expires },
    });
    if (subscriber.isActive && subscriber.verifiedAt) return { state: "already_subscribed" as const };
    if (!subscriber.confirmationVersion || !subscriber.confirmationExpiresAt || subscriber.confirmationExpiresAt <= now) {
        await prisma.newsletterSubscriber.updateMany({
            where: { id: subscriber.id, confirmationVersion: subscriber.confirmationVersion, isActive: subscriber.isActive, verifiedAt: subscriber.verifiedAt, unsubscribedAt: subscriber.unsubscribedAt },
            data: { confirmationVersion: version, confirmationExpiresAt: expires, confirmationEmailQueuedAt: null, confirmationEmailId: null, isActive: false },
        });
        subscriber = await prisma.newsletterSubscriber.findUniqueOrThrow({ where: { id: subscriber.id } });
    }
    if (subscriber.isActive && subscriber.verifiedAt) return { state: "already_subscribed" as const };
    if (!subscriber.confirmationVersion || !subscriber.confirmationExpiresAt || subscriber.confirmationExpiresAt <= now) throw new Error("Confirmation could not be prepared. Try again.");
    const stillPending = await prisma.$transaction(async transaction => {
        // Lock this pending version while syncing the legacy list, so a concurrent
        // confirmation cannot be overwritten back to inactive by a repeated request.
        const locked = await transaction.newsletterSubscriber.updateMany({ where: { id: subscriber.id, confirmationVersion: subscriber.confirmationVersion, isActive: false }, data: { isActive: false } });
        if (!locked.count) return false;
        await transaction.subscriber.upsert({ where: { email }, create: { email, active: false }, update: { active: false } });
        return true;
    });
    if (!stillPending) {
        const current = await prisma.newsletterSubscriber.findUniqueOrThrow({ where: { id: subscriber.id } });
        if (current.isActive && current.verifiedAt) return { state: "already_subscribed" as const };
        throw new Error("Subscription request changed. Try again.");
    }
    // Repeated form requests reuse the same queued message/link rather than sending another email.
    if (subscriber.confirmationEmailQueuedAt) return { state: "confirmation_required" as const };
    const link = confirmationURL(subscriber.id, subscriber.confirmationVersion, subscriber.confirmationExpiresAt);
    const unsubscribe = unsubscribeLinks(subscriber.id);
    const until = subscriber.confirmationExpiresAt.toUTCString();
    const result = await sendUnitpostEmail({
        to: email, subject: "Welcome to Aana — confirm your newsletter subscription",
        html: emailCard("Welcome to the Aana newsletter", `<p>Thanks for signing up. Confirm your email address to start receiving our technology updates.</p><p><a href="${escapeHTML(link)}" style="display:inline-block;padding:14px 24px;background:#0071e3;color:#ffffff;border-radius:24px">Confirm my subscription</a></p><p>This link expires ${escapeHTML(until)}.</p><p>If you did not request this, ignore this email. You will not receive newsletters unless you confirm.</p><p><a href="${escapeHTML(unsubscribe.page)}">Cancel this subscription request</a></p>`),
        text: `Welcome to the Aana newsletter. Confirm your subscription: ${link}\nThis link expires ${until}. If you did not request this, ignore this email. No newsletters will be sent unless you confirm. Cancel: ${unsubscribe.page}`,
        headers: { "List-Unsubscribe": `<${unsubscribe.oneClick}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
        idempotencyKey: `aana-newsletter-welcome/v1/${subscriber.id}/${subscriber.confirmationVersion}`,
    });
    await prisma.newsletterSubscriber.updateMany({ where: { id: subscriber.id, confirmationVersion: subscriber.confirmationVersion }, data: { confirmationEmailQueuedAt: new Date(), confirmationEmailId: result.id } });
    return { state: "confirmation_required" as const };
}
