"use client";

import { useState } from "react";
import { useRepoAnalytics, useTopFindings } from "@/hooks/useAnalytics";
import { useConnectedRepos } from "@/hooks/useRepos";
import { StatsCards } from "@/components/analytics/StatsCards";
import { SeverityDistribution } from "@/components/analytics/SeverityDistribution";
import { SeverityTrend } from "@/components/analytics/SeverityTrend";
import { TopRecurringIssues } from "@/components/analytics/TopRecurringIssues";
import { RepoFilter } from "@/components/analytics/RepoFilter";
import { TopProblematicFiles } from "@/components/analytics/TopProblematicFiles";
import { FindingsByCategory } from "@/components/analytics/FindingsByCategory";

export default function AnalyticsPage() {
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);

  const { data: repos } = useConnectedRepos();

  const { data, isPending } = useRepoAnalytics(selectedRepoId);

  const { data: topFindings, isPending: findingsPending } = useTopFindings();

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 mx-auto w-full">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Analytics
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Insights across your AI-powered code reviews.
            </p>
          </div>

          <RepoFilter
            repos={repos ?? []}
            selectedRepoId={selectedRepoId}
            onChange={setSelectedRepoId}
          />
        </div>
        <div className="h-px bg-border mt-4" />
      </div>

      <StatsCards data={data} isLoading={isPending} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        <FindingsByCategory data={data?.categoryCounts} isLoading={isPending} />
        <SeverityDistribution
          data={data?.severityCounts}
          isLoading={isPending}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SeverityTrend data={data?.trend} isLoading={isPending} />
        <TopProblematicFiles
          data={data?.topProblematicFiles}
          isLoading={isPending}
        />
      </div>

      <TopRecurringIssues data={topFindings} isLoading={findingsPending} />
    </div>
  );
}
