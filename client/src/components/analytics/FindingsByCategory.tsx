"use client";

import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { FindingCategory } from "@/types";
import { ChartBar } from "lucide-react";

const categoryBgColors: Record<FindingCategory, string> = {
  Security: "bg-red-500",
  "Bug Risk": "bg-orange-500",
  Maintainability: "bg-amber-500",
  Performance: "bg-yellow-500",
  "Code Quality": "bg-slate-400",
  "Best Practice": "bg-muted",
};

interface CategoryItem {
  category: string;
  count: number;
}

interface FindingsByCategoryProps {
  data: Record<string, number> | undefined;
  isLoading: boolean;
}

export function FindingsByCategory({
  data,
  isLoading,
}: FindingsByCategoryProps) {
  const formattedData: CategoryItem[] = useMemo(() => {
    if (!data) return [];

    return Object.entries(data)
      .map(([category, count]) => ({
        category,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const max = formattedData[0]?.count ?? 1;

  return (
    <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Findings by Category
      </p>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-3 w-24 shrink-0" />
              <Skeleton className="h-2 flex-1 rounded-full" />
              <Skeleton className="h-3 w-8 shrink-0" />
            </div>
          ))
        ) : formattedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center px-4">
            <ChartBar className="h-6 w-6 text-muted-foreground/40" />

            <p className="text-sm text-muted-foreground">
              No category data yet
            </p>

            <p className="text-xs text-muted-foreground/60">
              Insights will appear once reviews are generated.
            </p>
          </div>
        ) : (
          formattedData.map((item) => {
            const category = item.category as FindingCategory;

            return (
              <div key={item.category} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-28 shrink-0 text-right truncate">
                  {item.category}
                </span>

                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      categoryBgColors[category] ?? "bg-muted",
                    )}
                    style={{
                      width: `${(item.count / max) * 100}%`,
                    }}
                  />
                </div>

                <span className="text-xs text-muted-foreground w-8 text-right shrink-0">
                  {item.count}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
