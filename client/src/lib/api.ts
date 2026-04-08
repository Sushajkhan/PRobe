import type {
  FindingsResponse,
  GithubRepository,
  OverviewResponse,
  PRReview,
  RepoAnalyticsResponse,
  Repository,
  ReviewFinding,
  ReviewsResponse,
  UserProfile,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function apiRequest<T>(
  url: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  connectGithub: (token: string): Promise<UserProfile> =>
    apiRequest("/api/auth/connect-github", token, { method: "POST" }),

  getUser: (token: string): Promise<UserProfile> =>
    apiRequest("/api/auth/user", token),

  getGithubRepos: (token: string): Promise<GithubRepository[]> =>
    apiRequest("/api/repos", token),

  getConnectedRepos: (token: string): Promise<Repository[]> =>
    apiRequest("/api/repos/connected", token),

  connectRepo: (token: string, data: GithubRepository): Promise<Repository> =>
    apiRequest("/api/repos/connect", token, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  toggleRepo: (token: string, repoId: string): Promise<Repository> =>
    apiRequest(`/api/repos/${repoId}/toggle`, token, { method: "PATCH" }),

  disconnectRepo: (
    token: string,
    repoId: string,
  ): Promise<{ message: string }> =>
    apiRequest(`/api/repos/${repoId}`, token, { method: "DELETE" }),

  getRepoReviews: (
    token: string,
    repoId: string,
    params?: { page?: number; limit?: number },
  ): Promise<ReviewFinding> => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiRequest(`/api/repos/${repoId}/reviews${q ? `?${q}` : ""}`, token);
  },

  getReviews: (
    token: string,
    params?: {
      page?: number;
      limit?: number;
      status?: string;
      severity?: string;
      repositoryId?: string;
      search?: string;
    },
  ): Promise<ReviewsResponse> => {
    const q = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params ?? {}).filter(([, v]) => v !== undefined),
      ) as Record<string, string>,
    ).toString();
    return apiRequest(`/api/reviews${q ? `?${q}` : ""}`, token);
  },

  getReview: (token: string, reviewId: string): Promise<PRReview> =>
    apiRequest(`/api/reviews/${reviewId}`, token),

  deleteReview: (
    token: string,
    reviewId: string,
  ): Promise<{ message: string }> =>
    apiRequest(`/api/reviews/${reviewId}`, token, { method: "DELETE" }),

  submitFeedback: (
    token: string,
    reviewId: string,
    isHelpful: boolean,
  ): Promise<{ reviewId: string; isHelpful: boolean }> =>
    apiRequest(`/api/reviews/${reviewId}/feedback`, token, {
      method: "POST",
      body: JSON.stringify({ isHelpful }),
    }),

  getOverview: (token: string): Promise<OverviewResponse> =>
    apiRequest("/api/analytics/overview", token),

  getRepoAnalytics: (
    token: string,
    repoId?: string | null,
  ): Promise<RepoAnalyticsResponse> => {
    const params = new URLSearchParams();

    if (repoId) {
      params.set("repoId", repoId);
    }

    const query = params.toString();

    return apiRequest(`/api/analytics/repos${query ? `?${query}` : ""}`, token);
  },
  getTopFindings: (
    token: string,
    repoId?: string | null,
  ): Promise<FindingsResponse> => {
    const params = new URLSearchParams();

    if (repoId) {
      params.set("repoId", repoId);
    }

    const query = params.toString();

    return apiRequest(
      `/api/analytics/findings${query ? `?${query}` : ""}`,
      token,
    );
  },
};
