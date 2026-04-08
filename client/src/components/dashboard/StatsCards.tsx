"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { OverviewResponse } from "@/types";

interface StatCardProps {
  label: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  valueClassName?: string;
  isLoading: boolean;
}

function StatCard({
  label,
  value,
  trend,
  trendUp,
  valueClassName,
  isLoading,
}: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      {isLoading ? (
        <>
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-3 w-28" />
        </>
      ) : (
        <>
          <p
            className={cn(
              "text-4xl font-bold tracking-tight text-foreground",
              valueClassName,
            )}
          >
            {value}
          </p>
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trendUp ? "text-emerald-500" : "text-red-400",
            )}
          >
            {trendUp ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trend}
          </div>
        </>
      )}
    </div>
  );
}

interface StatsCardsProps {
  data: OverviewResponse | undefined;
  isLoading: boolean;
}

export function StatsCards({ data, isLoading }: StatsCardsProps) {
  const critical = data?.severityCounts.CRITICAL ?? 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Reviews"
        value={(data?.totalReviews ?? 0).toLocaleString()}
        trend={`${data?.reviewsThisWeek ?? 0} this week`}
        trendUp={(data?.reviewsThisWeek ?? 0) > 0}
        isLoading={isLoading}
      />
      <StatCard
        label="Critical Issues"
        value={critical}
        trend={`${data?.criticalThisWeek ?? 0} since last week`}
        trendUp={false}
        valueClassName="text-red-500"
        isLoading={isLoading}
      />
      <StatCard
        label="Total Findings"
        value={(data?.totalFindings ?? 0).toLocaleString()}
        trend={`${data?.findingsThisWeek ?? 0} this week`}
        trendUp={(data?.findingsThisWeek ?? 0) > 0}
        isLoading={isLoading}
      />
      <StatCard
        label="Active Repos"
        value={data?.totalRepos ?? 0}
        trend={`${data?.reviewedToday ?? 0} reviewed today`}
        trendUp={(data?.reviewedToday ?? 0) > 0}
        isLoading={isLoading}
      />
    </div>
  );
}
