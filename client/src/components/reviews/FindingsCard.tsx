"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReviewFinding, Severity } from "@/types";

const severityLeftBorder: Record<Severity, string> = {
  CRITICAL: "border-l-red-500",
  WARNING: "border-l-amber-500",
  SUGGESTION: "border-l-blue-400",
  CLEAN: "border-l-emerald-500",
};

const severityLabelColor: Record<Severity, string> = {
  CRITICAL: "text-red-500",
  WARNING: "text-amber-400",
  SUGGESTION: "text-blue-400",
  CLEAN: "text-emerald-500",
};

export function FindingsCard({ finding }: { finding: ReviewFinding }) {
  return (
    <div
      className={cn(
        "rounded-md border border-border border-l-2 bg-card/50 p-4 flex flex-col gap-3",
        severityLeftBorder[finding.severity],
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-foreground">
              {finding.title}
            </span>
            <Badge variant="secondary" className="text-xs font-mono">
              {finding.category}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {finding.filePath}
            {finding.lineNumber ? ` :${finding.lineNumber}` : ""}
          </span>
        </div>

        <span
          className={cn(
            "text-xs font-semibold shrink-0",
            severityLabelColor[finding.severity],
          )}
        >
          {finding.severity}
        </span>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {finding.description}
      </p>

      {finding.suggestion && (
        <div className="rounded-md bg-muted/50 border border-border p-3 flex flex-col gap-1">
          <span className="text-xs font-medium text-amber-400">💡 Fix</span>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            {finding.suggestion}
          </p>
        </div>
      )}
    </div>
  );
}
