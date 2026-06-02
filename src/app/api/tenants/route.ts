import { err, ok } from "@/lib/utils/api";
import { getAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma/client";
import { type NextRequest } from "next/server";

export async function GET(_request: NextRequest) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  const tenants = session.isSuperAdmin
    ? await prisma.tenant.findMany({ orderBy: { createdAt: "asc" } })
    : await prisma.tenant.findMany({
        where: { tenantUsers: { some: { userId: session.userId } } },
        orderBy: { createdAt: "asc" },
      });

  return ok(tenants);
}

export async function POST(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);
  if (!session.isSuperAdmin) return err("Only Super Admin can create tenants", 403);

  let body: { name?: string; slug?: string; description?: string };
  try {
    body = await request.json();
  } catch {
    return err("Invalid request body", 400);
  }

  const { name, slug, description } = body;
  if (!name?.trim() || !slug?.trim()) {
    return err("Name and slug are required", 400);
  }

  const license = await prisma.license.findFirst();
  if (!license) return err("No active license found", 422);

  const tenantCount = await prisma.tenant.count();
  if (tenantCount >= license.maxTenants) {
    return err(
      `Tenant limit reached (${license.maxTenants}). Upgrade your license to add more.`,
      422,
    );
  }

  const slugConflict = await prisma.tenant.findUnique({ where: { slug: slug.trim() } });
  if (slugConflict) return err("A tenant with this slug already exists", 409);

  const tenant = await prisma.tenant.create({
    data: {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description?.trim() ?? null,
    },
  });

  // Add creator as ADMIN of the new tenant
  await prisma.tenantUser.create({
    data: { userId: session.userId, tenantId: tenant.id, role: "ADMIN" },
  });

  return ok(tenant, 201);
}
