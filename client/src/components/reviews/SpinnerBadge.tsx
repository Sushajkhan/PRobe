import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

export type Severity = "ANALYZING" | "QUEUED" | "FAILED";

interface SeverityBadgeProps {
  severity: Severity;
}

export function SpinnerBadge({ severity }: SeverityBadgeProps) {
  return (
    <div className="flex track titems-center gap-4 [--radius:1.2rem]">
      <Badge
        variant="secondary"
        className="flex items-center gap-2 racking-wider font-semibold border-black/20 "
      >
        {(severity === "ANALYZING" || severity === "QUEUED") && (
          <Spinner data-icon="inline-start" />
        )}

        {severity}
      </Badge>
    </div>
  );
}
