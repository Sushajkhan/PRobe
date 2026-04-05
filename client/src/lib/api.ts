import type { GithubRepository, Repository, UserProfile } from "@/types";

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
};
