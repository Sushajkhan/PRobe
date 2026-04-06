"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { GitBranch, Clock, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/reviews/StatusBadge";
import { SeverityBadge } from "@/components/reviews/SeverityBadge";
import { FeedbackButtons } from "@/components/reviews/FeedbackButtons";
import { FindingsCard } from "@/components/reviews/FindingsCard";
import { ReviewBreadcrumb } from "@/components/reviews/ReviewBreadcrumb";
import { useReview } from "@/hooks/useReviews";
import type { Severity } from "@/types";
import { useMemo } from "react";
import { FindingsByCategory } from "@/components/reviews/FindingsByCategory";
import { FilesChanged } from "@/components/reviews/FilesChanged";

const SEVERITY_ORDER: Severity[] = [
  "CRITICAL",
  "WARNING",
  "SUGGESTION",
  "CLEAN",
];

const severityColor: Record<Severity, string> = {
  CRITICAL: "text-red-500",
  WARNING: "text-amber-400",
  SUGGESTION: "text-blue-400",
  CLEAN: "text-emerald-500",
};

export default function ReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: review, isPending, isError } = useReview(id);

  const findingsBySeverity = useMemo(
    () =>
      SEVERITY_ORDER.reduce(
        (acc, sev) => {
          acc[sev] = (review?.findings ?? []).filter((f) => f.severity === sev);
          return acc;
        },
        {} as Record<Severity, NonNullable<typeof review>["findings"]>,
      ),
    [review?.findings],
  );

  const counts = useMemo(
    () => ({
      CRITICAL: findingsBySeverity.CRITICAL.length,
      WARNING: findingsBySeverity.WARNING.length,
      SUGGESTION: findingsBySeverity.SUGGESTION.length,
    }),
    [findingsBySeverity],
  );

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3">
        <p className="text-sm text-muted-foreground">Review not found.</p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/reviews">← Back to reviews</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-0">
      <ReviewBreadcrumb review={review} isPending={isPending} />

      {isPending ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="p-6 md:p-8 flex flex-col gap-6  mx-auto w-full">
          <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-lg font-semibold text-foreground leading-snug">
                {review?.title}
              </h1>
              {review && <SeverityBadge severity={review.overallSeverity} />}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              <span>
                Author{" "}
                <span className="text-foreground font-medium">
                  {review?.author}
                </span>
              </span>
              <span>PR #{review?.prNumber}</span>
              <span className="flex items-center gap-1">
                <GitBranch className="h-3 w-3" />
                <span className="font-mono">{review?.baseBranch}</span>
                <span>←</span>
                <span className="font-mono">{review?.headBranch}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Reviewed{" "}
                {review &&
                  formatDistanceToNow(new Date(review.createdAt), {
                    addSuffix: true,
                  })}
                {review?.processingTime &&
                  ` · ${review.processingTime.toFixed(1)}s`}
              </span>
              {review && <StatusBadge status={review.status} />}
            </div>

            <div className="flex items-center gap-6 pt-1 border-t border-border">
              {(["CRITICAL", "WARNING", "SUGGESTION"] as Severity[]).map(
                (sev) => (
                  <div key={sev} className="flex flex-col gap-0.5">
                    <span
                      className={`text-2xl font-bold ${severityColor[sev]}`}
                    >
                      {counts[sev as keyof typeof counts]}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {sev.charAt(0) + sev.slice(1).toLowerCase()}
                    </span>
                  </div>
                ),
              )}
              <div className="flex flex-col gap-0.5">
                <span className="text-2xl font-bold text-foreground">
                  {review?.totalIssues}
                </span>
                <span className="text-xs text-muted-foreground">
                  Total Issues
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 items-start">
            <div className="flex flex-col gap-5">
              {review?.summary && (
                <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    AI Summary
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {review.summary}
                  </p>
                </div>
              )}

              {SEVERITY_ORDER.filter(
                (sev) => findingsBySeverity[sev].length > 0,
              ).map((sev) => (
                <div key={sev} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${severityColor[sev]}`}
                    >
                      {sev}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {findingsBySeverity[sev].length}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  {findingsBySeverity[sev].map((finding) => (
                    <FindingsCard key={finding.id} finding={finding} />
                  ))}
                </div>
              ))}

              {review?.findings.length === 0 && (
                <div className="rounded-lg border border-border bg-card p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No issues found — this PR looks clean! 🎉
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {review && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <FeedbackButtons
                    reviewId={review.id}
                    userFeedback={review.userFeedback}
                  />
                </div>
              )}

              <FindingsByCategory findings={review.findings} />
              <FilesChanged findings={review.findings} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
