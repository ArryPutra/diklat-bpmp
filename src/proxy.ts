import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const url = request.nextUrl.pathname;

    const guestRoutes = ["/login"];
    const authRoutes = ["/admin", "/instansi", "/peserta", "/narasumber"];

    if (session) {
        if (guestRoutes.includes(url)) {
            switch (session.user.peranId) {
                case 1:
                    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
                case 2:
                    return NextResponse.redirect(new URL("/instansi/dashboard", request.url));
                case 3:
                    return NextResponse.redirect(new URL("/peserta/dashboard", request.url));
                case 4:
                    return NextResponse.redirect(new URL("/narasumber/dashboard", request.url));
            }
        }
    }

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
        "/narasumber/:path*"
    ],
};