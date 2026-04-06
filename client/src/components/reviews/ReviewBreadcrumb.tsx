"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import type { PRReview } from "@/types";

interface ReviewBreadcrumbProps {
  review: PRReview | undefined;
  isPending: boolean;
}

export function ReviewBreadcrumb({ review, isPending }: ReviewBreadcrumbProps) {
  return (
    <div className="flex h-10 items-center justify-between  bg-background px-6 md:px-8 shrink-0">
      {isPending ? (
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3.5 w-3" />
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3.5 w-3" />
          <Skeleton className="h-3.5 w-14" />
        </div>
      ) : (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/reviews">Reviews</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem className="hidden sm:flex">
              <BreadcrumbLink asChild>
                <span className="text-muted-foreground">
                  {review?.repository.fullName}
                </span>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="hidden sm:flex" />

            <BreadcrumbItem>
              <BreadcrumbPage>PR #{review?.prNumber}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {review && (
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1.5"
          asChild
        >
          <a href={review.url} target="_blank" rel="noopener noreferrer">
            View on GitHub
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      )}
    </div>
  );
}
