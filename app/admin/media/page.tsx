"use client";

import { useEffect, useState } from "react";
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
import { ArrowLeft, Upload, Copy, Trash2, Image as ImageIcon } from "lucide-react";

interface MediaItem {
    public_id: string;
    secure_url: string;
    created_at: string;
    bytes: number;
    format: string;
}

export default function MediaLibraryPage() {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        try {
            const response = await fetch("/api/admin/media");
            const data = await response.json();
            setMedia(data.resources || []);
        } catch (error) {
            console.error("Failed to fetch media:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                fetchMedia();
            } else {
                alert("Failed to upload image");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const copyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        alert("URL copied to clipboard!");
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    };

    if (loading) {
        return (
            <div className="container px-4 md:px-6 py-12">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading media library...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container px-4 md:px-6 py-8 md:py-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Link>
                        </Button>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Media Library</h1>
                    <p className="text-muted-foreground mt-2">Manage your uploaded images</p>
                </div>
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        className="hidden"
                        id="media-upload"
                        disabled={uploading}
                    />
                    <Button asChild disabled={uploading}>
                        <label htmlFor="media-upload" className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            {uploading ? "Uploading..." : "Upload Image"}
                        </label>
                    </Button>
                </div>
            </div>

            {/* Media Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {media.length === 0 ? (
                    <div className="col-span-full text-center py-20">
                        <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">No images uploaded yet</p>
                        <Button asChild>
                            <label htmlFor="media-upload" className="cursor-pointer">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Your First Image
                            </label>
                        </Button>
                    </div>
                ) : (
                    media.map((item) => (
                        <Card key={item.public_id} className="overflow-hidden hover-lift">
                            <div className="aspect-square relative bg-muted">
                                <img
                                    src={item.secure_url}
                                    alt={item.public_id}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <CardContent className="p-4">
                                <p className="text-xs text-muted-foreground mb-2 truncate">
                                    {item.public_id}
                                </p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                                    <span>{item.format.toUpperCase()}</span>
                                    <span>{formatBytes(item.bytes)}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => copyUrl(item.secure_url)}
                                    >
                                        <Copy className="h-3 w-3 mr-1" />
                                        Copy URL
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
