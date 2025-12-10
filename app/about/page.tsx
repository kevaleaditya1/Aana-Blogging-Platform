import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us - Ashitya",
    description: "Learn more about Ashitya and our mission.",
};

export default function AboutPage() {
    return (
        <div className="container px-4 md:px-6 py-12 md:py-20 max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-8">
                About Ashitya
            </h1>
            <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p>
                    Welcome to <strong>Ashitya</strong>, your premier destination for the
                    latest in technology, gadgets, and digital innovation.
                </p>
                <p>
                    Founded in 2025, our mission is to simplify technology for everyone.
                    Whether you're a tech enthusiast looking for deep dives into the
                    latest silicon, or a casual user wondering which phone to buy next,
                    we've got you covered.
                </p>
                <h2>Our Vision</h2>
                <p>
                    We believe technology should be accessible, understandable, and
                    exciting. We strive to provide unbiased reviews, in-depth guides, and
                    the latest news without the jargon.
                </p>
                <h2>The Team</h2>
                <p>
                    Ashitya is run by a team of passionate tech lovers who live and
                    breathe gadgets. We test everything so you don't have to.
                </p>
            </div>
        </div>
    );
}
