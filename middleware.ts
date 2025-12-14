import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { pathname } = req.nextUrl;

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
    matcher: ["/admin/:path*"],
};
