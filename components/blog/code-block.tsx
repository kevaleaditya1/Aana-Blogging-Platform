"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
    children: string;
    className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Extract language from className (e.g., "language-javascript")
    const language = className?.replace("language-", "") || "text";

    return (
        <div className="my-6 rounded-2xl overflow-hidden border border-black/[0.08] dark:border-white/[0.12] bg-[#161618]/90 backdrop-blur-xl text-[#f5f5f7] shadow-xl">
            {/* macOS Frosted Glass Window Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.04] backdrop-blur-md border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
                </div>
                
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/50 font-medium">
                    {language}
                </span>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2.5 rounded-full text-[11px] text-white/80 hover:text-white glass-subtle transition-colors apple-press"
                    onClick={handleCopy}
                >
                    {copied ? (
                        <>
                            <Check className="h-3 w-3 mr-1 text-emerald-400" />
                            Copied
                        </>
                    ) : (
                        <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                        </>
                    )}
                </Button>
            </div>

            {/* Code Body */}
            <pre className="p-4 overflow-x-auto text-[13px] font-mono leading-relaxed bg-transparent">
                <code className={className}>{children}</code>
            </pre>
        </div>
    );
}
