"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save } from "lucide-react";

export default function SettingsPage() {
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [settings, setSettings] = useState({
        siteName: "Aana",
        siteDescription: "Your daily dose of technology, gadgets, and future tech",
        contactEmail: "kevaleaditya1@gmail.com",
        twitterUrl: "",
        instagramUrl: "",
        linkedinUrl: "",
        githubUrl: "",
    });

    const handleSave = async () => {
        setSaving(true);
        setMessage("");

        try {
            // TODO: Implement settings API
            // For now, just simulate saving
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMessage("✅ Settings saved successfully!");
        } catch (error) {
            setMessage("❌ Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container px-4 md:px-6 py-8 md:py-12">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">Manage your site configuration</p>
            </div>

            <div className="max-w-2xl space-y-6">
                {/* General Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                        <CardDescription>Basic site information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="siteName" className="text-sm font-medium">
                                Site Name
                            </label>
                            <Input
                                id="siteName"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                placeholder="Your site name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="siteDescription" className="text-sm font-medium">
                                Site Description
                            </label>
                            <Input
                                id="siteDescription"
                                value={settings.siteDescription}
                                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                placeholder="Brief description of your site"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="contactEmail" className="text-sm font-medium">
                                Contact Email
                            </label>
                            <Input
                                id="contactEmail"
                                type="email"
                                value={settings.contactEmail}
                                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                placeholder="contact@example.com"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Social Media */}
                <Card>
                    <CardHeader>
                        <CardTitle>Social Media Links</CardTitle>
                        <CardDescription>Your social media profiles</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="twitterUrl" className="text-sm font-medium">
                                Twitter URL
                            </label>
                            <Input
                                id="twitterUrl"
                                value={settings.twitterUrl}
                                onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                                placeholder="https://twitter.com/yourhandle"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="instagramUrl" className="text-sm font-medium">
                                Instagram URL
                            </label>
                            <Input
                                id="instagramUrl"
                                value={settings.instagramUrl}
                                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                                placeholder="https://instagram.com/yourhandle"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="linkedinUrl" className="text-sm font-medium">
                                LinkedIn URL
                            </label>
                            <Input
                                id="linkedinUrl"
                                value={settings.linkedinUrl}
                                onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                                placeholder="https://linkedin.com/in/yourprofile"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="githubUrl" className="text-sm font-medium">
                                GitHub URL
                            </label>
                            <Input
                                id="githubUrl"
                                value={settings.githubUrl}
                                onChange={(e) => setSettings({ ...settings, githubUrl: e.target.value })}
                                placeholder="https://github.com/yourusername"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex items-center gap-4">
                    <Button onClick={handleSave} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? "Saving..." : "Save Settings"}
                    </Button>
                    {message && <p className="text-sm">{message}</p>}
                </div>

                {/* Note */}
                <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">
                            <strong>Note:</strong> Settings functionality is currently in development.
                            Changes will be saved to the database in a future update.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
