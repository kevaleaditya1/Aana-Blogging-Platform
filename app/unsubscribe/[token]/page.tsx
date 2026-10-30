import { UnsubscribeForm } from "@/components/unsubscribe-form";
import { privateMetadata } from "@/lib/site";
export const metadata = privateMetadata("Newsletter preferences");
export default async function UnsubscribePage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;
    return <UnsubscribeForm token={token} />;
}
