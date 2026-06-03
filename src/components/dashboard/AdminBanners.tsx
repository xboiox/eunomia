import { getLicenseStatus } from "@/lib/license/check";
import { prisma } from "@/lib/prisma/client";

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const EXPIRY_WARNING_DAYS = 30;

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / MS_PER_DAY);
}

interface BannerProps {
  variant: "amber" | "red";
  children: React.ReactNode;
}

function Banner({ variant, children }: BannerProps) {
  const styles =
    variant === "red"
      ? "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
      : "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300";
  return (
    <div className={`border-b px-6 py-2.5 text-sm ${styles}`}>
      {children}
    </div>
  );
}

interface AdminBannersProps {
  isSuperAdmin: boolean;
}

export async function AdminBanners({ isSuperAdmin }: AdminBannersProps) {
  if (!isSuperAdmin) return null;

  const [license, tenantCount] = await Promise.all([
    getLicenseStatus(),
    prisma.tenant.count(),
  ]);

  const banners: React.ReactNode[] = [];

  // License expiry / expired banner
  if (license.activated && license.expiresAt) {
    const days = daysUntil(license.expiresAt);
    if (days <= 0) {
      banners.push(
        <Banner key="lic-expired" variant="red">
          Your license has expired. Renew it in{" "}
          <a href="/dashboard/settings" className="underline">Settings</a>{" "}
          to avoid losing access.
        </Banner>,
      );
    } else if (days <= EXPIRY_WARNING_DAYS) {
      banners.push(
        <Banner key="lic-soon" variant="amber">
          Your license expires in {days} day{days === 1 ? "" : "s"}.{" "}
          <a href="/dashboard/settings" className="underline">Renew in Settings</a>.
        </Banner>,
      );
    }
  }

  // Tenant limit reached banner
  if (license.activated && license.maxTenants !== null && tenantCount >= license.maxTenants) {
    banners.push(
      <Banner key="tenant-limit" variant="amber">
        Organization limit reached ({tenantCount}/{license.maxTenants}). Upgrade your license to add more.
      </Banner>,
    );
  }

  if (banners.length === 0) return null;
  return <>{banners}</>;
}
