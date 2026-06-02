import { err, ok } from "@/lib/utils/api";
import { getAuthSession } from "@/lib/auth/session";
import { hasMinimumTenantRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma/client";
import { type NextRequest } from "next/server";
import type { TenantRole } from "@prisma/client";

type Params = { params: Promise<{ userId: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  let body: { tenantId?: string; role?: TenantRole };
  try {
    body = await request.json();
  } catch {
    return err("Invalid request body", 400);
  }

  const { tenantId, role } = body;
  if (!tenantId || !role) return err("tenantId and role are required", 400);
  if (!["ADMIN", "ASSESSOR"].includes(role)) return err("Invalid role", 400);

  const canAccess = await hasMinimumTenantRole(session.userId, tenantId, "ADMIN");
  if (!canAccess) return err("Forbidden", 403);

  const { userId } = await params;

  const membership = await prisma.tenantUser.findUnique({
    where: { userId_tenantId: { userId, tenantId } },
  });
  if (!membership) return err("User is not a member of this tenant", 404);

  const updated = await prisma.tenantUser.update({
    where: { userId_tenantId: { userId, tenantId } },
    data: { role },
  });

  return ok(updated);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  const tenantId = request.nextUrl.searchParams.get("tenantId");
  if (!tenantId) return err("tenantId query parameter is required", 400);

  const canAccess = await hasMinimumTenantRole(session.userId, tenantId, "ADMIN");
  if (!canAccess) return err("Forbidden", 403);

  const { userId } = await params;

  const membership = await prisma.tenantUser.findUnique({
    where: { userId_tenantId: { userId, tenantId } },
  });
  if (!membership) return err("User is not a member of this tenant", 404);

  await prisma.tenantUser.delete({
    where: { userId_tenantId: { userId, tenantId } },
  });

  return ok({ removed: true });
}
