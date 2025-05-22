import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Pages that require authentication
const protectedPages = ["/dashboard", "/transactions", "/transfer", "/add-money", "/request-debin", "/link-card"]
// Pages that should redirect to dashboard if user is logged in
const authPages = ["/login", "/register"]

export function middleware(request: NextRequest) {
    const user = request.cookies.get("user")
    const { pathname } = request.nextUrl

    // If user is logged in and tries to access auth pages, redirect to dashboard
    if (user && authPages.includes(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // If user is not logged in and tries to access protected pages, redirect to login
    if (!user && protectedPages.includes(pathname)) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
    matcher: [...protectedPages, ...authPages],
} 