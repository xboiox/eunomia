import { prisma } from "@/lib/prisma/client";
import { logger } from "@/lib/logger";
import { ok, err } from "@/lib/utils/api";

// Liveness/readiness probe for container orchestrators (Docker HEALTHCHECK, Coolify).
// Public by design: it returns no tenant data and never exposes error details.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return ok({ status: "ok", database: "up" });
  } catch (error: unknown) {
    logger.error("Health check: database unreachable", error);
    return err("Database unavailable", 503);
  }
}
