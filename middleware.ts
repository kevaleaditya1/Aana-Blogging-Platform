import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { pathname } = req.nextUrl;

    // API authorization must not depend on the admin UI or robots.txt.
    if (pathname.startsWith("/api/admin") || pathname === "/api/upload") {
        if (req.auth?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (pathname.startsWith("/profile/") && !req.auth?.user) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Allow access to login page
    if (pathname === "/admin/login") {
        return NextResponse.next();
    }

    // Check if accessing admin routes
    if (pathname.startsWith("/admin")) {
        // Check if user is authenticated and is admin
        if (!req.auth?.user || req.auth.user.role !== "ADMIN") {
            // Redirect to login
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*", "/api/upload", "/profile/:path*"],
};
