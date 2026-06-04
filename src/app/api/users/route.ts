import bcrypt from "bcrypt";
import { err, ok } from "@/lib/utils/api";
import { getAuthSession } from "@/lib/auth/session";
import { hasMinimumTenantRole } from "@/lib/auth/rbac";
import { generateTemporaryPassword } from "@/lib/auth/generatePassword";
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

interface CreateUserBody {
  name?: string;
  email?: string;
  role?: TenantRole;
  tenantId?: string;
}

// POST /api/users — create a new user account and add them to a tenant.
// The caller (Tenant Admin or Super Admin) receives a one-time temporary
// password to hand to the new user out-of-band. The user is forced to change
// it on first login.
export async function POST(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  let body: CreateUserBody;
  try {
    body = await request.json();
  } catch {
    return err("Invalid request body", 400);
  }

  const { name, email, role, tenantId } = body;

  if (!name?.trim() || !email?.trim() || !tenantId || !role) {
    return err("name, email, role and tenantId are required", 400);
  }
  if (!["ADMIN", "ASSESSOR"].includes(role)) {
    return err("role must be ADMIN or ASSESSOR", 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return err("Invalid email address", 400);
  }

  const canAccess = await hasMinimumTenantRole(session.userId, tenantId, "ADMIN");
  if (!canAccess) return err("Forbidden", 403);

  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existing) return err("An account with this email already exists", 409);

  const temporaryPassword = generateTemporaryPassword();
  const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      mustChangePassword: true,
      tenantUsers: {
        create: { tenantId, role },
      },
    },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  // The temporary password is returned ONCE — it is not stored in plain text.
  return ok({ ...user, role, temporaryPassword }, 201);
}
