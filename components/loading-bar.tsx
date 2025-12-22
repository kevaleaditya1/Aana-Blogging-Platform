"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "./loading-bar.css";

export function LoadingBar() {
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timeout);
    }, [pathname]);

    if (!loading) return null;

    return (
        <div className="loading-bar-container">
            <div className="loading-bar"></div>
        </div>
    );
}
