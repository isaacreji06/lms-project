// /middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // debug logs — remove or lower in production
  console.log("[MIDDLEWARE] pathname:", pathname);

  // public routes (adjust if you have other public routes)
  const publicPaths = ["/", "/login", "/signup", "/api/auth", "/api/public"];
  const isPublic = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  // read token
  let token = null;
  try {
    token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  } catch (err) {
    console.error("[MIDDLEWARE] getToken error:", err);
  }
  console.log("[MIDDLEWARE] token:", token ? { ...token, exp: token.exp } : null);

  // If user is authenticated and trying to visit /login -> redirect to role dashboard
  if (token && pathname === "/login") {
    const userRole = token.role || token.user?.role;
    let redirectPath = "/";
    if (userRole === "admin") redirectPath = "/admin-dashboard";
    else if (userRole === "student") redirectPath = "/student-dashboard";
    const url = req.nextUrl.clone();
    url.pathname = redirectPath;
    return NextResponse.redirect(url);
  }

  // allow public paths
  if (isPublic) {
    return NextResponse.next();
  }

  // not authenticated -> redirect to /login with callback
  if (!token) {
    console.log(`[MIDDLEWARE] no token. redirecting to /login from ${pathname}`);
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // role guards
  const userRole = token.role || token.user?.role;

  if (pathname === "/admin-dashboard" || pathname.startsWith("/admin-dashboard/")) {
    if (userRole !== "admin") {
      console.log(`[MIDDLEWARE] blocking ${userRole} from admin-dashboard`);
      const url = req.nextUrl.clone();
      // send students to their dashboard, others to home
      url.pathname = userRole === "student" ? "/student-dashboard" : "/";
      return NextResponse.redirect(url);
    }
  }

  if (pathname === "/student-dashboard" || pathname.startsWith("/student-dashboard/")) {
    if (userRole !== "student") {
      console.log(`[MIDDLEWARE] blocking ${userRole} from student-dashboard`);
      const url = req.nextUrl.clone();
      url.pathname = userRole === "admin" ? "/admin-dashboard" : "/";
      return NextResponse.redirect(url);
    }
  }

  // otherwise allow
  return NextResponse.next();
}

// Ensure the matcher includes the exact base routes AND nested routes
export const config = {
  matcher: [
    "/admin-dashboard",
    "/admin-dashboard/:path*",
    "/student-dashboard",
    "/student-dashboard/:path*",
  ],
};
