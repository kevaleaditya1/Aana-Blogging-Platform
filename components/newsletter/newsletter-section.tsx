import { NewsletterForm } from "./newsletter-form";
import { Mail } from "lucide-react";

export function NewsletterSection() {
    return (
        <section className="py-20 md:py-28 relative overflow-hidden">
            <div className="container px-4 md:px-8 max-w-7xl mx-auto">
                <div className="relative max-w-2xl mx-auto rounded-3xl glass-card p-8 md:p-12 text-center overflow-hidden shadow-xl border border-black/[0.06] dark:border-white/[0.1]">
                    {/* Ambient subtle glow behind glass */}
                    <div className="absolute -top-24 -left-24 w-60 h-60 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-500/15 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10 space-y-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl glass-subtle text-primary mb-2 shadow-sm">
                            <Mail className="h-6 w-6" />
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                            Stay ahead of the curve.
                        </h2>

                        <p className="text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
                            Curated tech briefings, hardware teardowns, and actionable AI discoveries delivered straight to your inbox weekly.
                        </p>

                        <div className="pt-4 flex justify-center">
                            <NewsletterForm />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
