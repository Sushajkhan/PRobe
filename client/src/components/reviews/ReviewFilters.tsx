"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Repository } from "@/types";

export interface ReviewFilters {
  search: string;
  status: string;
  severity: string;
  repositoryId: string;
}

interface ReviewFiltersProps {
  filters: ReviewFilters;
  repos: Repository[];
  onChange: (filters: ReviewFilters) => void;
}

export function ReviewFilters({
  filters,
  repos,
  onChange,
}: ReviewFiltersProps) {
  function set(key: keyof ReviewFilters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search reviews..."
          className="pl-8 h-9 text-sm"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
        />
      </div>

      <Select
        value={filters.repositoryId}
        onValueChange={(v) => set("repositoryId", v)}
      >
        <SelectTrigger className="h-9 text-sm w-full sm:w-40 ">
          <SelectValue placeholder="All Repos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Repos</SelectItem>
          {repos.map((repo) => (
            <SelectItem key={repo.id} value={repo.id}>
              {repo.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={(v) => set("status", v)}>
        <SelectTrigger className="h-9 text-sm w-full sm:w-37.5">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="QUEUED">Queued</SelectItem>
          <SelectItem value="PROCESSING">Processing</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
          <SelectItem value="FAILED">Failed</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.severity}
        onValueChange={(v) => set("severity", v)}
      >
        <SelectTrigger className="h-9 text-sm w-full sm:w-40">
          <SelectValue placeholder="All Severities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Severities</SelectItem>
          <SelectItem value="CRITICAL">Critical</SelectItem>
          <SelectItem value="WARNING">Warning</SelectItem>
          <SelectItem value="SUGGESTION">Suggestion</SelectItem>
          <SelectItem value="CLEAN">Clean</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
