import Link from "next/link";
import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma/client";

export default async function FrameworksPage() {
  const session = await getAuthSession();
  if (!session) redirect("/signin");

  const frameworks = await prisma.framework.findMany({
    orderBy: { code: "asc" },
    include: {
      _count: { select: { domains: true } },
      domains: { select: { _count: { select: { controls: true } } } },
    },
  });

  return (
    <div className="p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Frameworks</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Browse the security control libraries available for assessment.
        </p>
      </div>

      {frameworks.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-gray-300 p-10 text-center dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            No frameworks loaded yet. Run{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">
              npm run db:seed
            </code>{" "}
            to populate framework data.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {frameworks.map((framework) => {
            const controlCount = framework.domains.reduce(
              (sum, domain) => sum + domain._count.controls,
              0,
            );
            return (
              <Link
                key={framework.id}
                href={`/dashboard/frameworks/${framework.id}`}
                className="group rounded-xl border border-gray-200 bg-white p-6 transition-colors hover:border-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400">
                    {framework.name}
                  </h2>
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    v{framework.version}
                  </span>
                </div>
                {framework.description && (
                  <p className="mt-3 line-clamp-3 text-sm text-gray-500 dark:text-gray-400">
                    {framework.description}
                  </p>
                )}
                <div className="mt-4 flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {framework._count.domains}
                    </span>{" "}
                    domains
                  </span>
                  <span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {controlCount}
                    </span>{" "}
                    controls
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
