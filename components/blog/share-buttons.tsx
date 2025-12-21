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
                variant="outline"
                size="sm"
                onClick={handleNativeShare}
                className="gap-2"
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

                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-background border z-20 overflow-hidden">
                        <div className="py-1">
                            <button
                                onClick={() => handleShare("twitter", shareLinks.twitter)}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-secondary transition-colors"
                            >
                                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <Twitter className="h-4 w-4 text-blue-500" />
                                </div>
                                <span className="font-medium">Share on Twitter</span>
                            </button>
                            <button
                                onClick={() => handleShare("facebook", shareLinks.facebook)}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-secondary transition-colors"
                            >
                                <div className="h-8 w-8 rounded-full bg-blue-600/10 flex items-center justify-center">
                                    <Facebook className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="font-medium">Share on Facebook</span>
                            </button>
                            <button
                                onClick={() => handleShare("linkedin", shareLinks.linkedin)}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-secondary transition-colors"
                            >
                                <div className="h-8 w-8 rounded-full bg-blue-700/10 flex items-center justify-center">
                                    <Linkedin className="h-4 w-4 text-blue-700" />
                                </div>
                                <span className="font-medium">Share on LinkedIn</span>
                            </button>
                            <button
                                onClick={() => handleShare("whatsapp", shareLinks.whatsapp)}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-secondary transition-colors"
                            >
                                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <MessageCircle className="h-4 w-4 text-green-500" />
                                </div>
                                <span className="font-medium">Share on WhatsApp</span>
                            </button>
                            <div className="border-t my-1" />
                            <button
                                onClick={handleCopyLink}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-secondary transition-colors"
                            >
                                {copied ? (
                                    <>
                                        <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                            <Check className="h-4 w-4 text-green-500" />
                                        </div>
                                        <span className="font-medium text-green-500">Link Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="h-8 w-8 rounded-full bg-gray-500/10 flex items-center justify-center">
                                            <LinkIcon className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <span className="font-medium">Copy Link</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
