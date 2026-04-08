"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { OverviewResponse, Severity } from "@/types";

const severityConfig: {
  key: Severity;
  label: string;
  barClass: string;
  valueClass: string;
}[] = [
  {
    key: "CRITICAL",
    label: "Critical",
    barClass: "bg-red-500",
    valueClass: "text-red-500",
  },
  {
    key: "WARNING",
    label: "Warning",
    barClass: "bg-amber-400",
    valueClass: "text-amber-400",
  },
  {
    key: "SUGGESTION",
    label: "Suggestion",
    barClass: "bg-blue-400",
    valueClass: "text-blue-400",
  },
  {
    key: "CLEAN",
    label: "Clean",
    barClass: "bg-emerald-500",
    valueClass: "text-emerald-500",
  },
];

interface FindingsBySeverityProps {
  data: OverviewResponse | undefined;
  isLoading: boolean;
}

export function FindingsBySeverity({
  data,
  isLoading,
}: FindingsBySeverityProps) {
  const counts = {
    CRITICAL: data?.severityCounts.CRITICAL ?? 0,
    WARNING: data?.severityCounts.WARNING ?? 0,
    SUGGESTION: data?.severityCounts.SUGGESTION ?? 0,
    CLEAN: data?.severityCounts.CLEAN ?? 0,
  };

  const max = Math.max(...Object.values(counts), 1);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Findings by Severity
        </h2>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-3 w-16 shrink-0" />
                <Skeleton className="h-2 flex-1 rounded-full" />
                <Skeleton className="h-3 w-6 shrink-0" />
              </div>
            ))
          : severityConfig.map(({ key, label, barClass, valueClass }) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-16 shrink-0">
                  {label}
                </span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      barClass,
                    )}
                    style={{ width: `${(counts[key] / max) * 100}%` }}
                  />
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold w-6 text-right shrink-0",
                    valueClass,
                  )}
                >
                  {counts[key]}
                </span>
              </div>
            ))}
      </div>
    </div>
  );
}
