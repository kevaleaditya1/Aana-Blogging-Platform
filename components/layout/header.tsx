"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";
import { Search, Sun, Moon, Menu, X, User, LogOut, BookmarkIcon } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
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
            className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${scrolled
                ? "bg-white/75 dark:bg-black/75 backdrop-blur-2xl backdrop-saturate-200 border-black/[0.06] dark:border-white/[0.08] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]"
                : "bg-white/45 dark:bg-black/40 backdrop-blur-xl border-transparent"
                }`}
        >
            <div className="container flex h-14 items-center px-4 md:px-8 max-w-7xl mx-auto">
                {/* Logo */}
                <Link href="/" aria-label="Aana home" className="flex items-center mr-4 lg:mr-8 group apple-press">
                    <BrandLogo />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium flex-1">
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
                            className="px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-full transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Side */}
                <div className="flex items-center gap-2.5 ml-auto">
                    {/* Search Bar */}
                    <div className="hidden md:block">
                        <SearchWithSuggestions />
                    </div>

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.08]"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        <div className="relative w-4 h-4">
                            <Sun className="absolute inset-0 h-4 w-4 rotate-0 scale-100 transition-transform duration-500 ease-out dark:rotate-180 dark:scale-0 text-amber-500" />
                            <Moon className="absolute inset-0 h-4 w-4 -rotate-180 scale-0 transition-transform duration-500 ease-out dark:rotate-0 dark:scale-100 text-primary" />
                        </div>
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {/* Auth */}
                    {status === "loading" ? (
                        <div className="h-8 w-8 rounded-full bg-black/10 dark:bg-white/10 animate-pulse" />
                    ) : session?.user ? (
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.08] relative overflow-hidden"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            >
                                {session.user.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                        className="h-8 w-8 rounded-full object-cover ring-1 ring-border"
                                    />
                                ) : (
                                    <User className="h-4 w-4 text-foreground" />
                                )}
                            </Button>
                            {isUserMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl glass-floating z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-1.5">
                                        <div className="relative">
                                            <div className="px-4 py-3 border-b border-border/50">
                                                <p className="font-semibold text-sm">{session.user.name}</p>
                                                <p className="text-xs text-muted-foreground truncate mt-0.5">
                                                    {session.user.email}
                                                </p>
                                            </div>
                                            <div className="py-1">
                                                <Link
                                                    href={`/profile/${session.user.id}`}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <span>My Profile</span>
                                                </Link>
                                                <Link
                                                    href="/saved"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
                                                    <span>Saved Posts</span>
                                                </Link>
                                                {session.user.role === "ADMIN" && (
                                                    <Link
                                                        href="/admin"
                                                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        <span>Admin Panel</span>
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="border-t border-border/50">
                                                <button
                                                    onClick={() => {
                                                        setIsUserMenuOpen(false);
                                                        signOut({ callbackUrl: "/" });
                                                    }}
                                                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors text-left"
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
                                className="h-8 px-4 rounded-full text-xs font-medium bg-foreground text-background hover:opacity-90 apple-press"
                            >
                                <Link href="/login">Sign In</Link>
                            </Button>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden h-8 w-8 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.08]"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="h-4 w-4" />
                        ) : (
                            <Menu className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden glass-floating border-b border-border/60">
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
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input
                                type="search"
                                name="search"
                                placeholder="Search articles..."
                                className="w-full pl-10 bg-black/[0.03] dark:bg-white/[0.05] border-black/[0.08] dark:border-white/[0.1] rounded-full"
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
                                    className="px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-xl transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Auth */}
                        <div className="border-t border-border/50 pt-4">
                            {session?.user ? (
                                <div className="space-y-1">
                                    <div className="px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-border/50 mb-2">
                                        <p className="font-semibold text-sm">{session.user.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {session.user.email}
                                        </p>
                                    </div>
                                    <Link
                                        href="/bookmarks"
                                        className="flex items-center gap-3 px-3.5 py-2 text-sm text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-xl transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
                                        My Bookmarks
                                    </Link>
                                    {session.user.role === "ADMIN" && (
                                        <Link
                                            href="/admin"
                                            className="flex items-center gap-3 px-3.5 py-2 text-sm text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-xl transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            signOut({ callbackUrl: "/" });
                                        }}
                                        className="flex items-center gap-3 w-full px-3.5 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-left"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <Button
                                    className="w-full rounded-full bg-foreground text-background hover:opacity-90"
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
