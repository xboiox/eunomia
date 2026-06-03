import { Skeleton } from "@/components/ui/Skeleton";

export default function AssessmentsLoading() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      <div className="mt-6 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-56" />
                <Skeleton className="h-3.5 w-32" />
              </div>
              <div className="text-right space-y-2">
                <Skeleton className="h-4 w-10 ml-auto" />
                <Skeleton className="h-1.5 w-24 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
