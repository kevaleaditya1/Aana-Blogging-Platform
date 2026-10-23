"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check, AlertCircle } from "lucide-react";

export function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes("@")) {
            setStatus("error");
            setMessage("Please enter a valid email address");
            return;
        }

        setStatus("loading");

        try {
            const response = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setMessage("Thanks for subscribing! Check your email.");
                setEmail("");
            } else {
                setStatus("error");
                setMessage(data.error || "Something went wrong. Please try again.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Failed to subscribe. Please try again later.");
        }
    };

    return (
        <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={status === "loading" || status === "success"}
                            className="pl-10 rounded-full glass-input"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={status === "loading" || status === "success"}
                        className="rounded-full px-5 bg-foreground text-background hover:opacity-90 apple-press shadow-sm shrink-0"
                    >
                        {status === "loading" ? "Subscribing..." : "Subscribe"}
                    </Button>
                </div>

                {status === "success" && (
                    <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-500/10 backdrop-blur-md py-2 px-3 rounded-full">
                        <Check className="h-4 w-4" />
                        <span>{message}</span>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex items-center justify-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-500/10 backdrop-blur-md py-2 px-3 rounded-full">
                        <AlertCircle className="h-4 w-4" />
                        <span>{message}</span>
                    </div>
                )}
            </form>
        </div>
    );
}
