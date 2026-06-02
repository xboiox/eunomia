import { err, ok } from "@/lib/utils/api";
import { getAuthSession } from "@/lib/auth/session";
import { hasMinimumTenantRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma/client";
import { type NextRequest } from "next/server";
import type { TenantRole } from "@prisma/client";

export async function GET(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  const tenantId = request.nextUrl.searchParams.get("tenantId");
  if (!tenantId) return err("tenantId query parameter is required", 400);

  const canAccess = await hasMinimumTenantRole(session.userId, tenantId, "ASSESSOR");
  if (!canAccess) return err("Forbidden", 403);

  const members = await prisma.tenantUser.findMany({
    where: { tenantId },
    include: {
      user: { select: { id: true, name: true, email: true, createdAt: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const data = members.map((m) => ({ ...m.user, role: m.role }));
  return ok(data);
}

export async function POST(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  let body: { email?: string; tenantId?: string; role?: TenantRole };
  try {
    body = await request.json();
  } catch {
    return err("Invalid request body", 400);
  }

  const { email, tenantId, role } = body;
  if (!email?.trim() || !tenantId || !role) {
    return err("email, tenantId and role are required", 400);
  }

  if (!["ADMIN", "ASSESSOR"].includes(role)) {
    return err("role must be ADMIN or ASSESSOR", 400);
  }

  const canAccess = await hasMinimumTenantRole(session.userId, tenantId, "ADMIN");
  if (!canAccess) return err("Forbidden", 403);

  const targetUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true, name: true, email: true },
  });
  if (!targetUser) return err("No user found with this email. Ask them to register first.", 404);

  const existing = await prisma.tenantUser.findUnique({
    where: { userId_tenantId: { userId: targetUser.id, tenantId } },
  });
  if (existing) return err("This user is already a member of the tenant", 409);

  await prisma.tenantUser.create({
    data: { userId: targetUser.id, tenantId, role },
  });

  return ok({ ...targetUser, role }, 201);
}
