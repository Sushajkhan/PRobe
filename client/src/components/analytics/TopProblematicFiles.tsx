"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { TopProblematicFile } from "@/types";
import { ChartBarDecreasingIcon } from "lucide-react";

interface TopProblematicFilesProps {
  data: TopProblematicFile[] | undefined;
  isLoading: boolean;
}

export function TopProblematicFiles({
  data,
  isLoading,
}: TopProblematicFilesProps) {
  const max = data?.[0]?.findingCount ?? 1;

  const isEmpty = !isLoading && (!data || data.length === 0);

  return (
    <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Top Problematic Files
      </p>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-3 w-4 shrink-0" />
              <Skeleton className="h-3 flex-1" />
              <Skeleton className="h-2 w-24" />
              <Skeleton className="h-3 w-6 shrink-0" />
            </div>
          ))
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center px-4">
            <ChartBarDecreasingIcon className="h-6 w-6 text-muted-foreground/40" />

            <p className="text-sm text-muted-foreground">No review data yet</p>

            <p className="text-xs text-muted-foreground/60">
              Analytics will appear once reviews are generated.
            </p>
          </div>
        ) : (
          (data ?? []).slice(0, 5).map((item, i) => (
            <div key={item.filePath} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground/50 w-4 shrink-0 text-right">
                {i + 1}
              </span>

              <span className="text-xs text-muted-foreground font-mono flex-1 truncate">
                {item.filePath}
              </span>

              <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden shrink-0">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.max((item.findingCount / max) * 100, 4)}%`,
                  }}
                />
              </div>

              <span className="text-xs font-semibold text-foreground w-6 text-right shrink-0">
                {item.findingCount}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
