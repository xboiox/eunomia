import { err, ok } from "@/lib/utils/api";
import { getAuthSession } from "@/lib/auth/session";
import { hasMinimumTenantRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma/client";
import { type NextRequest } from "next/server";

interface RouteContext {
  params: Promise<{ userId: string }>;
}

// POST /api/users/[userId]/unlock — Admin unlocks a locked account early.
export async function POST(_request: NextRequest, { params }: RouteContext) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  const { userId } = await params;

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, lockedUntil: true, tenantUsers: { select: { tenantId: true } } },
  });
  if (!targetUser) return err("User not found", 404);

  if (!session.isSuperAdmin) {
    const sharedTenantIds = targetUser.tenantUsers.map((t) => t.tenantId);
    const canUnlock = await Promise.any(
      sharedTenantIds.map((tenantId) =>
        hasMinimumTenantRole(session.userId, tenantId, "ADMIN").then((ok) => {
          if (!ok) throw new Error("no access");
          return true;
        }),
      ),
    ).catch(() => false);

    if (!canUnlock) return err("Forbidden", 403);
  }

  await prisma.user.update({
    where: { id: userId },
    data: { lockedUntil: null, failedLoginAttempts: 0 },
  });

  return ok({ unlocked: true });
}
