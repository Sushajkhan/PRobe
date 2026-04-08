"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";
import { ConnectRepoResponse, GithubRepository, Repository } from "@/types";
import { toast } from "sonner";

export function useConnectedRepos() {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["repos", "connected"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return api.getConnectedRepos(token);
    },
    enabled: !!isSignedIn,
  });
}

export function useGithubRepos() {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["repos", "github"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return api.getGithubRepos(token);
    },
    enabled: !!isSignedIn,
    staleTime: 5 * 60 * 1000,
  });
}

export function useConnectRepo() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (repo: GithubRepository) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      const result = await api.connectRepo(token, repo);
      return { result, repoName: repo.name };
    },
    onSuccess: ({
      result,
      repoName,
    }: {
      result: ConnectRepoResponse;
      repoName: string;
    }) => {
      queryClient.invalidateQueries({ queryKey: ["repos", "connected"] });
      queryClient.invalidateQueries({
        queryKey: ["analytics", "overview"],
      });

      if (result?.webhookFailed) {
        toast.warning(`Added ${repoName}, but activation failed`, {
          description: "You can retry from the toggle button",
        });
      } else {
        toast.success(`Connected ${repoName}`);
      }
    },
    onError: (err: Error) => {
      toast.error("Failed to connect repository", {
        description: err.message,
      });
    },
  });
}
export function useToggleRepo() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (repoId: string) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return api.toggleRepo(token, repoId);
    },
    onSuccess: (data: Repository) => {
      queryClient.invalidateQueries({ queryKey: ["repos", "connected"] });
      if (data.isActive) {
        toast.success(`${data.name} activated`, {
          description: "PRobe will resume reviewing pull requests.",
        });
      } else {
        toast.info(`${data.name} paused`, {
          description:
            "PRobe will not review new pull requests until reactivated.",
        });
      }
    },
    onError: (err: Error) => {
      toast.error("Failed to update repository", {
        description: err.message,
      });
    },
  });
}

export function useDisconnectRepo() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (repoId: string) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return api.disconnectRepo(token, repoId);
    },
    onSuccess: (_, repoId) => {
      queryClient.invalidateQueries({ queryKey: ["repos", "connected"] });
      queryClient.invalidateQueries({
        queryKey: ["analytics", "overview"],
      });
      queryClient.invalidateQueries({
        queryKey: ["analytics", "repo", repoId],
      });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Repository disconnected", {
        description: "No more reviews for this repository.",
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to disconnect repository", {
        description: err.message,
      });
    },
  });
}

export function useRepoReviews(
  repoId: string,
  params?: { page?: number; limit?: number },
) {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["repos", repoId, "reviews", params],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return api.getRepoReviews(token, repoId, params);
    },
    enabled: !!isSignedIn && !!repoId,
  });
}
