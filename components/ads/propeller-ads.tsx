"use client";

import { useEffect } from "react";

interface PropellerAdsProps {
    zoneId: string;
    type?: "banner" | "popunder" | "native";
}

export function PropellerAds({ zoneId, type = "banner" }: PropellerAdsProps) {
    useEffect(() => {
        // PropellerAds script will be loaded here
        const script = document.createElement("script");
        script.async = true;
        script.setAttribute("data-cfasync", "false");
        script.src = `//thubanoa.com/${zoneId}/invoke.js`;

        const container = document.getElementById(`propeller-${zoneId}`);
        if (container) {
            container.appendChild(script);
        }

        return () => {
            if (container && script.parentNode) {
                container.removeChild(script);
            }
        };
    }, [zoneId]);

    return (
        <div id={`propeller-${zoneId}`} className="my-8 flex justify-center">
            {/* PropellerAds will inject content here */}
        </div>
    );
}

// Banner Ad Component
export function PropellerBanner({ zoneId }: { zoneId: string }) {
    return <PropellerAds zoneId={zoneId} type="banner" />;
}

// Instructions for setup:
// 1. Sign up at https://propellerads.com/
// 2. Create ad zones in your dashboard
// 3. Copy the zone IDs
// 4. Replace zoneId prop with your actual zone ID
// Example: <PropellerBanner zoneId="1234567" />
