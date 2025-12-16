import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy - Aana Tech Blog",
    description: "Privacy policy for Aana Tech Blog",
};

export default function PrivacyPage() {
    return (
        <div className="container px-4 md:px-6 py-12 md:py-20">
            <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-a:text-primary">
                <h1>Privacy Policy</h1>

                <p className="lead">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <h2>Information We Collect</h2>
                <p>
                    When you use our blog, we may collect the following information:
                </p>
                <ul>
                    <li>Email address (when you create an account or comment)</li>
                    <li>Name (optional, for display purposes)</li>
                    <li>Usage data via Google Analytics</li>
                </ul>

                <h2>How We Use Your Information</h2>
                <p>We use the collected information to:</p>
                <ul>
                    <li>Provide and maintain our service</li>
                    <li>Allow you to comment on blog posts</li>
                    <li>Save your bookmarks</li>
                    <li>Improve our content and user experience</li>
                    <li>Send you updates (if you opt-in)</li>
                </ul>

                <h2>Google Analytics</h2>
                <p>
                    We use Google Analytics to understand how visitors use our site. Google Analytics collects
                    information anonymously and reports website trends without identifying individual visitors.
                </p>

                <h2>Cookies</h2>
                <p>
                    We use cookies to maintain your session and remember your preferences. You can disable
                    cookies in your browser settings, but this may affect site functionality.
                </p>

                <h2>Third-Party Services</h2>
                <p>We use the following third-party services:</p>
                <ul>
                    <li><strong>Google OAuth:</strong> For authentication</li>
                    <li><strong>Cloudinary:</strong> For image hosting</li>
                    <li><strong>Vercel:</strong> For hosting</li>
                </ul>

                <h2>Data Security</h2>
                <p>
                    We implement appropriate security measures to protect your personal information. However,
                    no method of transmission over the internet is 100% secure.
                </p>

                <h2>Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                    <li>Access your personal data</li>
                    <li>Request deletion of your data</li>
                    <li>Opt-out of communications</li>
                </ul>

                <h2>Contact Us</h2>
                <p>
                    If you have questions about this Privacy Policy, please contact us at:{" "}
                    <a href="mailto:kevaleaditya1@gmail.com">kevaleaditya1@gmail.com</a>
                </p>
            </div>
        </div>
    );
}
