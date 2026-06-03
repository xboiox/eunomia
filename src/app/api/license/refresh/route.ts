import {
  COOKIE_NAME,
  GRACE_PERIOD_SECONDS,
  createLicenseCookie,
  verifyLicenseCookie,
} from "@/lib/license/cookie";
import { getLicenseRecord } from "@/lib/license/check";
import { validateLicenseKey } from "@/lib/license/validate";
import { prisma } from "@/lib/prisma/client";
import { type NextRequest, NextResponse } from "next/server";

// The activation page lives in the (setup) route group, so its URL is /activate
const SETUP_PATH = "/activate";

function safeRedirectTarget(from: string | null, requestUrl: string): URL {
  const appOrigin = new URL(requestUrl).origin;
  try {
    const candidate = new URL(from ?? "/", requestUrl);
    // Only allow same-origin redirects — reject any external URL.
    if (candidate.origin !== appOrigin) return new URL("/", requestUrl);
    return candidate;
  } catch {
    return new URL("/", requestUrl);
  }
}

export async function GET(request: NextRequest) {
  const redirectTarget = safeRedirectTarget(
    request.nextUrl.searchParams.get("from"),
    request.url,
  );

  const license = await getLicenseRecord();
  if (!license) {
    return NextResponse.redirect(new URL(SETUP_PATH, request.url));
  }

  const result = await validateLicenseKey(license.licenseKey);

  if (result.valid) {
    await prisma.license.updateMany({
      data: {
        lastValidatedAt: new Date(),
        maxTenants: result.maxTenants ?? license.maxTenants,
        licenseType: result.licenseType ?? license.licenseType,
        expiresAt: result.expiresAt ? new Date(result.expiresAt) : null,
      },
    });

    const cookieToken = await createLicenseCookie({
      maxTenants: result.maxTenants ?? license.maxTenants,
      licenseType: result.licenseType ?? license.licenseType,
      expiresAt: result.expiresAt ?? null,
      gracePeriodStart: null,
    });

    const response = NextResponse.redirect(redirectTarget);
    response.cookies.set(COOKIE_NAME, cookieToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 400,
      path: "/",
    });
    return response;
  }

  // Validation failed — check grace period
  const existingCookie = request.cookies.get(COOKIE_NAME);
  const existingPayload = existingCookie
    ? await verifyLicenseCookie(existingCookie.value)
    : null;

  const now = Math.floor(Date.now() / 1000);
  const gracePeriodStart =
    existingPayload?.gracePeriodStart ?? now;
  const gracePeriodExpiry = gracePeriodStart + GRACE_PERIOD_SECONDS;

  if (now < gracePeriodExpiry && existingPayload) {
    const cookieToken = await createLicenseCookie({
      maxTenants: existingPayload.maxTenants,
      licenseType: existingPayload.licenseType,
      expiresAt: existingPayload.expiresAt,
      gracePeriodStart,
    });

    const response = NextResponse.redirect(redirectTarget);
    response.cookies.set(COOKIE_NAME, cookieToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 400,
      path: "/",
    });
    return response;
  }

  // Grace period expired — force re-activation
  const response = NextResponse.redirect(new URL(SETUP_PATH, request.url));
  response.cookies.delete(COOKIE_NAME);
  return response;
}
