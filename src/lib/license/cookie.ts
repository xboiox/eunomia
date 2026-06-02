import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "eunomia-license";
export const VALIDITY_SECONDS = 60 * 60 * 24;
export const GRACE_PERIOD_SECONDS = 60 * 60 * 24 * 7;

export interface LicenseCookiePayload {
  maxTenants: number;
  licenseType: string;
  expiresAt: string | null;
  validUntil: number;
  gracePeriodStart: number | null;
}

interface CreateInput {
  maxTenants: number;
  licenseType: string;
  expiresAt: string | null;
  gracePeriodStart?: number | null;
}

function getSecret(): Uint8Array | null {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function createLicenseCookie(data: CreateInput): Promise<string> {
  const secret = getSecret();
  if (!secret) throw new Error("NEXTAUTH_SECRET is not configured");

  const validUntil = Math.floor(Date.now() / 1000) + VALIDITY_SECONDS;
  const payload: LicenseCookiePayload = {
    maxTenants: data.maxTenants,
    licenseType: data.licenseType,
    expiresAt: data.expiresAt,
    validUntil,
    gracePeriodStart: data.gracePeriodStart ?? null,
  };

  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(validUntil + 60)
    .sign(secret);
}

export async function verifyLicenseCookie(
  token: string,
): Promise<LicenseCookiePayload | null> {
  if (!token) return null;

  const secret = getSecret();
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as LicenseCookiePayload;
  } catch {
    return null;
  }
}
