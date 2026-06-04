import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, VALIDITY_SECONDS, verifyLicenseCookie } from "@/lib/license/cookie";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// 10 sign-in attempts per 15 minutes per IP
const SIGNIN_RATE_LIMIT = { maxRequests: 10, windowMs: 15 * 60 * 1000 };

// The activation page lives in the (setup) route group, so its URL is /activate
const SETUP_PATH = "/activate";

const PUBLIC_AUTH_PREFIXES = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/privacy",
  "/policy",
];

const SKIP_PREFIXES = [
  "/_next",
  "/favicon.ico",
  "/api/auth",
  "/api/license",
  "/api/forgot-password",
  "/api/register",
  "/error",
];

const DASHBOARD_PREFIX = "/dashboard";

function shouldSkip(pathname: string): boolean {
  return SKIP_PREFIXES.some((p) => pathname.startsWith(p));
}

function isPublicAuthPath(pathname: string): boolean {
  return PUBLIC_AUTH_PREFIXES.some((p) => pathname.startsWith(p));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldSkip(pathname)) {
    // Rate-limit sign-in credential submissions before handing off to NextAuth
    if (pathname === "/api/auth/callback/credentials" && request.method === "POST") {
      const ip = getClientIp(request);
      const rl = checkRateLimit("signin", ip, SIGNIN_RATE_LIMIT);
      if (!rl.allowed) {
        return new NextResponse(
          JSON.stringify({ error: "Too many sign-in attempts. Please wait before trying again." }),
          { status: 429, headers: { "Content-Type": "application/json" } },
        );
      }
    }
    return NextResponse.next();
  }

  const cookieValue = request.cookies.get(COOKIE_NAME)?.value;
  const cookiePayload = cookieValue
    ? await verifyLicenseCookie(cookieValue)
    : null;

  const now = Math.floor(Date.now() / 1000);
  const licenseValid =
    cookiePayload !== null && cookiePayload.validUntil > now;
  const cookieExpired =
    cookiePayload !== null && cookiePayload.validUntil <= now;

  // Setup page: only accessible when license is NOT active
  if (pathname.startsWith(SETUP_PATH)) {
    if (licenseValid) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    return NextResponse.next();
  }

  // Cookie expired (valid JWT but past validUntil) → refresh
  if (cookieExpired) {
    const refreshUrl = new URL("/api/license/refresh", request.url);
    refreshUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(refreshUrl);
  }

  // No valid cookie → redirect to setup
  if (!licenseValid) {
    return NextResponse.redirect(new URL(SETUP_PATH, request.url));
  }

  // Public auth routes don't require a session
  if (isPublicAuthPath(pathname)) return NextResponse.next();

  // All other routes require an authenticated session
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Dashboard routes: redirect to /dashboard if accessing root while authenticated
  if (pathname === "/") {
    return NextResponse.redirect(new URL(DASHBOARD_PREFIX, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Exclude Next.js internals, favicon, and all static assets in public/
  // (images, fonts, icons, etc.) so they are never gated by license/auth guards.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/|fonts/|icons/).*)"],
};
