import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us - Aana",
    description: "Learn more about Aana and our mission.",
};

export default function AboutPage() {
    return (
        <div className="container px-4 md:px-8 py-12 md:py-20 max-w-3xl mx-auto">
            <div className="mb-10 pb-8 border-b border-border/40">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 block">
                    Our Mission
                </span>
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
                    About Aana
                </h1>
            </div>
            <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-foreground/90">
                <p className="text-lg text-muted-foreground leading-relaxed">
                    Welcome to <strong>Aana</strong>, an independent technology publication dedicated to deep hardware analysis, software innovation, and future-forward tech guides.
                </p>
                <p>
                    Founded with a focus on editorial clarity, our mission is to cut through marketing hype. Whether you're an engineer exploring neural architectures or someone looking for honest, real-world smartphone battery tests, we craft stories grounded in technical rigor and design simplicity.
                </p>
                <h2>Our Principles</h2>
                <p>
                    We believe technology journalism should be lucid, transparent, and aesthetically respectful of your attention. We do not bury insights in unnecessary jargon or prioritize clickbait over substance.
                </p>
                <h2>The Editorial Standard</h2>
                <p>
                    Every hardware comparison, buying guide, and software breakdown is built on hands-on evaluation, meticulous testing, and independent editorial judgment.
                </p>
            </div>
        </div>
    );
}
