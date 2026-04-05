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
// Post PR Comment
export async function postPRComment(params: {
  owner: string;
  repo: string;
  prNumber: number;
  repoId: string;
  review: AIReview;
}): Promise<number> {
  const octokit = await getOctokitForRepo(params.repoId);
  const { review } = params;

  const severityEmoji: Record<string, string> = {
    CRITICAL: "🔴",
    WARNING: "🟡",
    SUGGESTION: "💡",
    CLEAN: "🟢",
  };

  const criticals = review.findings.filter((f) => f.severity === "CRITICAL");
  const warnings = review.findings.filter((f) => f.severity === "WARNING");
  const suggestions = review.findings.filter(
    (f) => f.severity === "SUGGESTION",
  );

  const formatFinding = (f: AIReview["findings"][0]): string => {
    const emoji = severityEmoji[f.severity] ?? "⚪";
    const loc = f.lineNumber ? `${f.filePath}:${f.lineNumber}` : f.filePath;

    let block = `> **${emoji} ${f.severity}**  \`${f.category}\`  ·  \`${loc}\`\n> ${f.description}`;
    if (f.suggestion) {
      block += `\n>\n> 💡 **Fix:** \`${f.suggestion}\``;
    }
    return block;
  };

  const overallEmoji = severityEmoji[review.overallSeverity] ?? "⚪";

  let body = [
    `## 🔍 PRobe — Automated Code Review`,
    ``,
    `**Overall:** ${overallEmoji} **${review.overallSeverity}**  ·  ${review.findings.length} issue(s)`,
    ``,
    `---`,
    ``,
    `### 📋 Summary`,
    review.summary,
  ].join("\n");

  if (criticals.length) {
    body += `\n\n### 🔴 Critical (${criticals.length})\n${criticals.map(formatFinding).join("\n\n")}`;
  }
  if (warnings.length) {
    body += `\n\n### 🟡 Warnings (${warnings.length})\n${warnings.map(formatFinding).join("\n\n")}`;
  }
  if (suggestions.length) {
    body += `\n\n### 💡 Suggestions (${suggestions.length})\n${suggestions.map(formatFinding).join("\n\n")}`;
  }
  if (!review.findings.length) {
    body += `\n\n### 🟢 No Issues Found\nThis PR looks clean!`;
  }

  body += `\n\n---\n*Reviewed by [PRobe](${process.env.FRONTEND_URL}) · Powered by Gemini*`;
  const { data } = await octokit.rest.issues.createComment({
    owner: params.owner,
    repo: params.repo,
    issue_number: params.prNumber,
    body,
  });

  logger.info(
    {
      repo: `${params.owner}/${params.repo}`,
      pr: params.prNumber,
      commentId: data.id,
    },
    `Posted PR comment`,
  );

  return data.id;
}

// Install Webhook
export async function installWebhook(params: {
  owner: string;
  repo: string;
  repoId: string;
}): Promise<number> {
  const octokit = await getOctokitForRepo(params.repoId);
  const webhookUrl = `${process.env.BACKEND_URL}/api/webhook/github`;

  try {
    const { data } = await octokit.rest.repos.createWebhook({
      owner: params.owner,
      repo: params.repo,
      config: {
        url: webhookUrl,
        content_type: "json",
        secret: process.env.GITHUB_WEBHOOK_SECRET!,
        insecure_ssl: "0",
      },
      events: ["pull_request"],
      active: true,
    });

    logger.info(
      { repo: `${params.owner}/${params.repo}`, webhookId: data.id },
      "Installed webhook",
    );

    return data.id;
  } catch (err: any) {
    if (err.status === 422) {
      const { data: hooks } = await octokit.rest.repos.listWebhooks({
        owner: params.owner,
        repo: params.repo,
      });

      const existing = hooks.find((h) => h.config?.url === webhookUrl);

      if (existing) {
        logger.info(
          { repo: `${params.owner}/${params.repo}`, webhookId: existing.id },
          "Webhook already exists — reusing existing",
        );
        return existing.id;
      }
    }

    throw err;
  }
}
// Remove Webhook
export async function removeWebhook(params: {
  owner: string;
  repo: string;
  repoId: string;
  webhookId: number;
}): Promise<void> {
  const octokit = await getOctokitForRepo(params.repoId);

  await octokit.rest.repos.deleteWebhook({
    owner: params.owner,
    repo: params.repo,
    hook_id: params.webhookId,
  });

  logger.info(
    {
      repo: `${params.owner}/${params.repo}`,
      webhookId: params.webhookId,
    },
    `Removed webhook`,
  );
}
