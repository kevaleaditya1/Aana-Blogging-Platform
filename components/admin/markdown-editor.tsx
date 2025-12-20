"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Eye, Code } from "lucide-react";
import "highlight.js/styles/github-dark.css";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
    const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Content *</CardTitle>
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "write" | "preview")}>
                        <TabsList>
                            <TabsTrigger value="write" className="gap-2">
                                <Code className="h-4 w-4" />
                                Write
                            </TabsTrigger>
                            <TabsTrigger value="preview" className="gap-2">
                                <Eye className="h-4 w-4" />
                                Preview
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </CardHeader>
            <CardContent>
                {activeTab === "write" ? (
                    <div className="space-y-2">
                        <Textarea
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder || "Write your content in Markdown..."}
                            rows={20}
                            className="font-mono text-sm"
                        />
                        <div className="text-xs text-muted-foreground space-y-1">
                            <p className="font-semibold">Markdown Tips:</p>
                            <div className="grid grid-cols-2 gap-2">
                                <code># Heading 1</code>
                                <code>## Heading 2</code>
                                <code>**bold**</code>
                                <code>*italic*</code>
                                <code>`code`</code>
                                <code>```language code block```</code>
                                <code>[link](url)</code>
                                <code>![image](url)</code>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="prose prose-sm max-w-none dark:prose-invert min-h-[500px] p-4 border rounded-md bg-secondary/5">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                                code({ node, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || "");
                                    const inline = !node?.position;
                                    return !inline && match ? (
                                        <pre className={className}>
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        </pre>
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        >
                            {value || "*No content yet. Switch to Write tab to start writing.*"}
                        </ReactMarkdown>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
