"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Linkedin, Github } from "lucide-react";

export function Footer() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setMessage("✅ Subscribed successfully!");
                setEmail("");
            } else {
                setMessage("❌ Failed to subscribe");
            }
        } catch (error) {
            setMessage("❌ Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="border-t bg-background">
            <div className="container px-4 md:px-6 py-12 md:py-16 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                Aana
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Your daily dose of technology, gadgets, and future tech. Stay ahead
                            of the curve with Aana.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Categories</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/category/phones" className="hover:text-primary">
                                    Smartphones
                                </Link>
                            </li>
                            <li>
                                <Link href="/category/gadgets" className="hover:text-primary">
                                    Gadgets
                                </Link>
                            </li>
                            <li>
                                <Link href="/category/ai-tools" className="hover:text-primary">
                                    AI Tools
                                </Link>
                            </li>
                            <li>
                                <Link href="/category/guides" className="hover:text-primary">
                                    Buying Guides
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/about" className="hover:text-primary">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-primary">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-primary">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-primary">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Subscribe</h3>
                        <p className="text-sm text-muted-foreground">
                            Get the latest tech news and reviews delivered to your inbox.
                        </p>
                        <form onSubmit={handleSubscribe} className="space-y-2">
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-secondary/50"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Button type="submit" disabled={loading}>
                                    {loading ? "..." : "Subscribe"}
                                </Button>
                            </div>
                            {message && (
                                <p className="text-xs">{message}</p>
                            )}
                        </form>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>
                        &copy; {new Date().getFullYear()} Aana. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
