"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Search, Settings, Eye } from "lucide-react";

interface PostTabsProps {
    children: {
        content: React.ReactNode;
        seo: React.ReactNode;
        settings: React.ReactNode;
        preview?: React.ReactNode;
    };
}

export function PostTabs({ children }: PostTabsProps) {
    return (
        <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Content
                </TabsTrigger>
                <TabsTrigger value="seo" className="gap-2">
                    <Search className="h-4 w-4" />
                    SEO
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-6">
                {children.content}
            </TabsContent>

            <TabsContent value="seo" className="mt-6">
                {children.seo}
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
                {children.settings}
            </TabsContent>

            <TabsContent value="preview" className="mt-6">
                {children.preview || <div className="text-center text-muted-foreground py-12">Preview coming soon...</div>}
            </TabsContent>
        </Tabs>
    );
}
