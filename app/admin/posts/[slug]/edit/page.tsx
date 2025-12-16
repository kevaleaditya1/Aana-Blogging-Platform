"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export default function EditPostPage({ params }: Props) {
    const router = useRouter();
    const [slug, setSlug] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [coverImage, setCoverImage] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [showCustomCategory, setShowCustomCategory] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        date: "",
        category: "",
        tags: "",
        authorName: "",
        content: "",
    });

    useEffect(() => {
        params.then((p) => {
            setSlug(p.slug);
            fetchPost(p.slug);
        });

        // Fetch existing categories
        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/admin/posts");
                const data = await response.json();
                if (data.posts) {
                    const uniqueCategories = Array.from(
                        new Set(data.posts.map((post: any) => post.category).filter(Boolean))
                    ) as string[];
                    setCategories(uniqueCategories.sort());
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, [params]);

    const fetchPost = async (postSlug: string) => {
        try {
            const response = await fetch(`/api/admin/posts/${postSlug}`);
            const data = await response.json();

            if (response.ok) {
                const existingTags = data.frontmatter.tags || [];
                setFormData({
                    title: data.frontmatter.title || "",
                    excerpt: data.frontmatter.excerpt || "",
                    date: data.frontmatter.date || "",
                    category: data.frontmatter.category || "",
                    tags: existingTags.join(", ") || "",
                    authorName: data.frontmatter.author?.name || "Aditya",
                    content: data.content || "",
                });
                setTags(existingTags);
                setCoverImage(data.frontmatter.coverImage || "");
            } else {
                alert("Failed to load post");
                router.push("/admin");
            }
        } catch (error) {
            console.error("Error fetching post:", error);
            alert("Failed to load post");
            router.push("/admin");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
                setCoverImage(data.url);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const frontmatter = {
            title: formData.title,
            excerpt: formData.excerpt,
            date: formData.date,
            coverImage: coverImage || "/images/cover.jpg",
            category: formData.category,
            author: {
                name: formData.authorName,
                picture: "/images/authors/aditya.jpg",
            },
            ogImage: {
                url: coverImage || "/images/cover.jpg",
            },
            tags: formData.tags.split(",").map((tag) => tag.trim()),
        };

        try {
            const response = await fetch(`/api/admin/posts/${slug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    frontmatter,
                    content: formData.content,
                }),
            });

            if (response.ok) {
                router.push("/admin");
            } else {
                const data = await response.json();
                alert(data.error || "Failed to update post");
            }
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Failed to update post");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-muted-foreground">Loading post...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b">
                <div className="container px-4 md:px-6 py-4">
                    <Button variant="ghost" size="sm" asChild className="mb-2">
                        <Link href="/admin">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Post</h1>
                </div>
            </div>

            <div className="container px-4 md:px-6 py-8 max-w-3xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Post Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-medium">
                                    Title *
                                </label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    placeholder="Enter post title"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="excerpt" className="text-sm font-medium">
                                    Excerpt *
                                </label>
                                <Input
                                    id="excerpt"
                                    value={formData.excerpt}
                                    onChange={(e) =>
                                        setFormData({ ...formData, excerpt: e.target.value })
                                    }
                                    placeholder="Short description"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="date" className="text-sm font-medium">
                                        Date *
                                    </label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) =>
                                            setFormData({ ...formData, date: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="category" className="text-sm font-medium">
                                        Category *
                                    </label>
                                    {!showCustomCategory ? (
                                        <div className="flex gap-2">
                                            <select
                                                id="category"
                                                value={formData.category}
                                                onChange={(e) => {
                                                    if (e.target.value === "__custom__") {
                                                        setShowCustomCategory(true);
                                                        setFormData({ ...formData, category: "" });
                                                    } else {
                                                        setFormData({ ...formData, category: e.target.value });
                                                    }
                                                }}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                required
                                            >
                                                <option value="">Select a category...</option>
                                                {categories.map((cat) => (
                                                    <option key={cat} value={cat}>
                                                        {cat}
                                                    </option>
                                                ))}
                                                <option value="__custom__">+ Add New Category</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Input
                                                id="category"
                                                value={formData.category}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, category: e.target.value })
                                                }
                                                placeholder="Enter new category"
                                                required
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setShowCustomCategory(false);
                                                    setFormData({ ...formData, category: "" });
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="tags" className="text-sm font-medium">
                                    Tags
                                </label>
                                <div className="space-y-2">
                                    {/* Display existing tags as badges */}
                                    {tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="gap-1">
                                                    {tag}
                                                    <X
                                                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                                                        onClick={() => {
                                                            const newTags = tags.filter((_, i) => i !== index);
                                                            setTags(newTags);
                                                            setFormData({ ...formData, tags: newTags.join(", ") });
                                                        }}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    {/* Input for new tags */}
                                    <Input
                                        id="tags"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "," || e.key === "Enter") {
                                                e.preventDefault();
                                                const newTag = tagInput.trim();
                                                if (newTag && !tags.includes(newTag)) {
                                                    const newTags = [...tags, newTag];
                                                    setTags(newTags);
                                                    setFormData({ ...formData, tags: newTags.join(", ") });
                                                    setTagInput("");
                                                }
                                            }
                                        }}
                                        placeholder="Type a tag and press comma or Enter"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Press comma or Enter after each tag
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Cover Image
                                </label>
                                <div className="space-y-4">
                                    {coverImage ? (
                                        <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
                                            <Image
                                                src={coverImage}
                                                alt="Cover"
                                                fill
                                                className="object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setCoverImage("")}
                                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">
                                                    {uploading ? "Uploading..." : "Click to upload cover image"}
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="content" className="text-sm font-medium">
                                    Content (Markdown) *
                                </label>
                                <textarea
                                    id="content"
                                    value={formData.content}
                                    onChange={(e) =>
                                        setFormData({ ...formData, content: e.target.value })
                                    }
                                    className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Write your post content in Markdown..."
                                    required
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={saving}>
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push("/admin")}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
