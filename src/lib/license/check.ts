import { prisma } from "@/lib/prisma/client";

export interface LicenseRecord {
  licenseKey: string;
  licenseType: string;
  maxTenants: number;
  expiresAt: Date | null;
  lastValidatedAt: Date;
}

export async function getLicenseRecord(): Promise<LicenseRecord | null> {
  const license = await prisma.license.findFirst();
  if (!license) return null;

  if (license.expiresAt && license.expiresAt < new Date()) return null;

  return {
    licenseKey: license.licenseKey,
    licenseType: license.licenseType,
    maxTenants: license.maxTenants,
    expiresAt: license.expiresAt,
    lastValidatedAt: license.lastValidatedAt,
  };
}

/**
 * Safe license summary for display in the UI.
 * Deliberately omits the license key value — only status metadata is exposed.
 */
export interface LicenseStatus {
  activated: boolean;
  licenseType: string | null;
  maxTenants: number | null;
  expiresAt: Date | null;
  lastValidatedAt: Date | null;
  isExpired: boolean;
}

export async function getLicenseStatus(): Promise<LicenseStatus> {
  const license = await prisma.license.findFirst();
  if (!license) {
    return {
      activated: false,
      licenseType: null,
      maxTenants: null,
      expiresAt: null,
      lastValidatedAt: null,
      isExpired: false,
    };
  }

  return {
    activated: true,
    licenseType: license.licenseType,
    maxTenants: license.maxTenants,
    expiresAt: license.expiresAt,
    lastValidatedAt: license.lastValidatedAt,
    isExpired: Boolean(license.expiresAt && license.expiresAt < new Date()),
  };
}
