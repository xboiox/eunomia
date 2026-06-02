import { type NextRequest } from "next/server";

import { getAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma/client";
import { err, ok } from "@/lib/utils/api";

interface RouteContext {
  params: Promise<{ frameworkId: string }>;
}

// Returns the full domain → control tree for a single framework.
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  const { frameworkId } = await params;

  const framework = await prisma.framework.findUnique({
    where: { id: frameworkId },
    include: {
      domains: {
        orderBy: { order: "asc" },
        include: {
          controls: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!framework) return err("Framework not found", 404);

  return ok(framework);
}
