import { isEmail } from "@/lib/validation";
import { CONTACT_EMAIL } from "@/lib/site";

export type UnitpostMessage = {
    to: string;
    subject: string;
    html: string;
    text?: string;
    headers?: Record<string, string>;
    idempotencyKey: string;
};

export function unitpostConfiguration() {
    const apiKey = process.env.UNITPOST_API_KEY?.trim();
    const from = process.env.NEWSLETTER_FROM?.trim();
    const address = from?.match(/<([^>]+)>$/)?.[1] || from;
    if (!apiKey || !from || !isEmail(address)) throw new Error("Configure UNITPOST_API_KEY and NEWSLETTER_FROM before sending newsletters.");
    return { apiKey, from };
}

export async function sendUnitpostEmail(message: UnitpostMessage): Promise<{ id: string; status: string }> {
    const { apiKey, from } = unitpostConfiguration();
    if (!isEmail(message.to) || !message.subject.trim() || !message.html.trim() || !message.idempotencyKey || message.idempotencyKey.length > 256) throw new Error("Invalid newsletter email parameters.");
    let response: Response;
    try {
        response = await fetch("https://www.unitpost.com/api/v1/email", {
            method: "POST", redirect: "error", cache: "no-store", signal: AbortSignal.timeout(15000),
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "User-Agent": "Aana-Newsletter/1.0", "Idempotency-Key": message.idempotencyKey },
            body: JSON.stringify({ from, to: message.to, reply_to: CONTACT_EMAIL, subject: message.subject, html: message.html, ...(message.text ? { text: message.text } : {}), ...(message.headers ? { headers: message.headers } : {}), open_tracking: false, click_tracking: false }),
        });
    } catch {
        // Do not log provider request/response bodies, addresses or API keys.
        throw new Error("Unitpost could not be reached. Retry using the same idempotency key.");
    }
    const result: unknown = await response.json().catch(() => null);
    if (!response.ok) throw new Error(`Unitpost rejected the email (HTTP ${response.status}). Check the sending domain, key scope and account limits.`);
    if (!result || typeof result !== "object" || !("id" in result) || typeof result.id !== "string" || !("status" in result) || !["queued", "scheduled"].includes(String(result.status))) throw new Error("Unitpost did not confirm that this email was queued.");
    return { id: result.id, status: String(result.status) };
}
