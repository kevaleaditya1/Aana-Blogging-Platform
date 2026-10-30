import { privateMetadata } from "@/lib/site";
import { NewsletterConfirmation } from "@/components/newsletter-confirmation";
export const metadata = privateMetadata("Confirm newsletter subscription");
export default async function ConfirmPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;
    return <NewsletterConfirmation token={token} />;
}
