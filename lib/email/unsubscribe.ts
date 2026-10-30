import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE_URL } from "@/lib/site";

function secret() {
    const value = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET;
    if (!value || value.length < 32) throw new Error("Configure a strong NEWSLETTER_UNSUBSCRIBE_SECRET before newsletter delivery.");
    return value;
}
export function unsubscribeToken(subscriberId: string): string {
    if (!/^[a-z0-9]{10,80}$/i.test(subscriberId)) throw new Error("Invalid subscriber identifier.");
    const signature = createHmac("sha256", secret()).update(`aana-newsletter-unsubscribe:v1:${subscriberId}`).digest("base64url");
    return `${subscriberId}.${signature}`;
}
export function verifyUnsubscribeToken(token: unknown): string | null {
    if (typeof token !== "string" || token.length > 160) return null;
    const [id, signature, extra] = token.split(".");
    if (!id || !signature || extra || !/^[a-z0-9]{10,80}$/i.test(id) || !/^[a-z0-9_-]{43}$/i.test(signature)) return null;
    const expected = Buffer.from(unsubscribeToken(id).split(".")[1]);
    const received = Buffer.from(signature);
    return received.length === expected.length && timingSafeEqual(received, expected) ? id : null;
}
export function unsubscribeLinks(subscriberId: string) {
    const token = unsubscribeToken(subscriberId);
    return { page: `${SITE_URL}/unsubscribe/${token}`, oneClick: `${SITE_URL}/api/newsletter/unsubscribe?token=${token}` };
}
