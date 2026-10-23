"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
}

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hi! 👋 I'm your tech assistant. How can I help you today?",
            sender: "bot",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");

        // Simulate bot response
        setTimeout(() => {
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: getBotResponse(inputValue),
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
        }, 1000);
    };

    const getBotResponse = (userInput: string): string => {
        const input = userInput.toLowerCase();

        if (input.includes("hello") || input.includes("hi")) {
            return "Hello! Welcome to Aana. How can I assist you with tech news and reviews today?";
        } else if (input.includes("phone") || input.includes("smartphone")) {
            return "Looking for smartphone info? Check out our latest phone reviews and comparisons! You can browse our Phones category for detailed reviews.";
        } else if (input.includes("ai") || input.includes("artificial intelligence")) {
            return "Interested in AI? We cover the latest AI tools and technologies. Visit our AI Tools category for more!";
        } else if (input.includes("help")) {
            return "I can help you with:\n• Finding articles and reviews\n• Navigating the site\n• Tech recommendations\n• Latest news updates\n\nWhat would you like to know?";
        } else if (input.includes("contact")) {
            return "You can reach us through our Contact page or email us directly. We'd love to hear from you!";
        } else {
            return "Thanks for your message! For specific queries, try browsing our categories or use the search feature. Is there anything specific you'd like to know about?";
        }
    };

    return (
        <>
            {/* Liquid Glass Chat Launcher Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 h-13 w-13 rounded-full flex items-center justify-center glass-floating shadow-[0_12px_32px_rgba(0,113,227,0.25)] hover:shadow-[0_16px_40px_rgba(0,113,227,0.35)] hover-lift apple-press transition-all duration-300 group"
                    aria-label="Open chat"
                >
                    <div className="relative flex items-center justify-center">
                        <MessageCircle className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                        </span>
                    </div>
                </button>
            )}

            {/* Liquid Glass Chat Sheet */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[530px] flex flex-col rounded-3xl glass-floating overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {/* Frosted Header */}
                    <div className="p-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-foreground tracking-tight">Aana Assistant</h3>
                                <p className="text-[11px] text-muted-foreground">Interactive Tech Intelligence</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
                            aria-label="Close chat"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Messages Container with Translucent Bubbles */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-transparent">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`max-w-[84%] px-4 py-2.5 text-[13px] leading-relaxed ${message.sender === "user"
                                            ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-xs shadow-[0_4px_14px_rgba(0,113,227,0.3)]"
                                            : "glass-card text-foreground rounded-2xl rounded-tl-xs"
                                        }`}
                                >
                                    <p className="whitespace-pre-line">{message.text}</p>
                                    <p
                                        className={`text-[10px] mt-1 text-right ${message.sender === "user"
                                                ? "text-primary-foreground/75"
                                                : "text-muted-foreground"
                                            }`}
                                    >
                                        {message.timestamp.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Frosted Input Toolbar */}
                    <div className="p-3 border-t border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02]">
                        <div className="flex gap-2 items-center">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Ask about smartphones, AI, guides..."
                                className="flex-1 h-9 rounded-full glass-input text-xs px-4"
                            />
                            <Button
                                onClick={handleSend}
                                size="icon"
                                className="h-9 w-9 rounded-full bg-primary text-primary-foreground hover:opacity-90 shrink-0 apple-press shadow-sm"
                            >
                                <Send className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
