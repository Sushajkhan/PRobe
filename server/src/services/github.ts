import { getOctokitForRepo } from "../lib/octokit";
import logger from "../lib/logger";

export interface AIReview {
  summary: string;
  overallSeverity: "CRITICAL" | "WARNING" | "SUGGESTION" | "CLEAN";
  findings: Array<{
    category: string;
    severity: "CRITICAL" | "WARNING" | "SUGGESTION";
    filePath: string;
    lineNumber?: number;
    title: string;
    description: string;
    suggestion?: string;
  }>;
}

// fetch PR Diff
export async function fetchPRDiff(params: {
  owner: string;
  repo: string;
  prNumber: number;
  repoId: string;
}): Promise<string> {
  const octokit = await getOctokitForRepo(params.repoId);

  const { data: files } = await octokit.rest.pulls.listFiles({
    owner: params.owner,
    repo: params.repo,
    pull_number: params.prNumber,
    per_page: 100,
  });

  const fullDiff = files
    .filter((f) => f.patch)
    .map((f) => `--- a/${f.filename}\n+++ b/${f.filename}\n${f.patch}`)
    .join("\n\n");

  if (!fullDiff.trim()) throw new Error("PR has no text diff");

  logger.info(
    {
      repo: `${params.owner}/${params.repo}`,
      pr: params.prNumber,
      files: files.length,
      diffSize: fullDiff.length,
    },
    `Fetched diff`,
  );

  return fullDiff;
}
