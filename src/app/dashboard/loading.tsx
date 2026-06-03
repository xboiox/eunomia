import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-8">
      <Skeleton className="h-7 w-32" />
      <Skeleton className="mt-2 h-4 w-48" />

      {/* Stats cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-7 w-12" />
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <Skeleton className="h-4 w-40" />
          <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-0 dark:border-gray-700">
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-4 w-10" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <Skeleton className="h-4 w-40" />
          <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-0 dark:border-gray-700">
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
