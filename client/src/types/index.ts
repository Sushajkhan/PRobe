export type Severity = "CRITICAL" | "WARNING" | "SUGGESTION" | "CLEAN";

export type ReviewStatus = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface UserProfile {
  id: string;
  clerkId: string;
  githubId: string;
  githubUserName: string;
  email: string;
  avatarUrl: string | null;
  githubToken: string | null;
  createdAt: string;
  updatedAt: string;
  repositories: Repository[];
}

export interface Repository {
  id: string;
  userId: string;
  githubRepoId: string;
  name: string;
  fullName: string;
  owner: string;
  defaultBranch: string;
  isActive: boolean;
  webhookId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PRReview {
  id: string;
  repositoryId: string;
  prNumber: number;
  title: string;
  author: string;
  url: string;
  baseBranch: string;
  headBranch: string;
  diffs3Key: string | null;
  summary: string | null;
  overallSeverity: Severity;
  status: ReviewStatus;
  processingTime: number | null;
  githubCommentId: number | null;
  totalIssues: number;
  createdAt: string;
  updatedAt: string;
  repository: Repository;
  findings: ReviewFinding[];
}

export interface ReviewFinding {
  id: string;
  reviewId: string;
  category: string;
  severity: Severity;
  filePath: string;
  lineNumber: number | null;
  title: string;
  description: string;
  suggestion: string | null;
  createdAt: string;
}

export interface ReviewFeedback {
  id: string;
  reviewId: string;
  userId: string;
  isHelpful: boolean;
  createdAt: string;
}

export interface AnalyticsSummary {
  totalReviews: number;
  issuesByCategory: Record<string, number>;
  issuesBySeverity: Record<Severity, number>;
  reviewsOverTime: ReviewsOverTimePoint[];
}

export interface ReviewsOverTimePoint {
  date: string;
  count: number;
}

export interface ApiError {
  error: string;
}
