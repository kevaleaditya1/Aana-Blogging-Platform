"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Search, Sun, Moon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function Header() {
    const { setTheme, theme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Ashitya
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link
                            href="/category/phones"
                            className="transition-colors hover:text-primary"
                        >
                            Phones
                        </Link>
                        <Link
                            href="/category/gadgets"
                            className="transition-colors hover:text-primary"
                        >
                            Gadgets
                        </Link>
                        <Link
                            href="/category/ai-tools"
                            className="transition-colors hover:text-primary"
                        >
                            AI Tools
                        </Link>
                        <Link
                            href="/category/guides"
                            className="transition-colors hover:text-primary"
                        >
                            Guides
                        </Link>
                        <Link
                            href="/category/news"
                            className="transition-colors hover:text-primary"
                        >
                            News
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-64 pl-9 rounded-full bg-secondary/50 focus:bg-background transition-colors"
                        />
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full"
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t p-4 space-y-4 bg-background">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-full pl-9 rounded-full bg-secondary/50"
                        />
                    </div>
                    <nav className="flex flex-col gap-4 text-sm font-medium">
                        <Link
                            href="/category/phones"
                            className="transition-colors hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Phones
                        </Link>
                        <Link
                            href="/category/gadgets"
                            className="transition-colors hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Gadgets
                        </Link>
                        <Link
                            href="/category/ai-tools"
                            className="transition-colors hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            AI Tools
                        </Link>
                        <Link
                            href="/category/guides"
                            className="transition-colors hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Guides
                        </Link>
                        <Link
                            href="/category/news"
                            className="transition-colors hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            News
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
