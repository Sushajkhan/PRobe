"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

import { useConnectGithub } from "@/hooks/useAuth";

export default function DashboardPage() {
  useConnectGithub();

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8  mx-auto w-full">
      <DashboardHeader />
    </div>
  );
}
