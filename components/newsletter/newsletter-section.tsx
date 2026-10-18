import { NewsletterForm } from "./newsletter-form";
import { Mail } from "lucide-react";

export function NewsletterSection() {
    return (
        <section className="py-20 md:py-28 border-t border-border/40 bg-secondary/30">
            <div className="container px-4 md:px-8 max-w-7xl mx-auto">
                <div className="max-w-xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-primary/10 text-primary mb-2">
                        <Mail className="h-5 w-5" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                        Stay ahead of the curve.
                    </h2>

                    <p className="text-base text-muted-foreground leading-relaxed">
                        Curated tech briefings, hardware teardowns, and actionable AI discoveries delivered straight to your inbox weekly.
                    </p>

                    <div className="pt-4 flex justify-center">
                        <NewsletterForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
