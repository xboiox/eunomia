import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, VALIDITY_SECONDS, verifyLicenseCookie } from "@/lib/license/cookie";

// The activation page lives in the (setup) route group, so its URL is /activate
const SETUP_PATH = "/activate";

const PUBLIC_AUTH_PREFIXES = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
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

  if (shouldSkip(pathname)) return NextResponse.next();

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
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
