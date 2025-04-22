// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/auth", req.url));
    }

    // Você pode verificar expiração aqui também, se quiser
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) {
            return NextResponse.redirect(new URL("/auth", req.url));
        }
    } catch (err) {
        return NextResponse.redirect(new URL("/auth", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/main/:path*'],
};
