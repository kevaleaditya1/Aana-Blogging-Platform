"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            setProgress(scrollPercent);
        };

        window.addEventListener("scroll", updateProgress);
        updateProgress(); // Initial calculation

        return () => window.removeEventListener("scroll", updateProgress);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-black/[0.04] dark:bg-white/[0.06] backdrop-blur-sm pointer-events-none">
            <div
                className="h-full bg-primary shadow-[0_0_12px_rgba(0,113,227,0.8)] transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
