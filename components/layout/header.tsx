"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";
import { Search, Sun, Moon, Menu, X, User, LogOut, BookmarkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function Header() {
    const { setTheme, theme } = useTheme();
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 mr-6">
                    <span className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Ashitya
                    </span>
                </Link>

                {/* Desktop Navigation - Centered */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium flex-1">
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

                {/* Right Side - Search and Auth Only */}
                <div className="flex items-center gap-3 ml-auto">
                    {/* Search Bar */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const query = formData.get("search") as string;
                            if (query.trim()) {
                                window.location.href = `/search?q=${encodeURIComponent(query)}`;
                            }
                        }}
                        className="hidden md:flex items-center relative"
                    >
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                            type="search"
                            name="search"
                            placeholder="Search..."
                            className="w-48 xl:w-64 pl-9 rounded-full bg-secondary/50 focus:bg-background transition-colors"
                        />
                    </form>

                    {/* Auth Buttons / User Menu */}
                    {status === "loading" ? (
                        <div className="h-9 w-9 rounded-full bg-secondary/50 animate-pulse" />
                    ) : session?.user ? (
                        <div className="relative hidden md:block">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            >
                                {session.user.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                        className="h-8 w-8 rounded-full"
                                    />
                                ) : (
                                    <User className="h-5 w-5" />
                                )}
                            </Button>
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border">
                                    <div className="py-1">
                                        <div className="px-4 py-2 text-sm border-b">
                                            <p className="font-medium">{session.user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {session.user.email}
                                            </p>
                                        </div>
                                        <Link
                                            href="/bookmarks"
                                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <BookmarkIcon className="h-4 w-4" />
                                            My Bookmarks
                                        </Link>
                                        {session.user.role === "ADMIN" && (
                                            <Link
                                                href="/admin"
                                                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <User className="h-4 w-4" />
                                                Admin Panel
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => {
                                                setIsUserMenuOpen(false);
                                                signOut({ callbackUrl: "/" });
                                            }}
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-secondary transition-colors text-left"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden md:block">
                            <Button size="sm" asChild>
                                <Link href="/login">Get Started</Link>
                            </Button>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
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

                    {/* Mobile Auth */}
                    <div className="border-t pt-4">
                        {session?.user ? (
                            <div className="space-y-2">
                                <div className="px-2 py-2 text-sm border-b">
                                    <p className="font-medium">{session.user.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {session.user.email}
                                    </p>
                                </div>
                                <Link
                                    href="/bookmarks"
                                    className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-secondary rounded transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <BookmarkIcon className="h-4 w-4" />
                                    My Bookmarks
                                </Link>
                                {session.user.role === "ADMIN" && (
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-secondary rounded transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <User className="h-4 w-4" />
                                        Admin Panel
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        signOut({ callbackUrl: "/" });
                                    }}
                                    className="flex items-center gap-2 w-full px-2 py-2 text-sm hover:bg-secondary rounded transition-colors text-left"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                        Login
                                    </Link>
                                </Button>
                                <Button className="w-full" asChild>
                                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                                        Sign Up
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
