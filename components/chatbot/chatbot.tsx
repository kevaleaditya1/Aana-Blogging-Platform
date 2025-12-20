"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

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
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                    aria-label="Open chat"
                >
                    <MessageCircle className="h-6 w-6" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <Card className="fixed bottom-6 right-6 z-50 w-[380px] h-[500px] flex flex-col shadow-2xl border-2">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full">
                                <MessageCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Tech Assistant</h3>
                                <p className="text-xs text-white/80">Always here to help</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-1 rounded transition-colors"
                            aria-label="Close chat"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/5">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${message.sender === "user"
                                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                                            : "bg-secondary text-secondary-foreground"
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                                    <p
                                        className={`text-xs mt-1 ${message.sender === "user"
                                                ? "text-white/70"
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

                    {/* Input */}
                    <div className="p-4 border-t bg-background">
                        <div className="flex gap-2">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Type your message..."
                                className="flex-1"
                            />
                            <Button
                                onClick={handleSend}
                                size="icon"
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </>
    );
}
