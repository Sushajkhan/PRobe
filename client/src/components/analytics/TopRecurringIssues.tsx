"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { FindingCategory, FindingsResponse, FindingSummary } from "@/types";
import { FileText } from "lucide-react";

interface TopRecurringIssuesProps {
  data: FindingsResponse | undefined;
  isLoading: boolean;
}

export const categoryTextColors: Record<FindingCategory, string> = {
  Security: "text-red-500",
  "Bug Risk": "text-orange-500",
  Maintainability: "text-amber-500",
  Performance: "text-yellow-500",
  "Code Quality": "text-slate-400",
  "Best Practice": "text-muted",
};

function IssueRow({ issue }: { issue: FindingSummary }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
      <span className="text-sm text-foreground flex-1 min-w-0 truncate">
        {issue.title}
      </span>

      <div className="flex items-center gap-2 shrink-0">
        <Badge variant="outline" className="text-xs font-mono">
          {issue.category}
        </Badge>

        <div className="flex flex-col items-end">
          <span
            className={cn(
              "text-sm font-bold",
              categoryTextColors[issue.category as FindingCategory],
            )}
          >
            {issue.occurrences}×
          </span>
          <span className="text-[10px] text-muted-foreground">occurrences</span>
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
      <Skeleton className="h-3.5 flex-1 max-w-60" />
      <div className="flex items-center gap-2 shrink-0">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-10" />
      </div>
    </div>
  );
}

export function TopRecurringIssues({
  data,
  isLoading,
}: TopRecurringIssuesProps) {
  const findings = data?.findings ?? [];
  const isEmpty = !isLoading && findings.length === 0;

  const half = Math.ceil(findings.length / 2);
  const left = findings.slice(0, half);
  const right = findings.slice(half);

  return (
    <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Top Recurring Issues
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
          <div>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center px-4">
          <FileText className="h-6 w-6 text-muted-foreground/40" />

          <p className="text-sm text-muted-foreground">No review data yet</p>

          <p className="text-xs text-muted-foreground/60">
            Analytics will appear once reviews are generated.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div>
            {left.map((issue) => (
              <IssueRow key={issue.title} issue={issue} />
            ))}
          </div>
          <div>
            {right.map((issue) => (
              <IssueRow key={issue.title} issue={issue} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
