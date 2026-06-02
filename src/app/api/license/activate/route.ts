import { COOKIE_NAME, createLicenseCookie } from "@/lib/license/cookie";
import { validateLicenseKey } from "@/lib/license/validate";
import { prisma } from "@/lib/prisma/client";
import { type NextRequest, NextResponse } from "next/server";

interface ActivateBody {
  licenseKey: string;
}

export async function POST(request: NextRequest) {
  let body: Partial<ActivateBody>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const licenseKey = body.licenseKey?.trim();
  if (!licenseKey) {
    return NextResponse.json(
      { success: false, error: "License key is required" },
      { status: 400 },
    );
  }

  const result = await validateLicenseKey(licenseKey);

  if (!result.valid) {
    const messages: Record<string, string> = {
      not_found: "License key not found.",
      inactive: "This license key has been deactivated.",
      expired: "This license key has expired.",
      server_unreachable:
        "Could not reach the license server. Check your internet connection.",
      misconfigured: "License server is not configured.",
    };
    return NextResponse.json(
      {
        success: false,
        error: messages[result.reason ?? "not_found"] ?? "Activation failed.",
      },
      { status: result.reason === "server_unreachable" ? 503 : 422 },
    );
  }

  const existingLicense = await prisma.license.findFirst();
  if (existingLicense) {
    return NextResponse.json(
      { success: false, error: "A license is already activated." },
      { status: 409 },
    );
  }

  await prisma.license.create({
    data: {
      licenseKey,
      licenseType: result.licenseType ?? "standard",
      maxTenants: result.maxTenants!,
      expiresAt: result.expiresAt ? new Date(result.expiresAt) : null,
      lastValidatedAt: new Date(),
    },
  });

  const cookieToken = await createLicenseCookie({
    maxTenants: result.maxTenants!,
    licenseType: result.licenseType ?? "standard",
    expiresAt: result.expiresAt ?? null,
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, cookieToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 400,
    path: "/",
  });

  return response;
}
