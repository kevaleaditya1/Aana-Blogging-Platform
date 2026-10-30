"use client";

import { isEmail } from "@/lib/validation";
import { Suspense, useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const requestedCallback = searchParams.get("callbackUrl") || "/";
    const callbackUrl = requestedCallback.startsWith("/") && !requestedCallback.startsWith("//") && !requestedCallback.includes("\\") ? requestedCallback : "/";
    const inFlight = useRef(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleGoogleLogin = async () => {
        if (inFlight.current) return;
        inFlight.current = true; setLoading(true); setError("");
        try { await signIn("google", { callbackUrl }); }
        catch { setError("Google sign-in could not start. Please try again."); }
        finally { inFlight.current = false; setLoading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inFlight.current) return;
        if (!isEmail(formData.email) || !formData.password) {
            setError("Enter a valid email address and your password.");
            document.getElementById("email")?.focus(); return;
        }
        inFlight.current = true; setLoading(true); setError("");
        try {
            const result = await signIn("credentials", { email: formData.email.trim().toLowerCase(), password: formData.password, redirect: false });
            if (!result?.ok || result.error) setError("Invalid email or password. Please check both fields.");
            else router.push(callbackUrl);
        } catch { setError("Couldn’t connect. Your entries have been kept. Please try again."); }
        finally { inFlight.current = false; setLoading(false); }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-[420px] rounded-3xl glass-floating p-6 md:p-8 shadow-2xl space-y-6">
                <div className="text-center space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Account Access
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                        Welcome Back
                    </h1>
                    <p className="text-xs text-muted-foreground">
                        Sign in to sync bookmarks and participate in discussions
                    </p>
                </div>

                <div className="space-y-4">
                    <Button
                        onClick={handleGoogleLogin}
                        className="w-full h-10 rounded-full border border-black/[0.1] dark:border-white/[0.12] bg-background hover:bg-black/[0.03] dark:hover:bg-white/[0.05] text-foreground text-xs font-medium apple-press"
                        variant="outline"
                        disabled={loading}
                    >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </Button>

                    <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border/60" />
                        </div>
                        <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                            <span className="bg-transparent backdrop-blur-md px-3 text-muted-foreground">
                                or sign in with email
                            </span>
                        </div>
                    </div>

                    <form noValidate aria-busy={loading} onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-xs font-medium text-foreground">
                                Email
                            </label>
                            <Input
                                id="email" autoComplete="email" aria-invalid={Boolean(error)} aria-describedby={error ? "login-error" : undefined}
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="name@domain.com"
                                className="h-10 rounded-xl glass-input text-xs px-3.5"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-xs font-medium text-foreground">
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-[11px] text-primary hover:underline underline-offset-4"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password" autoComplete="current-password" aria-invalid={Boolean(error)} aria-describedby={error ? "login-error" : undefined}
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                className="h-10 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] text-xs px-3.5"
                                required
                                disabled={loading}
                            />
                        </div>
                        {error && <p id="login-error" role="alert" className="text-xs text-red-500 font-medium">{error}</p>}
                        <Button type="submit" className="w-full h-10 rounded-full bg-foreground text-background hover:opacity-90 text-xs font-medium apple-press mt-2" disabled={loading}>
                            {loading ? "Authenticating..." : "Sign In"}
                        </Button>
                    </form>

                    <p className="text-xs text-center text-muted-foreground pt-2">
                        Need an account?{" "}
                        <Link href="/signup" className="text-primary font-medium hover:underline underline-offset-4">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
