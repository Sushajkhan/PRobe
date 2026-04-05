"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";

export function useReviews(params?: {
  page?: number;
  limit?: number;
  status?: string;
  severity?: string;
  search?: string;
  repositoryId?: string;
}) {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["reviews", params],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return api.getReviews(token, params);
    },
    enabled: !!isSignedIn,
  });
}

export function useReview(reviewId: string) {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["reviews", reviewId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return api.getReview(token, reviewId);
    },
    enabled: !!isSignedIn && !!reviewId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "PROCESSING" || status === "QUEUED" ? 5000 : false;
    },
  });
}

export function useDeleteReview() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return api.deleteReview(token, reviewId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useFeedback(reviewId: string) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isHelpful: boolean) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return api.submitFeedback(token, reviewId, isHelpful);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", reviewId] });
    },
  });
}
