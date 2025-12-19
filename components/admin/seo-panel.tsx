"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { calculateSEOScore } from "@/lib/post-helpers";
import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface SEOPanelProps {
    title: string;
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
    content: string;
    onMetaTitleChange: (value: string) => void;
    onMetaDescriptionChange: (value: string) => void;
    onFocusKeywordChange: (value: string) => void;
}

export function SEOPanel({
    title,
    metaTitle,
    metaDescription,
    focusKeyword,
    content,
    onMetaTitleChange,
    onMetaDescriptionChange,
    onFocusKeywordChange,
}: SEOPanelProps) {
    const [seoScore, setSeoScore] = useState({ score: 0, suggestions: [] as string[] });

    useEffect(() => {
        const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
        const score = calculateSEOScore({
            title: metaTitle || title,
            metaDescription,
            focusKeyword,
            content,
            headings,
        });
        setSeoScore(score);
    }, [title, metaTitle, metaDescription, focusKeyword, content]);

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    const getScoreBadge = (score: number) => {
        if (score >= 80) return "Good";
        if (score >= 60) return "Needs Work";
        return "Poor";
    };

    return (
        <div className="space-y-6">
            {/* SEO Score */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>SEO Score</span>
                        <div className="flex items-center gap-2">
                            <span className={`text-3xl font-bold ${getScoreColor(seoScore.score)}`}>
                                {seoScore.score}
                            </span>
                            <Badge variant={seoScore.score >= 80 ? "default" : "secondary"}>
                                {getScoreBadge(seoScore.score)}
                            </Badge>
                        </div>
                    </CardTitle>
                    <CardDescription>
                        Optimize your content for search engines
                    </CardDescription>
                </CardHeader>
                {seoScore.suggestions.length > 0 && (
                    <CardContent>
                        <div className="space-y-2">
                            {seoScore.suggestions.map((suggestion, index) => (
                                <div key={index} className="flex items-start gap-2 text-sm">
                                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                    <span>{suggestion}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Meta Title */}
            <div className="space-y-2">
                <Label htmlFor="metaTitle">
                    Meta Title {metaTitle && `(${metaTitle.length}/60)`}
                </Label>
                <Input
                    id="metaTitle"
                    value={metaTitle}
                    onChange={(e) => onMetaTitleChange(e.target.value)}
                    placeholder={title || "Enter meta title..."}
                    maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                    Optimal length: 50-60 characters. Leave empty to use post title.
                </p>
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
                <Label htmlFor="metaDescription">
                    Meta Description {metaDescription && `(${metaDescription.length}/160)`}
                </Label>
                <Textarea
                    id="metaDescription"
                    value={metaDescription}
                    onChange={(e) => onMetaDescriptionChange(e.target.value)}
                    placeholder="Enter a compelling description for search results..."
                    maxLength={160}
                    rows={3}
                />
                <p className="text-xs text-muted-foreground">
                    Optimal length: 150-160 characters
                </p>
            </div>

            {/* Focus Keyword */}
            <div className="space-y-2">
                <Label htmlFor="focusKeyword">Focus Keyword</Label>
                <Input
                    id="focusKeyword"
                    value={focusKeyword}
                    onChange={(e) => onFocusKeywordChange(e.target.value)}
                    placeholder="e.g., best smartphones 2025"
                />
                <p className="text-xs text-muted-foreground">
                    Main keyword you want to rank for
                </p>
            </div>

            {/* Google Preview */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Google Search Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        <div className="text-sm text-blue-600">
                            {metaTitle || title || "Your Post Title"}
                        </div>
                        <div className="text-xs text-green-700">
                            aanaa.blog › blog › {title.toLowerCase().replace(/\s+/g, '-')}
                        </div>
                        <div className="text-sm text-gray-600">
                            {metaDescription || "Your meta description will appear here..."}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
