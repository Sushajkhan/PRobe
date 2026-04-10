import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Severity } from "@/types";

const severityClassName: Record<Severity, string> = {
  CRITICAL: "bg-red-500/15 text-red-500 border-red-500/30 hover:bg-red-500/20",
  WARNING:
    "bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/20",
  SUGGESTION:
    "bg-blue-500/15 text-blue-400 border-blue-500/30 hover:bg-blue-500/20",
  CLEAN:
    "bg-emerald-500/15 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20",
};

interface SeverityBadgeProps {
  severity: Severity;
  dot?: boolean;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-semibold tracking-wide",
        severityClassName[severity],
      )}
    >
      {severity}
    </Badge>
  );
}
