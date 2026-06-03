interface StatCard {
  label: string;
  value: string | number;
  sub?: string;
}

interface StatsCardsProps {
  cards: StatCard[];
}

export function StatsCards({ cards }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{card.value}</p>
          {card.sub && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{card.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}
