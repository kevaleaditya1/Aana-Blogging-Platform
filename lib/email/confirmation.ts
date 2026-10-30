import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE_URL } from "@/lib/site";

function secret() {
    const value = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET;
    if (!value || value.length < 32) throw new Error("Newsletter signing secret is not configured.");
    return value;
}
export function confirmationToken(id: string, version: string, expires: Date): string {
    if (!/^[a-z0-9]{10,80}$/i.test(id) || !/^[a-f0-9]{32}$/i.test(version)) throw new Error("Invalid confirmation parameters.");
    const payload = `${id}.${version}.${Math.floor(expires.getTime() / 1000)}`;
    return `${payload}.${createHmac("sha256", secret()).update(`aana-newsletter-confirm:v1:${payload}`).digest("base64url")}`;
}
export function verifyConfirmationToken(token: unknown, now = Date.now()): { id: string; version: string } | null {
    if (typeof token !== "string" || token.length > 200) return null;
    const [id, version, expires, signature, extra] = token.split(".");
    if (extra || !/^[a-z0-9]{10,80}$/i.test(id || "") || !/^[a-f0-9]{32}$/i.test(version || "") || !/^\d{10,11}$/.test(expires || "") || !/^[a-z0-9_-]{43}$/i.test(signature || "")) return null;
    const expiry = Number(expires) * 1000;
    if (expiry <= now || expiry > now + 25 * 60 * 60 * 1000) return null;
    const expected = Buffer.from(confirmationToken(id, version, new Date(expiry)).split(".")[3]);
    const received = Buffer.from(signature);
    return received.length === expected.length && timingSafeEqual(received, expected) ? { id, version } : null;
}
export function confirmationURL(id: string, version: string, expires: Date) {
    return `${SITE_URL}/newsletter/confirm/${confirmationToken(id, version, expires)}`;
}
