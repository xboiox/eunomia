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
