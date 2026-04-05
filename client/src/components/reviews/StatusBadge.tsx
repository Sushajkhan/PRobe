import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReviewStatus } from "@/types";

const statusConfig: Record<ReviewStatus, { label: string; className: string }> =
  {
    QUEUED: {
      label: "Queued",
      className: "bg-muted text-muted-foreground border-border",
    },
    PROCESSING: {
      label: "Processing",
      className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    COMPLETED: {
      label: "Completed",
      className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    FAILED: {
      label: "Failed",
      className: "bg-red-500/10 text-red-500 border-red-500/20",
    },
  };

export function StatusBadge({ status }: { status: ReviewStatus }) {
  const config = statusConfig[status];
  return (
    <Badge
      variant="outline"
      className={cn("w-24  justify-center", config.className)}
    >
      {config.label}
    </Badge>
  );
}
