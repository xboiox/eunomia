import Link from "next/link";

interface DeadlineItem {
  controlCode: string;
  controlName: string;
  deadline: Date;
  assessmentId: string;
  controlId: string;
  assessmentName: string;
  daysLeft: number;
}

interface DeadlineListProps {
  items: DeadlineItem[];
}

function urgencyClass(daysLeft: number): string {
  if (daysLeft <= 7) return "text-red-600 dark:text-red-400";
  if (daysLeft <= 14) return "text-amber-600 dark:text-amber-400";
  return "text-gray-500 dark:text-gray-400";
}

export function DeadlineList({ items }: DeadlineListProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No upcoming deadlines in the next 30 days.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-100 dark:divide-gray-700">
      {items.map((item) => (
        <li key={`${item.assessmentId}-${item.controlId}`} className="py-3">
          <Link
            href={`/dashboard/assessments/${item.assessmentId}/controls/${item.controlId}`}
            className="group flex items-start justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400">
                <span className="font-mono text-xs text-blue-600 dark:text-blue-400">
                  {item.controlCode}
                </span>{" "}
                {item.controlName}
              </p>
              <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                {item.assessmentName}
              </p>
            </div>
            <span className={`shrink-0 text-xs font-semibold ${urgencyClass(item.daysLeft)}`}>
              {item.daysLeft === 0 ? "due today" : `${item.daysLeft}d`}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
