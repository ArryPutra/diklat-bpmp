import { NextRequest, NextResponse } from "next/server";

interface Session {
    user: {
        id: string;
        email: string;
        name: string;
    };
}

export async function proxy(request: NextRequest) {
    // Get session dari API route dengan fetch biasa
    let session: Session | null = null;

    try {
        const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        });

        if (response.ok) {
            session = await response.json();
        }
    } catch (error) {
        console.error("Error fetching session:", error);
    }

    const url = request.nextUrl.pathname;

    const guestRoutes = ["/login"];
    const authRoutes = ["/dashboard"]; // Base route saja

    // Jika sudah login, redirect dari guest routes
    if (session?.user) {
        if (guestRoutes.includes(url)) {
            return NextResponse.redirect(new URL("/dashboard/admin", request.url));
        }
    }

    // Jika belum login, redirect dari auth routes
    if (!session?.user) {
        // ✅ Pakai startsWith untuk match /dashboard dan semua /dashboard/*
        if (authRoutes.some(route => url.startsWith(route))) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/login",
        "/dashboard/:path*" // Match /dashboard dan semua subpath
    ],
};