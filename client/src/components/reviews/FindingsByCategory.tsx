"use client";

import { ReviewFinding } from "@/types";
import { useMemo } from "react";

interface FindingsByCategoryProps {
  findings: ReviewFinding[];
}

export function FindingsByCategory({ findings }: FindingsByCategoryProps) {
  const byCategory = useMemo(
    () =>
      findings.reduce(
        (acc, f) => {
          acc[f.category] = (acc[f.category] ?? 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
    [findings],
  );

  if (Object.keys(byCategory).length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Findings by Category
      </p>

      <div className="flex flex-col gap-2">
        {Object.entries(byCategory)
          .sort(([, a], [, b]) => b - a)
          .map(([cat, count]) => (
            <div key={cat} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{cat}</span>
              <span className="text-sm font-medium text-foreground">
                {count}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
