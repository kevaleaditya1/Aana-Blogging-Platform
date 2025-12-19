"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { PostTabs } from "@/components/admin/post-tabs";
import { SEOPanel } from "@/components/admin/seo-panel";
import { SettingsPanel } from "@/components/admin/settings-panel";
import { calculateReadingTime, generateSlug, validatePost } from "@/lib/post-helpers";
import { useToast } from "@/hooks/use-toast";

interface Props {
    params: Promise<{ slug: string }>;
}

export default function EnhancedEditPostPage({ params }: Props) {
    const router = useRouter();
    const { toast } = useToast();
    const [currentSlug, setCurrentSlug] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Content fields
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");

    // SEO fields
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [focusKeyword, setFocusKeyword] = useState("");

    // Settings - Visibility
    const [featuredPost, setFeaturedPost] = useState(false);
    const [pinnedPost, setPinnedPost] = useState(false);
    const [trending, setTrending] = useState(false);
    const [showInCategory, setShowInCategory] = useState(true);
    const [hideFromSearch, setHideFromSearch] = useState(false);

    // Settings - Content
    const [contentType, setContentType] = useState("guide");
    const [tableOfContents, setTableOfContents] = useState(true);

    // Settings - Monetization
    const [sponsoredPost, setSponsoredPost] = useState(false);
    const [sponsorName, setSponsorName] = useState("");
    const [affiliateDisclosure, setAffiliateDisclosure] = useState("");
    const [adsEnabled, setAdsEnabled] = useState(true);

    // Settings - Publishing
    const [status, setStatus] = useState("published");
    const [commentEnabled, setCommentEnabled] = useState(true);

    useEffect(() => {
        params.then((p) => {
            setCurrentSlug(p.slug);
            fetchPost(p.slug);
        });
    }, [params]);

    const fetchPost = async (postSlug: string) => {
        try {
            const response = await fetch(`/api/admin/posts/${postSlug}`);
            const data = await response.json();

            if (response.ok && data.post) {
                const post = data.post;

                // Core fields
                setTitle(post.title || "");
                setSlug(post.slug || "");
                setExcerpt(post.excerpt || "");
                setContent(post.content || "");
                setCoverImage(post.coverImage || "");
                setCategory(post.category || "");
                setTags(post.tags || []);

                // SEO fields
                setMetaTitle(post.metaTitle || "");
                setMetaDescription(post.metaDescription || "");
                setFocusKeyword(post.focusKeyword || "");

                // Visibility
                setFeaturedPost(post.featuredPost || false);
                setPinnedPost(post.pinnedPost || false);
                setTrending(post.trending || false);
                setShowInCategory(post.showInCategory !== undefined ? post.showInCategory : true);
                setHideFromSearch(post.hideFromSearch || false);

                // Content
                setContentType(post.contentType || "guide");
                setTableOfContents(post.tableOfContents !== undefined ? post.tableOfContents : true);

                // Monetization
                setSponsoredPost(post.sponsoredPost || false);
                setSponsorName(post.sponsorName || "");
                setAffiliateDisclosure(post.affiliateDisclosure || "");
                setAdsEnabled(post.adsEnabled !== undefined ? post.adsEnabled : true);

                // Publishing
                setStatus(post.status || "published");
                setCommentEnabled(post.commentEnabled !== undefined ? post.commentEnabled : true);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to load post",
                    variant: "destructive",
                });
                router.push("/admin/posts");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load post",
                variant: "destructive",
            });
            router.push("/admin/posts");
        } finally {
            setLoading(false);
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleVisibilityChange = (field: string, value: boolean) => {
        switch (field) {
            case 'featuredPost': setFeaturedPost(value); break;
            case 'pinnedPost': setPinnedPost(value); break;
            case 'trending': setTrending(value); break;
            case 'showInCategory': setShowInCategory(value); break;
            case 'hideFromSearch': setHideFromSearch(value); break;
        }
    };

    const handleMonetizationChange = (field: string, value: boolean | string) => {
        switch (field) {
            case 'sponsoredPost': setSponsoredPost(value as boolean); break;
            case 'sponsorName': setSponsorName(value as string); break;
            case 'affiliateDisclosure': setAffiliateDisclosure(value as string); break;
            case 'adsEnabled': setAdsEnabled(value as boolean); break;
        }
    };

    const handleSubmit = async () => {
        const validation = validatePost({
            title,
            excerpt,
            content,
            coverImage,
            category,
            metaTitle,
            metaDescription,
        });

        if (!validation.valid) {
            toast({
                title: "Validation Error",
                description: validation.errors.join(", "),
                variant: "destructive",
            });
            return;
        }

        setSaving(true);

        try {
            const readingTime = calculateReadingTime(content);

            const response = await fetch(`/api/admin/posts/${currentSlug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    slug,
                    excerpt,
                    content,
                    coverImage,
                    category,
                    tags,
                    metaTitle: metaTitle || title,
                    metaDescription,
                    focusKeyword,
                    readingTime,
                    tableOfContents,
                    contentType,
                    featuredPost,
                    pinnedPost,
                    trending,
                    showInCategory,
                    hideFromSearch,
                    sponsoredPost,
                    sponsorName,
                    affiliateDisclosure,
                    adsEnabled,
                    status,
                    commentEnabled,
                    published: status === "published",
                }),
            });

            if (response.ok) {
                toast({
                    title: "Success!",
                    description: "Post updated successfully",
                });
                router.push("/admin/posts");
            } else {
                throw new Error("Failed to update post");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update post. Please try again.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container max-w-6xl px-4 py-8">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/posts">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Edit Post</h1>
                </div>
                <Button onClick={handleSubmit} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Update Post"}
                </Button>
            </div>

            <PostTabs>
                {{
                    content: (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title *</Label>
                                        <Input
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            maxLength={120}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="slug">Slug</Label>
                                        <Input
                                            id="slug"
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="excerpt">Excerpt *</Label>
                                        <Textarea
                                            id="excerpt"
                                            value={excerpt}
                                            onChange={(e) => setExcerpt(e.target.value)}
                                            rows={3}
                                            maxLength={300}
                                        />
                                        <p className="text-xs text-muted-foreground">{excerpt.length}/300</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="coverImage">Cover Image URL *</Label>
                                        <Input
                                            id="coverImage"
                                            value={coverImage}
                                            onChange={(e) => setCoverImage(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="category">Category *</Label>
                                            <Select value={category} onValueChange={setCategory}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="phones">Phones</SelectItem>
                                                    <SelectItem value="gadgets">Gadgets</SelectItem>
                                                    <SelectItem value="ai-tools">AI Tools</SelectItem>
                                                    <SelectItem value="guides">Guides</SelectItem>
                                                    <SelectItem value="news">News</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="tags">Tags</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="tags"
                                                    value={tagInput}
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                                />
                                                <Button type="button" onClick={handleAddTag} variant="outline">
                                                    Add
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {tags.map(tag => (
                                                    <span key={tag} className="bg-secondary px-2 py-1 rounded text-sm flex items-center gap-1">
                                                        {tag}
                                                        <button onClick={() => handleRemoveTag(tag)} className="text-muted-foreground hover:text-foreground">×</button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Content *</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows={20}
                                        className="font-mono"
                                    />
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {content.split(/\s+/).length} words • {calculateReadingTime(content)} min read
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    ),

                    seo: (
                        <SEOPanel
                            title={title}
                            metaTitle={metaTitle}
                            metaDescription={metaDescription}
                            focusKeyword={focusKeyword}
                            content={content}
                            onMetaTitleChange={setMetaTitle}
                            onMetaDescriptionChange={setMetaDescription}
                            onFocusKeywordChange={setFocusKeyword}
                        />
                    ),

                    settings: (
                        <SettingsPanel
                            featuredPost={featuredPost}
                            pinnedPost={pinnedPost}
                            trending={trending}
                            showInCategory={showInCategory}
                            hideFromSearch={hideFromSearch}
                            contentType={contentType}
                            tableOfContents={tableOfContents}
                            sponsoredPost={sponsoredPost}
                            sponsorName={sponsorName}
                            affiliateDisclosure={affiliateDisclosure}
                            adsEnabled={adsEnabled}
                            commentEnabled={commentEnabled}
                            status={status}
                            onVisibilityChange={handleVisibilityChange}
                            onContentTypeChange={setContentType}
                            onTableOfContentsChange={setTableOfContents}
                            onMonetizationChange={handleMonetizationChange}
                            onCommentEnabledChange={setCommentEnabled}
                            onStatusChange={setStatus}
                        />
                    ),

                    preview: (
                        <Card>
                            <CardHeader>
                                <CardTitle>{title || "Your Post Title"}</CardTitle>
                                <p className="text-sm text-muted-foreground">{excerpt}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="prose max-w-none">
                                    {content || "Your content will appear here..."}
                                </div>
                            </CardContent>
                        </Card>
                    ),
                }}
            </PostTabs>
        </div>
    );
}
