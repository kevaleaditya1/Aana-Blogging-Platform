"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

export function NewsletterSignup() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setMessage("✅ Subscribed! Check your email.");
                setEmail("");
            } else {
                setMessage("❌ Something went wrong. Try again.");
            }
        } catch (error) {
            setMessage("❌ Failed to subscribe.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-9"
                        disabled={loading}
                    />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? "..." : "Subscribe"}
                </Button>
            </form>
            {message && (
                <p className="text-xs mt-2">{message}</p>
            )}
        </div>
    );
}

// Compact version for sidebar
export function NewsletterSignupCompact() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setMessage("✅ Subscribed!");
                setEmail("");
            } else {
                setMessage("❌ Try again.");
            }
        } catch (error) {
            setMessage("❌ Failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">📧 Get Tech Updates</h3>
            <p className="text-sm text-muted-foreground mb-4">
                Join 1,000+ readers getting weekly tech insights
            </p>
            <form onSubmit={handleSubmit} className="space-y-2">
                <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Subscribing..." : "Subscribe Free"}
                </Button>
                {message && (
                    <p className="text-xs text-center">{message}</p>
                )}
            </form>
        </div>
    );
}
