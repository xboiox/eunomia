import bcrypt from "bcrypt";
import { err, ok } from "@/lib/utils/api";
import { getAuthSession } from "@/lib/auth/session";
import { hasMinimumTenantRole } from "@/lib/auth/rbac";
import { generateTemporaryPassword } from "@/lib/auth/generatePassword";
import { prisma } from "@/lib/prisma/client";
import { type NextRequest } from "next/server";

interface RouteContext {
  params: Promise<{ userId: string }>;
}

// POST /api/users/[userId]/reset-password — Admin resets a user's password.
// Returns a one-time temporary password; user must change it on next login.
export async function POST(_request: NextRequest, { params }: RouteContext) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  const { userId } = await params;

  // Find the user and their tenant memberships to verify the caller has ADMIN
  // access in at least one shared tenant.
  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      isSuperAdmin: true,
      tenantUsers: { select: { tenantId: true } },
    },
  });
  if (!targetUser) return err("User not found", 404);

  // Super Admins cannot have their password reset by anyone else.
  if (targetUser.isSuperAdmin && !session.isSuperAdmin) {
    return err("Cannot reset a Super Admin's password", 403);
  }

  // Caller must be ADMIN in at least one tenant the target belongs to.
  if (!session.isSuperAdmin) {
    const sharedTenantIds = targetUser.tenantUsers.map((t) => t.tenantId);
    const canReset = await Promise.any(
      sharedTenantIds.map((tenantId) =>
        hasMinimumTenantRole(session.userId, tenantId, "ADMIN").then((ok) => {
          if (!ok) throw new Error("no access");
          return true;
        }),
      ),
    ).catch(() => false);

    if (!canReset) return err("Forbidden", 403);
  }

  const temporaryPassword = generateTemporaryPassword();
  const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword, mustChangePassword: true },
  });

  return ok({ temporaryPassword });
}
