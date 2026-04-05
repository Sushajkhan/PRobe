"use client";

import { useState } from "react";
import { Search, Lock, Globe, Loader2, GitBranch } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GithubRepository } from "@/types";
import { useConnectRepo, useGithubRepos } from "@/hooks/useRepos";
import { cn } from "@/lib/utils";

interface ConnectRepoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alreadyConnected: string[];
}

export function ConnectRepoDialog({
  open,
  onOpenChange,
  alreadyConnected,
}: ConnectRepoDialogProps) {
  const [search, setSearch] = useState("");
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const { data: repos, isLoading } = useGithubRepos();
  const { mutate: connectRepo } = useConnectRepo();

  const filtered = (repos ?? []).filter((repo: GithubRepository) =>
    repo.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  function handleConnect(repo: GithubRepository) {
    setConnectingId(repo.githubRepoId);
    connectRepo(repo, {
      onSuccess: () => {
        setConnectingId(null);
        onOpenChange(false);
      },
      onError: () => {
        setConnectingId(null);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-4 border-b border-border">
          <DialogTitle className="text-base font-semibold">
            Connect a repository
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Enable AI code reviews for your GitHub repositories.
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 py-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search repositories..."
              className="pl-9 h-9 text-sm bg-muted/40 border-muted focus-visible:ring-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {isLoading || !repos ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Fetching repositories...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-center px-4">
              <GitBranch className="h-6 w-6 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No repositories found
              </p>
              <p className="text-xs text-muted-foreground/60">
                Try adjusting your search query
              </p>
            </div>
          ) : (
            filtered.map((repo: GithubRepository) => {
              const isConnected = alreadyConnected.includes(repo.fullName);
              const isConnecting = connectingId === repo.githubRepoId;

              return (
                <div
                  key={repo.githubRepoId}
                  className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {repo.private ? (
                      <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    ) : (
                      <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-foreground truncate font-mono">
                        {repo.name}
                      </span>
                      {repo.description && (
                        <span className="text-xs text-muted-foreground truncate">
                          {repo.description}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={isConnected ? "outline" : "default"}
                    className={cn(
                      "h-7 text-xs px-3 shrink-0 min-w-23 justify-center",
                      isConnected && "text-muted-foreground",
                    )}
                    disabled={isConnected || isConnecting}
                    onClick={() => handleConnect(repo)}
                  >
                    {isConnecting ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : isConnected ? (
                      "Connected"
                    ) : (
                      "Connect"
                    )}
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
