"use client";

import { PublicForm } from "@/components/public-form";
import { CookiePreferencesButton } from "@/components/privacy-controls";
import { CONTACT_EMAIL } from "@/lib/site";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";


import { Instagram } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-black/[0.05] dark:border-white/[0.08] glass-subtle text-muted-foreground relative z-10">
            <div className="container px-4 md:px-8 max-w-7xl mx-auto py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-border/40">
                    <div className="space-y-3">
                        <Link href="/" aria-label="Aana home" className="inline-flex items-center">
                            <BrandLogo />
                        </Link>
                        <p className="text-[13px] leading-relaxed text-muted-foreground">
                            Independent technology journalism, deep hardware insights, and future-forward software reviews.
                        </p>
                        <p className="text-sm break-all"><a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
                        <CookiePreferencesButton />
                        <div className="flex gap-4 pt-1">
                            <Link
                                href="https://www.instagram.com/aana.blogs/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Instagram className="h-4 w-4" />
                                <span className="sr-only">Instagram</span>
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
                            Subscribe to technology updates from Aana.
                        </p>
                        <PublicForm kind="newsletter" compact />
                    </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[12px] text-muted-foreground gap-4">
                    <p>
                        &copy; {new Date().getFullYear()} Aana. All rights reserved.
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
