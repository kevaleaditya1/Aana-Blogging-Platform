"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SettingsPanelProps {
    // Visibility
    featuredPost: boolean;
    pinnedPost: boolean;
    trending: boolean;
    showInCategory: boolean;
    hideFromSearch: boolean;

    // Content Type
    contentType: string;
    tableOfContents: boolean;

    // Monetization
    sponsoredPost: boolean;
    sponsorName: string;
    affiliateDisclosure: string;
    adsEnabled: boolean;

    // Technical
    commentEnabled: boolean;
    status: string;

    // Handlers
    onVisibilityChange: (field: string, value: boolean) => void;
    onContentTypeChange: (value: string) => void;
    onTableOfContentsChange: (value: boolean) => void;
    onMonetizationChange: (field: string, value: boolean | string) => void;
    onCommentEnabledChange: (value: boolean) => void;
    onStatusChange: (value: string) => void;
}

export function SettingsPanel(props: SettingsPanelProps) {
    return (
        <div className="space-y-6">
            {/* Visibility Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Visibility</CardTitle>
                    <CardDescription>Control where and how this post appears</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="featuredPost">Featured Post</Label>
                        <Switch
                            id="featuredPost"
                            checked={props.featuredPost}
                            onCheckedChange={(checked) => props.onVisibilityChange('featuredPost', checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="pinnedPost">Pinned Post</Label>
                        <Switch
                            id="pinnedPost"
                            checked={props.pinnedPost}
                            onCheckedChange={(checked) => props.onVisibilityChange('pinnedPost', checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="trending">Mark as Trending</Label>
                        <Switch
                            id="trending"
                            checked={props.trending}
                            onCheckedChange={(checked) => props.onVisibilityChange('trending', checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="showInCategory">Show in Category</Label>
                        <Switch
                            id="showInCategory"
                            checked={props.showInCategory}
                            onCheckedChange={(checked) => props.onVisibilityChange('showInCategory', checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="hideFromSearch">Hide from Search</Label>
                        <Switch
                            id="hideFromSearch"
                            checked={props.hideFromSearch}
                            onCheckedChange={(checked) => props.onVisibilityChange('hideFromSearch', checked)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Content Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Content Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="contentType">Content Type</Label>
                        <Select value={props.contentType} onValueChange={props.onContentTypeChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="review">Review</SelectItem>
                                <SelectItem value="news">News</SelectItem>
                                <SelectItem value="guide">Guide</SelectItem>
                                <SelectItem value="opinion">Opinion</SelectItem>
                                <SelectItem value="comparison">Comparison</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="tableOfContents">Table of Contents</Label>
                        <Switch
                            id="tableOfContents"
                            checked={props.tableOfContents}
                            onCheckedChange={props.onTableOfContentsChange}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Monetization */}
            <Card>
                <CardHeader>
                    <CardTitle>Monetization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="sponsoredPost">Sponsored Post</Label>
                        <Switch
                            id="sponsoredPost"
                            checked={props.sponsoredPost}
                            onCheckedChange={(checked) => props.onMonetizationChange('sponsoredPost', checked)}
                        />
                    </div>
                    {props.sponsoredPost && (
                        <div className="space-y-2">
                            <Label htmlFor="sponsorName">Sponsor Name</Label>
                            <Input
                                id="sponsorName"
                                value={props.sponsorName}
                                onChange={(e) => props.onMonetizationChange('sponsorName', e.target.value)}
                                placeholder="Enter sponsor name"
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="affiliateDisclosure">Affiliate Disclosure</Label>
                        <Textarea
                            id="affiliateDisclosure"
                            value={props.affiliateDisclosure}
                            onChange={(e) => props.onMonetizationChange('affiliateDisclosure', e.target.value)}
                            placeholder="This post contains affiliate links..."
                            rows={2}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="adsEnabled">Enable Ads</Label>
                        <Switch
                            id="adsEnabled"
                            checked={props.adsEnabled}
                            onCheckedChange={(checked) => props.onMonetizationChange('adsEnabled', checked)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Publishing */}
            <Card>
                <CardHeader>
                    <CardTitle>Publishing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={props.status} onValueChange={props.onStatusChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="commentEnabled">Enable Comments</Label>
                        <Switch
                            id="commentEnabled"
                            checked={props.commentEnabled}
                            onCheckedChange={props.onCommentEnabledChange}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
