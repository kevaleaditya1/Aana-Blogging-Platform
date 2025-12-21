"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";
import { Search, Sun, Moon, Menu, X, User, LogOut, BookmarkIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchWithSuggestions } from "@/components/search/search-with-suggestions";

export function Header() {
    const { setTheme, theme } = useTheme();
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
                ? "bg-background/95 backdrop-blur-lg shadow-sm"
                : "bg-background/80 backdrop-blur-md"
                }`}
        >
            <div className="container flex h-16 items-center px-4 md:px-6">
                {/* Logo - Creative with Icon */}
                <Link href="/" className="flex items-center gap-2 mr-10 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity" />
                        <Sparkles className="h-5 w-5 text-primary relative" />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        Aana
                    </span>
                </Link>

                {/* Desktop Navigation - Elegant with Underline Effect */}
                <nav className="hidden md:flex items-center gap-1 text-sm flex-1">
                    {[
                        { href: "/category/phones", label: "Phones" },
                        { href: "/category/gadgets", label: "Gadgets" },
                        { href: "/category/ai-tools", label: "AI Tools" },
                        { href: "/category/guides", label: "Guides" },
                        { href: "/category/news", label: "News" },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative px-3 py-2 text-muted-foreground hover:text-foreground transition-colors group"
                        >
                            {item.label}
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </Link>
                    ))}
                </nav>

                {/* Right Side - Refined with Glass Effect */}
                <div className="flex items-center gap-2 ml-auto">
                    {/* Search Bar with Suggestions */}
                    <div className="hidden md:block">
                        <SearchWithSuggestions />
                    </div>

                    {/* Theme Toggle - Animated Sun/Moon */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full hover:bg-secondary/80 relative"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        <div className="relative w-[1.2rem] h-[1.2rem]">
                            <Sun className="absolute inset-0 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-transform duration-700 ease-in-out dark:rotate-180 dark:scale-0 text-amber-500" />
                            <Moon className="absolute inset-0 h-[1.2rem] w-[1.2rem] -rotate-180 scale-0 transition-transform duration-700 ease-in-out dark:rotate-0 dark:scale-100 text-indigo-400" />
                        </div>
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {/* Auth - Premium Look */}
                    {status === "loading" ? (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 animate-pulse" />
                    ) : session?.user ? (
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-full hover:bg-secondary/80 relative overflow-hidden group"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                {session.user.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                        className="h-9 w-9 rounded-full object-cover ring-2 ring-background"
                                    />
                                ) : (
                                    <User className="h-5 w-5 relative z-10" />
                                )}
                            </Button>
                            {isUserMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-xl bg-background/95 backdrop-blur-lg border z-50 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
                                        <div className="relative">
                                            <div className="px-4 py-3 border-b bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
                                                <p className="font-semibold text-sm">{session.user.name}</p>
                                                <p className="text-xs text-muted-foreground truncate mt-0.5">
                                                    {session.user.email}
                                                </p>
                                            </div>
                                            <div className="py-1">
                                                <Link
                                                    href={`/profile/${session.user.id}`}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary/50 transition-colors"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <User className="h-4 w-4" />
                                                    <span>My Profile</span>
                                                </Link>
                                                <Link
                                                    href="/saved"
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary/50 transition-colors"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <BookmarkIcon className="h-4 w-4" />
                                                    <span>Saved Posts</span>
                                                </Link>
                                                {session.user.role === "ADMIN" && (
                                                    <Link
                                                        href="/admin"
                                                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary/50 transition-colors"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        <User className="h-4 w-4" />
                                                        <span>Admin Panel</span>
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="border-t">
                                                <button
                                                    onClick={() => {
                                                        setIsUserMenuOpen(false);
                                                        signOut({ callbackUrl: "/" });
                                                    }}
                                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-secondary/50 transition-colors text-left"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    <span>Sign Out</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div>
                            <Button
                                size="sm"
                                asChild
                                className="h-10 px-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25"
                            >
                                <Link href="/login">Sign In</Link>
                            </Button>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden h-10 w-10 rounded-full"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu - Elegant Slide */}
            {isMenuOpen && (
                <div className="md:hidden bg-background/95 backdrop-blur-lg">
                    <div className="container px-4 py-4 space-y-4">
                        {/* Mobile Search */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const query = formData.get("search") as string;
                                if (query.trim()) {
                                    window.location.href = `/search?q=${encodeURIComponent(query)}`;
                                    setIsMenuOpen(false);
                                }
                            }}
                            className="relative"
                        >
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                name="search"
                                placeholder="Search articles..."
                                className="w-full pl-10 bg-secondary/50 border-0 rounded-full"
                            />
                        </form>

                        {/* Mobile Navigation */}
                        <nav className="flex flex-col gap-1">
                            {[
                                { href: "/category/phones", label: "Phones" },
                                { href: "/category/gadgets", label: "Gadgets" },
                                { href: "/category/ai-tools", label: "AI Tools" },
                                { href: "/category/guides", label: "Guides" },
                                { href: "/category/news", label: "News" },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Auth */}
                        <div className="border-t pt-4">
                            {session?.user ? (
                                <div className="space-y-1">
                                    <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border mb-2">
                                        <p className="font-semibold text-sm">{session.user.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {session.user.email}
                                        </p>
                                    </div>
                                    <Link
                                        href="/bookmarks"
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary/50 rounded-lg transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <BookmarkIcon className="h-4 w-4" />
                                        My Bookmarks
                                    </Link>
                                    {session.user.role === "ADMIN" && (
                                        <Link
                                            href="/admin"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary/50 rounded-lg transition-colors"
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
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-secondary/50 rounded-lg transition-colors text-left"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <Button
                                    className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                    asChild
                                >
                                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                        Get Started
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
