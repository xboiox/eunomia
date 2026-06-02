import type { TenantRole } from "@prisma/client";
import { prisma } from "@/lib/prisma/client";

const ROLE_LEVEL: Record<TenantRole, number> = {
  ADMIN: 2,
  ASSESSOR: 1,
};

export async function checkIsSuperAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isSuperAdmin: true },
  });
  return user?.isSuperAdmin ?? false;
}

export async function getTenantRoleForUser(
  userId: string,
  tenantId: string,
): Promise<TenantRole | null> {
  const membership = await prisma.tenantUser.findUnique({
    where: { userId_tenantId: { userId, tenantId } },
    select: { role: true },
  });
  return membership?.role ?? null;
}

export async function hasMinimumTenantRole(
  userId: string,
  tenantId: string,
  requiredRole: TenantRole,
): Promise<boolean> {
  const superAdmin = await checkIsSuperAdmin(userId);
  if (superAdmin) return true;

  const role = await getTenantRoleForUser(userId, tenantId);
  if (!role) return false;

  return ROLE_LEVEL[role] >= ROLE_LEVEL[requiredRole];
}

export async function getUserTenants(userId: string) {
  const memberships = await prisma.tenantUser.findMany({
    where: { userId },
    include: {
      tenant: { select: { id: true, name: true, slug: true, isActive: true } },
    },
  });
  return memberships.map((m) => ({ ...m.tenant, role: m.role }));
}
