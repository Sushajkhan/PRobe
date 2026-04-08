"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Repository } from "@/types";

interface RepoFilterProps {
  repos: Repository[];
  selectedRepoId: string | null;
  onChange: (repoId: string | null) => void;
}

export function RepoFilter({
  repos,
  selectedRepoId,
  onChange,
}: RepoFilterProps) {
  return (
    <Select
      value={selectedRepoId ?? "all"}
      onValueChange={(v) => onChange(v === "all" ? null : v)}
    >
      <SelectTrigger className="h-8 text-xs w-45">
        <SelectValue placeholder="All Repositories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Repositories</SelectItem>
        {repos.map((repo) => (
          <SelectItem key={repo.id} value={repo.id}>
            {repo.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
