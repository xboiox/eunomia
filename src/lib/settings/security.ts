import { prisma } from "@/lib/prisma/client";

export interface SecurityPolicy {
  passwordExpiryDays: number;  // 0 = disabled
  lockoutAttempts: number;
  lockoutMinutes: number;
}

const DEFAULTS: SecurityPolicy = {
  passwordExpiryDays: 0,
  lockoutAttempts: 5,
  lockoutMinutes: 30,
};

const KEYS = {
  passwordExpiryDays: "password_expiry_days",
  lockoutAttempts: "lockout_attempts",
  lockoutMinutes: "lockout_minutes",
} as const;

export async function getSecurityPolicy(): Promise<SecurityPolicy> {
  const rows = await prisma.appSettings.findMany({
    where: { key: { in: Object.values(KEYS) } },
  });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return {
    passwordExpiryDays: Number(map[KEYS.passwordExpiryDays] ?? DEFAULTS.passwordExpiryDays),
    lockoutAttempts: Number(map[KEYS.lockoutAttempts] ?? DEFAULTS.lockoutAttempts),
    lockoutMinutes: Number(map[KEYS.lockoutMinutes] ?? DEFAULTS.lockoutMinutes),
  };
}

export async function saveSecurityPolicy(policy: SecurityPolicy): Promise<void> {
  const entries: Array<{ key: string; value: string }> = [
    { key: KEYS.passwordExpiryDays, value: String(Math.max(0, policy.passwordExpiryDays)) },
    { key: KEYS.lockoutAttempts, value: String(Math.max(1, policy.lockoutAttempts)) },
    { key: KEYS.lockoutMinutes, value: String(Math.max(1, policy.lockoutMinutes)) },
  ];

  await prisma.$transaction(
    entries.map((e) =>
      prisma.appSettings.upsert({
        where: { key: e.key },
        create: { key: e.key, value: e.value },
        update: { value: e.value },
      }),
    ),
  );
}

export function isPasswordExpired(policy: SecurityPolicy, passwordChangedAt: Date | null, createdAt: Date): boolean {
  if (policy.passwordExpiryDays <= 0) return false;
  const baseline = passwordChangedAt ?? createdAt;
  const expiryMs = policy.passwordExpiryDays * 24 * 60 * 60 * 1000;
  return Date.now() - baseline.getTime() > expiryMs;
}
