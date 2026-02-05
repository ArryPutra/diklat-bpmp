import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const url = request.nextUrl.pathname;

    const guestRoutes = ["/login"];

    const authRoutes = ["/admin", "/instansi", "/peserta", "/narasumber"];

    const roleRouteMap: Record<number, string> = {
        1: "/admin",
        2: "/instansi",
        3: "/peserta",
        4: "/narasumber",
    };

    const roleDashboardMap: Record<number, string> = {
        1: "/admin/dashboard",
        2: "/instansi/dashboard",
        3: "/peserta/dashboard",
        4: "/narasumber/dashboard",
    };

    // =====================
    // SUDAH LOGIN
    // =====================
    if (session) {
        const roleId = session.user.peranId;

        // Kalau buka login → lempar ke dashboard masing-masing
        if (guestRoutes.includes(url)) {
            return NextResponse.redirect(
                new URL(roleDashboardMap[roleId], request.url)
            );
        }

        // Kalau masuk area role lain → blok
        for (const [id, route] of Object.entries(roleRouteMap)) {
            if (url.startsWith(route) && Number(id) !== roleId) {
                return NextResponse.redirect(
                    new URL(roleDashboardMap[roleId], request.url)
                );
            }
        }
    }

    // =====================
    // BELUM LOGIN
    // =====================
    if (!session) {
        if (authRoutes.some(route => url.startsWith(route))) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/login",
        "/admin/:path*",
        "/instansi/:path*",
        "/peserta/:path*",
        "/narasumber/:path*",
    ],
};
