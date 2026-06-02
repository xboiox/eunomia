import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma/client";

interface PageProps {
  params: Promise<{ frameworkId: string }>;
}

interface ControlRow {
  id: string;
  code: string;
  sectionCode: string | null;
  sectionName: string | null;
  name: string;
  description: string | null;
}

// Groups a domain's controls by sectionName, preserving order. Controls without
// a section fall under a single null-keyed group.
function groupBySection(controls: ControlRow[]): Map<string | null, ControlRow[]> {
  const groups = new Map<string | null, ControlRow[]>();
  for (const control of controls) {
    const key = control.sectionName ?? null;
    const existing = groups.get(key);
    if (existing) {
      existing.push(control);
    } else {
      groups.set(key, [control]);
    }
  }
  return groups;
}

export default async function FrameworkDetailPage({ params }: PageProps) {
  const session = await getAuthSession();
  if (!session) redirect("/signin");

  const { frameworkId } = await params;

  const framework = await prisma.framework.findUnique({
    where: { id: frameworkId },
    include: {
      domains: {
        orderBy: { order: "asc" },
        include: { controls: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!framework) notFound();

  const controlCount = framework.domains.reduce(
    (sum, domain) => sum + domain.controls.length,
    0,
  );

  return (
    <div className="p-8">
      <Link
        href="/dashboard/frameworks"
        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        ← Frameworks
      </Link>

      <div className="mt-3 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {framework.name}
        </h1>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          v{framework.version}
        </span>
      </div>
      {framework.description && (
        <p className="mt-2 max-w-3xl text-sm text-gray-500 dark:text-gray-400">
          {framework.description}
        </p>
      )}
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {framework.domains.length} domains · {controlCount} controls
      </p>

      <div className="mt-8 space-y-10">
        {framework.domains.map((domain) => {
          const sections = groupBySection(domain.controls);
          return (
            <section key={domain.id}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                <span className="text-gray-400">{domain.code}</span> {domain.name}
              </h2>
              {domain.description && (
                <p className="mt-1 max-w-3xl text-sm text-gray-500 dark:text-gray-400">
                  {domain.description}
                </p>
              )}

              <div className="mt-4 space-y-6">
                {Array.from(sections.entries()).map(([sectionName, controls]) => (
                  <div key={sectionName ?? "_"}>
                    {sectionName && (
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {controls[0]?.sectionCode ? `${controls[0].sectionCode} — ` : ""}
                        {sectionName}
                      </h3>
                    )}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                      <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                        {controls.map((control) => (
                          <li key={control.id} className="px-5 py-3.5">
                            <div className="flex gap-3">
                              <span className="shrink-0 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                                {control.code}
                              </span>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {control.name}
                                </p>
                                {control.description && (
                                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                    {control.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
