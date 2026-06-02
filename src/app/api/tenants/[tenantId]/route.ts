import { err, ok } from "@/lib/utils/api";
import { getAuthSession } from "@/lib/auth/session";
import { hasMinimumTenantRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma/client";
import { type NextRequest } from "next/server";

type Params = { params: Promise<{ tenantId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  const { tenantId } = await params;
  const canAccess = await hasMinimumTenantRole(session.userId, tenantId, "ASSESSOR");
  if (!canAccess) return err("Forbidden", 403);

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) return err("Tenant not found", 404);

  return ok(tenant);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  const { tenantId } = await params;
  const canAccess = await hasMinimumTenantRole(session.userId, tenantId, "ADMIN");
  if (!canAccess) return err("Forbidden", 403);

  let body: { name?: string; description?: string; isActive?: boolean };
  try {
    body = await request.json();
  } catch {
    return err("Invalid request body", 400);
  }

  const tenant = await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      ...(body.name && { name: body.name.trim() }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
    },
  });

  return ok(tenant);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);
  if (!session.isSuperAdmin) return err("Only Super Admin can delete tenants", 403);

  const { tenantId } = await params;

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) return err("Tenant not found", 404);

  await prisma.tenant.delete({ where: { id: tenantId } });

  return ok({ deleted: true });
}
