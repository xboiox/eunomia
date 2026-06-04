import bcrypt from "bcrypt";
import { err, ok } from "@/lib/utils/api";
import { getAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma/client";
import { type NextRequest } from "next/server";

const MIN_PASSWORD_LENGTH = 8;

interface PatchBody {
  currentPassword?: string;
  newPassword?: string;
}

// PATCH /api/users/me/password — authenticated user changes their own password.
// Clears mustChangePassword so they are not redirected again after next login.
export async function PATCH(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  let body: PatchBody;
  try {
    body = await request.json();
  } catch {
    return err("Invalid request body", 400);
  }

  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return err("currentPassword and newPassword are required", 400);
  }
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return err(`New password must be at least ${MIN_PASSWORD_LENGTH} characters`, 400);
  }
  if (currentPassword === newPassword) {
    return err("New password must differ from the current password", 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { password: true },
  });
  if (!user?.password) return err("Account has no password set", 400);

  const matches = await bcrypt.compare(currentPassword, user.password);
  if (!matches) return err("Current password is incorrect", 401);

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: session.userId },
    data: {
      password: hashedPassword,
      mustChangePassword: false,
      passwordChangedAt: new Date(),
    },
  });

  return ok({ changed: true });
}
