"use client";

import Link from "next/link";
import { GitBranch, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Repository } from "@/types";
import { Button } from "../ui/button";

const repoBgColors = [
  "bg-orange-500/20 text-orange-400",
  "bg-blue-500/20 text-blue-400",
  "bg-cyan-500/20 text-cyan-400",
  "bg-purple-500/20 text-purple-400",
  "bg-emerald-500/20 text-emerald-400",
  "bg-pink-500/20 text-pink-400",
];

function RepoRow({ repo, index }: { repo: Repository; index: number }) {
  const colorClass = repoBgColors[index % repoBgColors.length];
  const initials = repo.name.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
      <div
        className={cn(
          "h-8 w-8 rounded-md flex items-center justify-center text-xs font-bold shrink-0",
          colorClass,
        )}
      >
        {initials}
      </div>

      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-sm font-medium text-foreground truncate font-mono">
          {repo.fullName}
        </span>
        <span className="text-xs text-muted-foreground">Active</span>
      </div>

      <span
        className={cn(
          "h-2 w-2 rounded-full shrink-0",
          repo.isActive ? "bg-emerald-500" : "bg-muted-foreground/30",
        )}
      />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
      <Skeleton className="h-8 w-8 rounded-md shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

interface ActiveReposProps {
  repos: Repository[] | undefined;
  isLoading: boolean;
}

export function ActiveRepos({ repos, isLoading }: ActiveReposProps) {
  const active = (repos ?? []).filter((r) => r.isActive);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Active Repositories
        </h2>
        <Link
          href="/settings"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
      ) : active.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2 text-center px-4">
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center px-4">
            <GitBranch className="h-6 w-6 text-muted-foreground/40" />

            <p className="text-sm text-muted-foreground">
              No repositories connected
            </p>

            <p className="text-xs text-muted-foreground/60">
              Connect a repository to start analyzing pull requests.
            </p>
          </div>{" "}
          <Button asChild size="sm" variant="outline" className="mt-2 gap-2">
            <Link href="/settings">Connect repository</Link>
          </Button>
        </div>
      ) : (
        active.map((repo, i) => <RepoRow key={repo.id} repo={repo} index={i} />)
      )}
    </div>
  );
}
