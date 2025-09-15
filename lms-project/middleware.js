import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const publicPaths = ["/", "/login", "/signup"];
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const userRole = token?.role || token?.user?.role;

  // Redirect authenticated users away from /login
  if (token && pathname.startsWith("/login")) {
    let redirectPath = "/";
    if (userRole === "admin") redirectPath = "/admin-dashboard";
    else if (userRole === "student") redirectPath = "/student-dashboard";

    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = redirectPath;
    return NextResponse.redirect(dashboardUrl);
  }

  if (isPublic) {
    return NextResponse.next();
  }

  if (!token) {
    console.log(`[MIDDLEWARE] No token. Redirecting to /login from ${pathname}`);
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin-dashboard") && userRole !== "admin") {
    console.log(`[MIDDLEWARE] ${userRole} tried admin dashboard. Redirecting.`);
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = "/student-dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  if (pathname.startsWith("/student-dashboard") && userRole !== "student") {
    console.log(`[MIDDLEWARE] ${userRole} tried student dashboard. Redirecting.`);
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = "/admin-dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-dashboard/:path*", "/student-dashboard/:path*"],
};
