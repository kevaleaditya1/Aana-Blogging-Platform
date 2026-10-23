"use client";

import { useEffect } from "react";

interface AdSenseProps {
    adSlot: string;
    adFormat?: string;
    fullWidthResponsive?: boolean;
}

function AdSense({
    adSlot,
    adFormat = "auto",
    fullWidthResponsive = true
}: AdSenseProps) {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error("AdSense error:", err);
        }
    }, []);

    return (
        <div className="my-8">
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-8999010834139123"
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive.toString()}
            />
        </div>
    );
}

// In-article ad component
export function InArticleAd() {
    return (
        <AdSense
            adSlot="1234567890" // Replace with your ad slot ID
            adFormat="fluid"
        />
    );
}
