"use client";

import { useUser } from "@clerk/nextjs";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";

export function DashboardHeader() {
  const { user } = useUser();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {greeting()},{" "}
            <span className="text-muted-foreground">
              {user?.username ?? user?.firstName ?? "there"}
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here&apos;s what&apos;s happening with your pull requests.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground border border-border rounded-md px-3 py-1.5">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>{format(new Date(), "EEEE, MMM d")}</span>
        </div>
      </div>

      <div className="h-px bg-border mt-4" />
    </div>
  );
}
