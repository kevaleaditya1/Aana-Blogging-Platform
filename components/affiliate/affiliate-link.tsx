"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface AffiliateLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    showIcon?: boolean;
}

export function AffiliateLink({
    href,
    children,
    className = "",
    showIcon = false,
}: AffiliateLinkProps) {
    return (
        <Link
            href={href}
            target="_blank"
            rel="nofollow noopener noreferrer sponsored"
            className={`text-primary hover:underline inline-flex items-center gap-1 ${className}`}
        >
            {children}
            {showIcon && <ExternalLink className="h-3 w-3" />}
        </Link>
    );
}

interface AffiliateButtonProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary";
}

export function AffiliateButton({
    href,
    children,
    className = "",
    variant = "primary",
}: AffiliateButtonProps) {
    const baseStyles = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors";
    const variantStyles = variant === "primary"
        ? "bg-primary text-primary-foreground hover:bg-primary/90"
        : "bg-secondary text-secondary-foreground hover:bg-secondary/80";

    return (
        <Link
            href={href}
            target="_blank"
            rel="nofollow noopener noreferrer sponsored"
            className={`${baseStyles} ${variantStyles} ${className}`}
        >
            {children}
            <ExternalLink className="h-4 w-4" />
        </Link>
    );
}

interface ProductCardProps {
    title: string;
    description: string;
    price: string;
    image: string;
    affiliateLink: string;
    rating?: number;
}

export function ProductCard({
    title,
    description,
    price,
    image,
    affiliateLink,
    rating,
}: ProductCardProps) {
    return (
        <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative bg-muted">
                <img
                    src={image}
                    alt={title}
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="p-4 space-y-3">
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
                {rating && (
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-medium">{rating}/5</span>
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{price}</span>
                    <AffiliateButton href={affiliateLink}>
                        Buy Now
                    </AffiliateButton>
                </div>
            </div>
        </div>
    );
}

export function AffiliateDisclosure() {
    return (
        <div className="my-8 p-4 border-l-4 border-primary/50 bg-muted/50 rounded">
            <p className="text-sm text-muted-foreground">
                <strong>Disclosure:</strong> This post contains affiliate links. If you make a purchase through these links, we may earn a commission at no extra cost to you. We only recommend products we genuinely believe in.
            </p>
        </div>
    );
}
