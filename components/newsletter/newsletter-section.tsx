import { NewsletterForm } from "./newsletter-form";
import { Mail } from "lucide-react";

export function NewsletterSection() {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5">
            <div className="container px-4 md:px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6">
                        <Mail className="h-6 w-6 text-primary" />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
                        Stay Updated
                    </h2>

                    <p className="text-lg text-muted-foreground mb-8">
                        Get the latest tech news, reviews, and guides delivered to your inbox weekly.
                        No spam, unsubscribe anytime.
                    </p>

                    <div className="flex justify-center">
                        <NewsletterForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
