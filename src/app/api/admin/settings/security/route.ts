import { err, ok } from "@/lib/utils/api";
import { getAuthSession } from "@/lib/auth/session";
import { getSecurityPolicy, saveSecurityPolicy } from "@/lib/settings/security";
import { type NextRequest } from "next/server";

// GET /api/admin/settings/security — read current security policy
export async function GET() {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);
  if (!session.isSuperAdmin) return err("Forbidden", 403);

  const policy = await getSecurityPolicy();
  return ok(policy);
}

interface PolicyBody {
  passwordExpiryDays?: number;
  lockoutAttempts?: number;
  lockoutMinutes?: number;
}

// PUT /api/admin/settings/security — update security policy
export async function PUT(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);
  if (!session.isSuperAdmin) return err("Forbidden", 403);

  let body: PolicyBody;
  try {
    body = await request.json();
  } catch {
    return err("Invalid request body", 400);
  }

  const { passwordExpiryDays, lockoutAttempts, lockoutMinutes } = body;

  if (
    passwordExpiryDays === undefined ||
    lockoutAttempts === undefined ||
    lockoutMinutes === undefined
  ) {
    return err("passwordExpiryDays, lockoutAttempts and lockoutMinutes are required", 400);
  }

  if (lockoutAttempts < 1 || lockoutAttempts > 20) {
    return err("lockoutAttempts must be between 1 and 20", 400);
  }
  if (lockoutMinutes < 1 || lockoutMinutes > 1440) {
    return err("lockoutMinutes must be between 1 and 1440", 400);
  }
  if (passwordExpiryDays < 0 || passwordExpiryDays > 365) {
    return err("passwordExpiryDays must be between 0 and 365", 400);
  }

  await saveSecurityPolicy({ passwordExpiryDays, lockoutAttempts, lockoutMinutes });
  return ok({ passwordExpiryDays, lockoutAttempts, lockoutMinutes });
}
