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
        <div className="relative group">
            <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleCopy}
            >
                {copied ? (
                    <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied!
                    </>
                ) : (
                    <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                    </>
                )}
            </Button>
            <pre className={className}>
                <code className={className}>{children}</code>
            </pre>
        </div>
    );
}
