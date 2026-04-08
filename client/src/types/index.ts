export type Severity = "CRITICAL" | "WARNING" | "SUGGESTION" | "CLEAN";

export type ReviewStatus = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";

export type FindingCategory =
  | "Security"
  | "Performance"
  | "Bug Risk"
  | "Code Quality"
  | "Maintainability"
  | "Best Practice";

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
  userFeedback: boolean | null;
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

export interface GithubRepository {
  githubRepoId: string;
  name: string;
  fullName: string;
  owner: string;
  defaultBranch: string;
  private: boolean;
  description: string | null;
  url: string;
  isConnected: boolean;
}

export interface ConnectRepoResponse extends Repository {
  webhookFailed?: boolean;
  message?: string;
}

export interface ReviewsResponse {
  reviews: PRReview[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AnalyticsTrendItem {
  id: string;
  prNumber: number;
  title: string;
  overallSeverity: Severity;
  totalIssues: number;
  createdAt: string;
}

export interface TopProblematicFile {
  filePath: string;
  findingCount: number;
}

export interface RepoAnalyticsResponse {
  repo: {
    id: string;
    name: string;
    fullName: string;
  } | null;
  totalReviews: number;
  totalFindings: number;
  severityCounts: Record<Severity, number>;
  categoryCounts: Record<string, number>;
  trend: AnalyticsTrendItem[];
  topProblematicFiles: TopProblematicFile[];
}

export interface FindingSummary {
  title: string;
  category: string;
  severity: Severity;
  occurrences: number;
}

export interface FindingsResponse {
  findings: FindingSummary[];
}

export interface OverviewResponse {
  totalRepos: number;
  totalReviews: number;
  totalFindings: number;
  severityCounts: Partial<Record<Severity, number>>;
  categoryCounts: Partial<Record<FindingCategory, number>>;
  statusCounts: Record<ReviewStatus, number>;
  recentReviews: OverviewRecentReview[];
  reviewsThisWeek: number;
  criticalThisWeek: number;
  findingsThisWeek: number;
  reviewedToday: number;
}

export interface OverviewRecentReview {
  id: string;
  prNumber: number;
  title: string;
  status: ReviewStatus;
  overallSeverity: Severity;
  totalIssues: number;
  createdAt: string;
  repository: {
    name: string;
    fullName: string;
  };
}
