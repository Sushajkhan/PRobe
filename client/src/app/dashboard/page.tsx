"use client";

import { useConnectGithub } from "@/hooks/useAuth";
import { useOverview } from "@/hooks/useAnalytics";
import { useConnectedRepos } from "@/hooks/useRepos";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentReviewsList } from "@/components/dashboard/RecentReviewList";
import { ActiveRepos } from "@/components/dashboard/ActiveRepos";
import { FindingsBySeverity } from "@/components/dashboard/FindingsBySeverity";

export default function DashboardPage() {
  useConnectGithub();

  const { data: overview, isPending: overviewPending } = useOverview();
  const { data: repos, isPending: reposPending } = useConnectedRepos();

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8  mx-auto w-full">
      <DashboardHeader />

      <StatsCards data={overview} isLoading={overviewPending} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
        <RecentReviewsList
          reviews={overview?.recentReviews}
          isLoading={overviewPending}
        />

        <div className="flex flex-col gap-4">
          <ActiveRepos repos={repos} isLoading={reposPending} />
          <FindingsBySeverity data={overview} isLoading={overviewPending} />
        </div>
      </div>
    </div>
  );
}
