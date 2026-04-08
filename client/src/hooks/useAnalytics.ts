"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";

export function useOverview() {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return api.getOverview(token);
    },
    enabled: !!isSignedIn,
    staleTime: 2 * 60 * 1000,
  });
}

export function useRepoAnalytics(repoId: string | null) {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["analytics", "repo", repoId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return api.getRepoAnalytics(token, repoId!);
    },
    enabled: !!isSignedIn,
    staleTime: 2 * 60 * 1000,
  });
}

export function useTopFindings(repoId?: string | null) {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["analytics", "findings", repoId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return api.getTopFindings(token, repoId);
    },
    enabled: !!isSignedIn,
    staleTime: 2 * 60 * 1000,
  });
}
