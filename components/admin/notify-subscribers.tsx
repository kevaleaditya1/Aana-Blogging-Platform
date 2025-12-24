"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function NotifySubscribers() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        postSlug: "",
        postTitle: "",
        postExcerpt: "",
        postCategory: "",
    });
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/notify-subscribers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to send notifications");
            }

            toast({
                title: "Notifications Sent!",
                description: `Successfully sent ${data.sent}/${data.total} email notifications`,
            });

            // Reset form
            setFormData({
                postSlug: "",
                postTitle: "",
                postExcerpt: "",
                postCategory: "",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to send notifications",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Notify Subscribers
                </CardTitle>
                <CardDescription>
                    Send email notifications to all subscribers about a new post
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="postSlug">Post Slug *</Label>
                        <Input
                            id="postSlug"
                            value={formData.postSlug}
                            onChange={(e) => setFormData({ ...formData, postSlug: e.target.value })}
                            placeholder="my-awesome-post"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="postTitle">Post Title *</Label>
                        <Input
                            id="postTitle"
                            value={formData.postTitle}
                            onChange={(e) => setFormData({ ...formData, postTitle: e.target.value })}
                            placeholder="My Awesome Post"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="postCategory">Category *</Label>
                        <Input
                            id="postCategory"
                            value={formData.postCategory}
                            onChange={(e) => setFormData({ ...formData, postCategory: e.target.value })}
                            placeholder="Technology"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="postExcerpt">Excerpt *</Label>
                        <Textarea
                            id="postExcerpt"
                            value={formData.postExcerpt}
                            onChange={(e) => setFormData({ ...formData, postExcerpt: e.target.value })}
                            placeholder="A brief description of your post..."
                            rows={3}
                            required
                        />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full gap-2">
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Send Notifications
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
