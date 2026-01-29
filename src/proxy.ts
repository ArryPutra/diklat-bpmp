import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const url = request.nextUrl.pathname;

    const guestRoutes = ["/login"];
    const authRoutes = ["/dashboard"]; // Base route saja

    // Jika sudah login, redirect dari guest routes
    if (session) {
        if (guestRoutes.includes(url)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    // Jika belum login, redirect dari auth routes
    if (!session) {
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