"use client";

import { useState } from "react";
import { Trash2, Circle, Plus, Loader2, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConnectRepoDialog } from "./ConnectRepoDialog";
import { formatDistanceToNow } from "date-fns";
import type { Repository } from "@/types";
import {
  useConnectedRepos,
  useDisconnectRepo,
  useToggleRepo,
} from "@/hooks/useRepos";

function RepoRow({ repo }: { repo: Repository }) {
  const { mutate: disconnectRepo, isPending } = useDisconnectRepo();
  const { mutate: toggleRepo, isPending: isToggling } = useToggleRepo();

  function handleToggle() {
    toggleRepo(repo.id);
  }

  return (
    <div className="flex items-center justify-between px-4 py-3.5 border-b border-border last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <GitBranch className="h-4 w-4 text-muted-foreground shrink-0" />

        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-medium text-foreground font-mono truncate">
            {repo.fullName}
          </span>

          <span className="text-xs text-muted-foreground">
            Connected{" "}
            {formatDistanceToNow(new Date(repo.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggle}
          disabled={isPending || isToggling}
          className="h-7 px-2 gap-1.5 border-muted hover:bg-muted/50"
        >
          {isToggling ? (
            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
          ) : (
            <Circle
              className={cn(
                "h-1.5 w-1.5 fill-current",
                repo.isActive ? "text-emerald-500" : "text-muted-foreground/40",
              )}
            />
          )}

          <span
            className={cn(
              "text-xs",
              repo.isActive ? "text-emerald-500" : "text-muted-foreground",
            )}
          >
            {repo.isActive ? "Active" : "Inactive"}
          </span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10 hover:border hover:border-red-200"
          disabled={isToggling || isPending}
          onClick={() => disconnectRepo(repo.id)}
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border last:border-0">
      <div className="h-4 w-4 rounded bg-muted animate-pulse shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="h-3.5 w-48 rounded bg-muted animate-pulse" />
        <div className="h-3 w-28 rounded bg-muted animate-pulse" />
      </div>
    </div>
  );
}

export function ConnectedReposList() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: repos, isLoading } = useConnectedRepos();

  const alreadyConnected = (repos ?? []).map((r: Repository) => r.fullName);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Connected Repositories
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            PRobe will review pull requests from these repositories.
          </p>
        </div>

        <Button
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          Connect repo
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {isLoading || !repos ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : repos.length > 0 ? (
          repos.map((repo: Repository) => <RepoRow key={repo.id} repo={repo} />)
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center px-4">
            <GitBranch className="h-7 w-7 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No repositories connected yet
            </p>
            <p className="text-xs text-muted-foreground/60">
              Click &quot;Connect repo&quot; to get started.
            </p>
          </div>
        )}
      </div>

      <ConnectRepoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        alreadyConnected={alreadyConnected}
      />
    </div>
  );
}
