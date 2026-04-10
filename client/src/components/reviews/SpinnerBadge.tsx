import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { XCircle } from "lucide-react";

export type Severity = "ANALYZING" | "QUEUED" | "FAILED";

interface SeverityBadgeProps {
  severity: Severity;
}

export function SpinnerBadge({ severity }: SeverityBadgeProps) {
  return (
    <div className="flex items-center gap-4 [--radius:1.2rem]">
      <Badge variant="secondary" className="flex items-center gap-2">
        {(severity === "ANALYZING" || severity === "QUEUED") && (
          <Spinner data-icon="inline-start" />
        )}

        {severity === "FAILED" && <XCircle className="w-4 h-4 text-red-500" />}

        {severity}
      </Badge>
    </div>
  );
}
