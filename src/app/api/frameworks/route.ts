import { type NextRequest } from "next/server";

import { getAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma/client";
import { err, ok } from "@/lib/utils/api";

// Frameworks are global reference data (seeded). Any authenticated user may read them.
export async function GET(_request: NextRequest) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  const frameworks = await prisma.framework.findMany({
    orderBy: { code: "asc" },
    include: {
      _count: { select: { domains: true } },
      domains: { select: { _count: { select: { controls: true } } } },
    },
  });

  const data = frameworks.map((framework) => {
    const controlCount = framework.domains.reduce(
      (sum, domain) => sum + domain._count.controls,
      0,
    );
    return {
      id: framework.id,
      code: framework.code,
      name: framework.name,
      version: framework.version,
      description: framework.description,
      domainCount: framework._count.domains,
      controlCount,
    };
  });

  return ok(data, 200, { total: data.length });
}
