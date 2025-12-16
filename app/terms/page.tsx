import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service - Aana Tech Blog",
    description: "Terms of service for Aana Tech Blog",
};

export default function TermsPage() {
    return (
        <div className="container px-4 md:px-6 py-12 md:py-20">
            <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-a:text-primary">
                <h1>Terms of Service</h1>

                <p className="lead">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <h2>1. Acceptance of Terms</h2>
                <p>
                    By accessing and using Aana Tech Blog, you accept and agree to be bound by the terms
                    and provision of this agreement.
                </p>

                <h2>2. Use License</h2>
                <p>
                    Permission is granted to temporarily access the materials (information or software) on
                    Aana Tech Blog for personal, non-commercial transitory viewing only.
                </p>

                <h2>3. User Accounts</h2>
                <p>When you create an account with us, you must provide accurate and complete information.</p>
                <ul>
                    <li>You are responsible for maintaining the security of your account</li>
                    <li>You are responsible for all activities that occur under your account</li>
                    <li>You must notify us immediately of any unauthorized use</li>
                </ul>

                <h2>4. User Content</h2>
                <p>Our service allows you to post, link, and share content. You are responsible for:</p>
                <ul>
                    <li>The content you post</li>
                    <li>Ensuring your content doesn't violate any laws</li>
                    <li>Ensuring your content doesn't infringe on others' rights</li>
                </ul>

                <h2>5. Prohibited Uses</h2>
                <p>You may not use our service:</p>
                <ul>
                    <li>In any way that violates any applicable law or regulation</li>
                    <li>To transmit any advertising or promotional material</li>
                    <li>To impersonate or attempt to impersonate the blog owner or other users</li>
                    <li>To engage in any automated use of the system</li>
                </ul>

                <h2>6. Intellectual Property</h2>
                <p>
                    The content on this blog, including text, graphics, logos, and images, is the property
                    of Aana Tech Blog and is protected by copyright laws.
                </p>

                <h2>7. Disclaimer</h2>
                <p>
                    The materials on Aana Tech Blog are provided on an 'as is' basis. We make no
                    warranties, expressed or implied, and hereby disclaim all other warranties.
                </p>

                <h2>8. Limitations</h2>
                <p>
                    In no event shall Aana Tech Blog or its suppliers be liable for any damages arising
                    out of the use or inability to use the materials on our website.
                </p>

                <h2>9. Modifications</h2>
                <p>
                    We may revise these terms of service at any time without notice. By using this website,
                    you agree to be bound by the current version of these terms.
                </p>

                <h2>10. Contact Information</h2>
                <p>
                    If you have any questions about these Terms, please contact us at:{" "}
                    <a href="mailto:kevaleaditya1@gmail.com">kevaleaditya1@gmail.com</a>
                </p>
            </div>
        </div>
    );
}
