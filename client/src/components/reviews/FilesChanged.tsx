// components/reviews/FilesChanged.tsx

"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { ReviewFinding } from "@/types";

interface FilesChangedProps {
  findings: ReviewFinding[];
}

export function FilesChanged({ findings }: FilesChangedProps) {
  const byFile = useMemo(
    () =>
      findings.reduce(
        (acc, f) => {
          acc[f.filePath] = (acc[f.filePath] ?? 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
    [findings],
  );

  if (Object.keys(byFile).length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Files Changed
      </p>

      <div className="flex flex-col gap-2">
        {Object.entries(byFile)
          .sort(([, a], [, b]) => b - a)
          .map(([file, count]) => (
            <div key={file} className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground font-mono truncate">
                {file}
              </span>
              <span
                className={cn(
                  "text-xs font-medium shrink-0",
                  count === 0
                    ? "text-emerald-500"
                    : count >= 3
                      ? "text-red-400"
                      : "text-amber-400",
                )}
              >
                {count === 1 ? "1 issue" : `${count} issues`}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
