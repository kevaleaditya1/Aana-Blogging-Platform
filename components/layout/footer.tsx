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
        <footer className="border-t border-black/[0.05] dark:border-white/[0.08] glass-subtle text-muted-foreground relative z-10">
            <div className="container px-4 md:px-8 max-w-7xl mx-auto py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-border/40">
                    <div className="space-y-3">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl font-semibold tracking-tight text-foreground">
                                Aana
                            </span>
                        </Link>
                        <p className="text-[13px] leading-relaxed text-muted-foreground">
                            Independent technology journalism, deep hardware insights, and future-forward software reviews.
                        </p>
                        <div className="flex gap-4 pt-1">
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Twitter className="h-4 w-4" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link
                                href="https://www.instagram.com/aana.blogs/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Instagram className="h-4 w-4" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Linkedin className="h-4 w-4" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Github className="h-4 w-4" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                            Categories
                        </h3>
                        <ul className="space-y-2 text-[13px]">
                            <li>
                                <Link href="/category/phones" className="hover:text-foreground transition-colors">
                                    Smartphones
                                </Link>
                            </li>
                            <li>
                                <Link href="/category/gadgets" className="hover:text-foreground transition-colors">
                                    Gadgets
                                </Link>
                            </li>
                            <li>
                                <Link href="/category/ai-tools" className="hover:text-foreground transition-colors">
                                    AI Tools
                                </Link>
                            </li>
                            <li>
                                <Link href="/category/guides" className="hover:text-foreground transition-colors">
                                    Buying Guides
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                            Platform
                        </h3>
                        <ul className="space-y-2 text-[13px]">
                            <li>
                                <Link href="/about" className="hover:text-foreground transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-foreground transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-foreground transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-foreground transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                            Direct Dispatch
                        </h3>
                        <p className="text-[13px] leading-relaxed">
                            Receive our weekend digest of the biggest breakthroughs in tech.
                        </p>
                        <form onSubmit={handleSubscribe} className="space-y-2">
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="email@domain.com"
                                    className="h-8 text-xs rounded-full glass-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Button size="sm" type="submit" disabled={loading} className="h-8 px-3.5 rounded-full text-xs bg-foreground text-background hover:opacity-90 apple-press shadow-sm">
                                    {loading ? "..." : "Join"}
                                </Button>
                            </div>
                            {message && (
                                <p className="text-xs text-primary">{message}</p>
                            )}
                        </form>
                    </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[12px] text-muted-foreground gap-4">
                    <p>
                        &copy; {new Date().getFullYear()} Aana Inc. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                        <span>·</span>
                        <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Use</Link>
                        <span>·</span>
                        <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
