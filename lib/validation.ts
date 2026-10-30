export type FormKind = "contact" | "newsletter" | "signup";
export type FieldErrors = Record<string, string>;
export function isEmail(value: unknown): value is string {
    return typeof value === "string" && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
export function validateForm(kind: FormKind, data: Record<string, unknown>): FieldErrors {
    const errors: FieldErrors = {};
    if (!isEmail(data.email)) errors.email = "Enter a valid email address, such as name@example.com.";
    if (kind !== "newsletter" && (typeof data.name !== "string" || data.name.trim().length < 2 || data.name.length > 100)) errors.name = "Enter a name between 2 and 100 characters.";
    if (kind === "contact" && (typeof data.message !== "string" || data.message.trim().length < 10 || data.message.length > 5000)) errors.message = "Enter a message between 10 and 5,000 characters.";
    if (kind === "signup" && (typeof data.password !== "string" || data.password.length < 8 || data.password.length > 72)) errors.password = "Use a password between 8 and 72 characters.";
    return errors;
}
