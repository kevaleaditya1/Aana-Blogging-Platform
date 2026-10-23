"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Share2,
    Twitter,
    Facebook,
    Linkedin,
    MessageCircle,
    Link as LinkIcon,
    Check
} from "lucide-react";

interface ShareButtonsProps {
    title: string;
    slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const baseUrl = typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const url = `${baseUrl}/blog/${slug}`;
    const text = `Check out: ${title}`;

    const handleShare = (platform: string, shareUrl: string) => {
        window.open(shareUrl, "_blank", "width=600,height=400,noopener,noreferrer");
        setShowMenu(false);
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            setShowMenu(false);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url,
                });
            } catch (err) {
                // User cancelled or error occurred
                if (err instanceof Error && err.name !== 'AbortError') {
                    console.error("Share failed:", err);
                }
            }
        } else {
            setShowMenu(!showMenu);
        }
    };

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    };

    return (
        <div className="relative">
            <Button
                variant="glass"
                size="sm"
                onClick={handleNativeShare}
                className="gap-2 apple-press"
            >
                <Share2 className="h-4 w-4" />
                Share
            </Button>

            {showMenu && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMenu(false)}
                    />

                    {/* Liquid Glass Popover */}
                    <div className="absolute right-0 mt-2 w-60 rounded-2xl glass-floating z-20 overflow-hidden p-1.5 animate-in fade-in zoom-in-95 duration-150">
                        <div className="py-1">
                            <button
                                onClick={() => handleShare("twitter", shareLinks.twitter)}
                                className="flex items-center gap-3 w-full px-3 py-2 text-xs rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                            >
                                <div className="h-7 w-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Twitter className="h-3.5 w-3.5 text-blue-500" />
                                </div>
                                <span className="font-medium text-foreground">Share on Twitter</span>
                            </button>
                            <button
                                onClick={() => handleShare("facebook", shareLinks.facebook)}
                                className="flex items-center gap-3 w-full px-3 py-2 text-xs rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                            >
                                <div className="h-7 w-7 rounded-lg bg-blue-600/10 flex items-center justify-center">
                                    <Facebook className="h-3.5 w-3.5 text-blue-600" />
                                </div>
                                <span className="font-medium text-foreground">Share on Facebook</span>
                            </button>
                            <button
                                onClick={() => handleShare("linkedin", shareLinks.linkedin)}
                                className="flex items-center gap-3 w-full px-3 py-2 text-xs rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                            >
                                <div className="h-7 w-7 rounded-lg bg-blue-700/10 flex items-center justify-center">
                                    <Linkedin className="h-3.5 w-3.5 text-blue-700" />
                                </div>
                                <span className="font-medium text-foreground">Share on LinkedIn</span>
                            </button>
                            <button
                                onClick={() => handleShare("whatsapp", shareLinks.whatsapp)}
                                className="flex items-center gap-3 w-full px-3 py-2 text-xs rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                            >
                                <div className="h-7 w-7 rounded-lg bg-green-500/10 flex items-center justify-center">
                                    <MessageCircle className="h-3.5 w-3.5 text-green-500" />
                                </div>
                                <span className="font-medium text-foreground">Share on WhatsApp</span>
                            </button>
                            <div className="my-1 border-t border-black/[0.05] dark:border-white/[0.08]" />
                            <button
                                onClick={handleCopyLink}
                                className="flex items-center gap-3 w-full px-3 py-2 text-xs rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                            >
                                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    {copied ? (
                                        <Check className="h-3.5 w-3.5 text-green-500" />
                                    ) : (
                                        <LinkIcon className="h-3.5 w-3.5 text-primary" />
                                    )}
                                </div>
                                <span className="font-medium text-foreground">
                                    {copied ? "Link Copied!" : "Copy Link"}
                                </span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
