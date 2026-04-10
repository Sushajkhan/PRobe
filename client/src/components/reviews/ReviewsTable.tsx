"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { GitPullRequest, GitBranch } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { SeverityBadge } from "./SeverityBadge";
import { Skeleton } from "@/components/ui/skeleton";
import type { PRReview } from "@/types";
import { SpinnerBadge } from "./SpinnerBadge";

interface ReviewsTableProps {
  reviews: PRReview[];
  isLoading: boolean;
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-64" />
          <Skeleton className="h-3 w-40" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-3.5 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-20 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-24 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-3.5 w-6" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-3 w-16" />
      </TableCell>
    </TableRow>
  );
}

function ReviewRow({ review }: { review: PRReview }) {
  const router = useRouter();

  return (
    <TableRow
      className="group cursor-pointer hover:bg-muted/40 transition-colors"
      onClick={() => router.push(`/reviews/${review.id}`)}
    >
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground group-hover:text-foreground/90 truncate max-w-[320px]">
            {review.title}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>PR #{review.prNumber}</span>
            <span>·</span>
            <span>{review.author}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              <span className="font-mono">{review.baseBranch}</span>
              <span>←</span>
              <span className="font-mono">{review.headBranch}</span>
            </span>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <span className="text-sm text-muted-foreground font-mono">
          {review.repository.name}
        </span>
      </TableCell>

      <TableCell>
        <StatusBadge status={review.status} />
      </TableCell>

      <TableCell>
        {review.status === "COMPLETED" && (
          <SeverityBadge severity={review.overallSeverity} />
        )}
        {review.status === "PROCESSING" && (
          <SpinnerBadge severity="ANALYZING" />
        )}
        {review.status === "QUEUED" && <SpinnerBadge severity="QUEUED" />}
        {review.status === "FAILED" && <SpinnerBadge severity="FAILED" />}{" "}
      </TableCell>

      <TableCell>
        <span className="text-sm font-medium text-foreground">
          {review.totalIssues}
        </span>
      </TableCell>

      <TableCell>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
        </span>
      </TableCell>
    </TableRow>
  );
}

export function ReviewsTable({ reviews, isLoading }: ReviewsTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="text-xs text-muted-foreground font-medium">
              Pull Request
            </TableHead>
            <TableHead className="text-xs text-muted-foreground font-medium">
              Repository
            </TableHead>
            <TableHead className="text-xs text-muted-foreground font-medium">
              Status
            </TableHead>
            <TableHead className="text-xs text-muted-foreground font-medium">
              Severity
            </TableHead>
            <TableHead className="text-xs text-muted-foreground font-medium">
              Issues
            </TableHead>
            <TableHead className="text-xs text-muted-foreground font-medium">
              Time
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
          ) : reviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
                  <GitPullRequest className="h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    No reviews found
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    Try adjusting your filters or open a pull request in a
                    connected repo.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            reviews.map((review) => (
              <ReviewRow key={review.id} review={review} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
