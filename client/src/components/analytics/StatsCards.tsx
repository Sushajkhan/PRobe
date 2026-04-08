// components/analytics/StatsCards.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { RepoAnalyticsResponse } from "@/types";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  valueClassName?: string;
  isLoading: boolean;
}

function StatCard({
  label,
  value,
  subtitle,
  valueClassName,
  isLoading,
}: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      {isLoading ? (
        <>
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-3 w-32" />
        </>
      ) : (
        <>
          <p
            className={cn(
              "text-3xl font-bold tracking-tight text-foreground",
              valueClassName,
            )}
          >
            {value}
          </p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </>
      )}
    </div>
  );
}

interface StatsCardsProps {
  data: RepoAnalyticsResponse | undefined;
  isLoading: boolean;
}

export function StatsCards({ data, isLoading }: StatsCardsProps) {
  const critical = data?.severityCounts.CRITICAL ?? 0;
  const clean = data?.severityCounts.CLEAN ?? 0;
  const total = data?.totalFindings ?? 0;
  const reviews = data?.totalReviews ?? 0;

  const criticalPct = total ? ((critical / total) * 100).toFixed(1) : "0";
  const cleanPct = reviews ? ((clean / reviews) * 100).toFixed(1) : "0";
  const avgPerReview = reviews ? (total / reviews).toFixed(1) : "0";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        label="Total Reviews"
        value={reviews}
        subtitle={data?.repo ? data.repo.name : "Across all repos"}
        isLoading={isLoading}
      />
      <StatCard
        label="Total Findings"
        value={total.toLocaleString()}
        subtitle={`Avg ${avgPerReview} per review`}
        isLoading={isLoading}
      />
      <StatCard
        label="Critical Issues"
        value={critical}
        subtitle={`${criticalPct}% of all findings`}
        valueClassName="text-red-500"
        isLoading={isLoading}
      />
      <StatCard
        label="Clean Reviews"
        value={clean}
        subtitle={`${cleanPct}% of all reviews`}
        valueClassName="text-emerald-500"
        isLoading={isLoading}
      />
    </div>
  );
}
