import bcrypt from "bcrypt";
import { err, ok } from "@/lib/utils/api";
import { getAuthSession } from "@/lib/auth/session";
import { hasMinimumTenantRole } from "@/lib/auth/rbac";
import { generateTemporaryPassword } from "@/lib/auth/generatePassword";
import { sendTenantAddedEmail } from "@/lib/email/send";
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

// POST /api/users — smart create-or-add:
//
//   New user (email not in DB):
//     Creates account with auto-generated temp password (mustChangePassword=true).
//     Returns { created: true, temporaryPassword } — show to admin once.
//
//   Existing user (already has an account, e.g. member of another tenant):
//     Adds them to the new tenant without touching their account or password.
//     Sends an email notification if SMTP is configured.
//     Returns { created: false } — admin informs user manually if SMTP absent.
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

  if (!email?.trim() || !tenantId || !role) {
    return err("email, role and tenantId are required", 400);
  }
  if (!["ADMIN", "ASSESSOR"].includes(role)) {
    return err("role must be ADMIN or ASSESSOR", 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return err("Invalid email address", 400);
  }

  const canAccess = await hasMinimumTenantRole(session.userId, tenantId, "ADMIN");
  if (!canAccess) return err("Forbidden", 403);

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { name: true },
  });
  if (!tenant) return err("Tenant not found", 404);

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  if (existingUser) {
    // User already has an account — check they're not already in this tenant.
    const alreadyMember = await prisma.tenantUser.findUnique({
      where: { userId_tenantId: { userId: existingUser.id, tenantId } },
    });
    if (alreadyMember) return err("This user is already a member of the organization", 409);

    await prisma.tenantUser.create({
      data: { userId: existingUser.id, tenantId, role },
    });

    // Notify the user if SMTP is configured — they didn't get a temp password
    // so this is the only way they learn about the new tenant access.
    await sendTenantAddedEmail({
      to: existingUser.email!,
      userName: existingUser.name ?? existingUser.email!,
      tenantName: tenant.name,
      role,
      appUrl: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
    }).catch(() => {
      // Email failure is non-fatal; admin can notify manually.
    });

    return ok({ ...existingUser, role, created: false }, 200);
  }

  // New user — name is required when creating a fresh account.
  if (!name?.trim()) {
    return err("name is required when creating a new user account", 400);
  }

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

  return ok({ ...user, role, created: true, temporaryPassword }, 201);
}
