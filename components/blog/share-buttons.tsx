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
import { trackShare } from "@/lib/analytics";

interface ShareButtonsProps {
    title: string;
    slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const url = `${baseUrl}/blog/${slug}`;
    const text = `Check out: ${title}`;

    const handleShare = (platform: string, shareUrl: string) => {
        trackShare(platform, slug);
        window.open(shareUrl, "_blank", "width=600,height=400");
        setShowMenu(false);
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            trackShare("copy_link", slug);
            setTimeout(() => setCopied(false), 2000);
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
                trackShare("native", slug);
            } catch (err) {
                console.error("Share failed:", err);
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
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border z-10">
                    <div className="py-1">
                        <button
                            onClick={() => handleShare("twitter", shareLinks.twitter)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-secondary transition-colors"
                        >
                            <Twitter className="h-4 w-4" />
                            Twitter
                        </button>
                        <button
                            onClick={() => handleShare("facebook", shareLinks.facebook)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-secondary transition-colors"
                        >
                            <Facebook className="h-4 w-4" />
                            Facebook
                        </button>
                        <button
                            onClick={() => handleShare("linkedin", shareLinks.linkedin)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-secondary transition-colors"
                        >
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                        </button>
                        <button
                            onClick={() => handleShare("whatsapp", shareLinks.whatsapp)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-secondary transition-colors"
                        >
                            <MessageCircle className="h-4 w-4" />
                            WhatsApp
                        </button>
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-secondary transition-colors border-t"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span className="text-green-500">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <LinkIcon className="h-4 w-4" />
                                    Copy Link
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
