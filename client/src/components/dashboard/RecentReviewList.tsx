"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { OverviewRecentReview, Severity } from "@/types";
import { FileText } from "lucide-react";

const severityDotColor: Record<Severity, string> = {
  CRITICAL: "bg-red-500",
  WARNING: "bg-amber-400",
  SUGGESTION: "bg-blue-400",
  CLEAN: "bg-emerald-500",
};

const severityBadgeClass: Record<Severity, string> = {
  CRITICAL: "bg-red-500/15 text-red-500 border-red-500/30",
  WARNING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  SUGGESTION: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  CLEAN: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
};

function ReviewRow({ review }: { review: OverviewRecentReview }) {
  return (
    <Link
      href={`/reviews/${review.id}`}
      className="group flex items-center justify-between gap-4 px-4 py-3.5 border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={cn(
            "h-2 w-2 rounded-full shrink-0",
            severityDotColor[review.overallSeverity],
          )}
        />

        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-medium text-foreground truncate group-hover:text-foreground/90">
            {review.title}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-mono">{review.repository.fullName}</span>
            <span>·</span>
            <span>PR #{review.prNumber}</span>
            <span>·</span>
            <span>
              {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <span
          className={cn(
            "inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-semibold tracking-wide",
            severityBadgeClass[review.overallSeverity],
          )}
        >
          {review.overallSeverity}
        </span>
        <span className="text-xs text-muted-foreground">
          {review.totalIssues} {review.totalIssues === 1 ? "issue" : "issues"}
        </span>
      </div>
    </Link>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5 border-b border-border last:border-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Skeleton className="h-2 w-2 rounded-full shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <Skeleton className="h-3.5 w-56" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <Skeleton className="h-5 w-20 rounded" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

interface RecentReviewsListProps {
  reviews: OverviewRecentReview[] | undefined;
  isLoading: boolean;
}

export function RecentReviewsList({
  reviews,
  isLoading,
}: RecentReviewsListProps) {
  return (
    <div className="rounded-lg h-full border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">
          Recent Reviews
        </h2>
        <Link
          href="/reviews"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
        </Link>
      </div>

      {isLoading ? (
        Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
      ) : (reviews ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center px-4">
          <FileText className="h-7 w-7 text-muted-foreground/40" />

          <p className="text-sm text-muted-foreground">No reviews yet</p>

          <p className="text-xs text-muted-foreground/60">
            Open a pull request in a connected repository to see reviews here.
          </p>
        </div>
      ) : (
        (reviews ?? []).map((review) => (
          <ReviewRow key={review.id} review={review} />
        ))
      )}
    </div>
  );
}
