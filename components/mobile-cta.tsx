"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { usePrivacy } from "@/components/privacy-controls";

export function MobileCTA() {
    const pathname = usePathname();
    const { preferencesOpen } = usePrivacy();
    const [keyboardOpen, setKeyboardOpen] = useState(false);
    useEffect(() => {
        const update = () => setKeyboardOpen(Boolean(document.activeElement?.matches("input, textarea, select, [contenteditable=true]")) || Boolean(window.visualViewport && window.innerHeight - window.visualViewport.height > 150));
        document.addEventListener("focusin", update); document.addEventListener("focusout", update);
        window.visualViewport?.addEventListener("resize", update);
        return () => { document.removeEventListener("focusin", update); document.removeEventListener("focusout", update); window.visualViewport?.removeEventListener("resize", update); };
    }, []);
    // Reading is the main conversion. Keep the bar on the homepage only.
    if (pathname !== "/" || preferencesOpen || keyboardOpen) return null;
    return <nav aria-label="Quick reading action" className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 pb-[max(.75rem,env(safe-area-inset-bottom))] md:hidden">
        <Link href="/blog" className="flex min-h-11 items-center justify-center rounded-full bg-foreground px-5 font-medium text-background">Explore articles</Link>
    </nav>;
}
