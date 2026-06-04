import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

export interface AuthSession {
  userId: string;
  email: string;
  isSuperAdmin: boolean;
  mustChangePassword: boolean;
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return {
    userId: session.user.id,
    email: session.user.email ?? "",
    isSuperAdmin: session.user.isSuperAdmin ?? false,
    mustChangePassword: session.user.mustChangePassword ?? false,
  };
}
