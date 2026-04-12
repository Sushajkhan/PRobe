"use client";

import { Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useReviews } from "@/hooks/useReviews";
import { useConnectedRepos } from "@/hooks/useRepos";
import { ReviewFilters } from "@/components/reviews/ReviewFilters";
import { ReviewsTable } from "@/components/reviews/ReviewsTable";
import { Pagination } from "@/components/reviews/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReviewFilters as Filters } from "@/components/reviews/ReviewFilters";

function FiltersSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Skeleton className="h-9 flex-1" />
      <Skeleton className="h-9 w-full sm:w-40" />
      <Skeleton className="h-9 w-full sm:w-37.5" />
      <Skeleton className="h-9 w-full sm:w-40" />
    </div>
  );
}

function ReviewsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const filters: Filters = {
    search: searchParams.get("search") ?? "",
    status: searchParams.get("status") ?? "all",
    severity: searchParams.get("severity") ?? "all",
    repositoryId: searchParams.get("repositoryId") ?? "all",
  };

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  function handleFiltersChange(next: Filters) {
    updateParams({
      search: next.search,
      status: next.status,
      severity: next.severity,
      repositoryId: next.repositoryId,
      page: null,
    });
  }

  function handlePageChange(newPage: number) {
    updateParams({ page: String(newPage) });
  }

  const debouncedSearch = useDebounce(filters.search, 300);
  const { data: repos, isPending: reposPending } = useConnectedRepos();

  const { data, isPending } = useReviews({
    page,
    search: debouncedSearch || undefined,
    status: filters.status !== "all" ? filters.status : undefined,
    severity: filters.severity !== "all" ? filters.severity : undefined,
    repositoryId:
      filters.repositoryId !== "all" ? filters.repositoryId : undefined,
  });

  const filtersLoading = reposPending || isPending;

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 mx-auto w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Reviews
        </h1>
        <p className="text-sm text-muted-foreground">
          AI-powered code reviews across all your connected repositories.
        </p>
        <div className="h-px bg-border mt-4" />
      </div>

      {filtersLoading ? (
        <FiltersSkeleton />
      ) : (
        <ReviewFilters
          filters={filters}
          repos={repos ?? []}
          onChange={handleFiltersChange}
        />
      )}

      <ReviewsTable reviews={data?.reviews ?? []} isLoading={isPending} />

      <Pagination
        page={page}
        totalPages={data?.totalPages ?? 0}
        total={data?.total ?? 0}
        limit={data?.limit ?? 20}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={null}>
      <ReviewsContent />
    </Suspense>
  );
}
