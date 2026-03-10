import { GoogleGenAI } from "@google/genai";
import logger from "../lib/logger";
import { AIReview } from "./github";

export type FindingCategory =
  | "Security"
  | "Performance"
  | "Bug Risk"
  | "Code Quality"
  | "Maintainability"
  | "Best Practice";

export type FindingSeverity = "CRITICAL" | "WARNING" | "SUGGESTION";

export type OverallSeverity = "CRITICAL" | "WARNING" | "SUGGESTION" | "CLEAN";

export interface AIReviewFinding {
  category: FindingCategory;
  severity: FindingSeverity;
  filePath: string;
  lineNumber?: number;
  title: string;
  description: string;
  suggestion?: string | null;
}

export interface ReviewParams {
  prTitle: string;
  prAuthor: string;
  repoName: string;
  baseBranch: string;
  headBranch: string;
  diff: string;
}

//prompt

const SYSTEM_PROMPT = `
You are a principal software engineer with 15+ years of experience leading engineering teams at high-growth startups.

You perform strict, high-signal code reviews focused on correctness, security, performance, and maintainability.

You are reviewing a GitHub Pull Request diff.

The input is a unified git diff showing file changes. Focus primarily on newly added or modified code.

Ignore:
- formatting changes
- import reordering
- trivial style issues unless they affect maintainability
- generated code
- test snapshots

Your goal is to identify meaningful engineering issues such as:
- bugs
- security risks
- performance issues
- race conditions
- error handling problems
- maintainability problems
- architectural concerns

Return a JSON object with the following structure:

{
  "summary": "Short paragraph summarizing the PR quality and major concerns.",
  "overallSeverity": "CRITICAL | WARNING | SUGGESTION | CLEAN",
  "findings": [
    {
      "category": "Security | Performance | Bug Risk | Code Quality | Maintainability | Best Practice",
      "severity": "CRITICAL | WARNING | SUGGESTION",
      "filePath": "path/to/file.ts",
      "lineNumber": 42,
      "title": "Short title of the issue",
      "description": "Clear explanation of the issue and why it matters.",
      "suggestion": "Concrete code-level fix if applicable. null if not applicable."
    }
  ]
}

Severity guidelines:

CRITICAL
- security vulnerabilities
- data corruption
- crashes
- race conditions
- unsafe error handling

WARNING
- likely bugs
- major maintainability problems
- inefficient algorithms

SUGGESTION
- minor improvements
- readability improvements
- best practices

Rules:
- Return ONLY the JSON. No markdown. No backticks. No extra text.
- overallSeverity is the highest severity among all findings. CLEAN if findings is empty.
- Only report real issues. Maximum 15 findings.
- lineNumber refers to the line number in the +++ (new file) side of the diff only.
- If the issue spans multiple lines, use the first affected line.
- Omit lineNumber if the issue is file-level or architectural.
- If the diff is clean with no issues return findings as an empty array.
`.trim();

function buildUserMessage(params: ReviewParams): string {
  const MAX_CHARS = 80_000;
  const diff =
    params.diff.length > MAX_CHARS
      ? params.diff.substring(0, MAX_CHARS) + "\n\n[DIFF TRUNCATED — too large]"
      : params.diff;

  return `Repository: ${params.repoName}
PR Title:   ${params.prTitle}
Author:     ${params.prAuthor}
Merging:    ${params.headBranch} → ${params.baseBranch}

Code diff:
${diff}`;
}

function parseResponse(raw: string): AIReview {
  const clean = raw.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);

  if (
    !parsed.summary ||
    !parsed.overallSeverity ||
    !Array.isArray(parsed.findings)
  ) {
    throw new Error(
      "AI response missing required fields: summary, overallSeverity, or findings",
    );
  }

  return parsed as AIReview;
}

export async function generateCodeReview(
  params: ReviewParams,
): Promise<AIReview> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in .env");
  }

  const model = process.env.GEMINI_MODEL || "gemini-3-flash-preview";
  logger.info(
    { model, repo: params.repoName, pr: params.prTitle },
    "Generating code review",
  );

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const response = await ai.models.generateContent({
    model,
    contents: buildUserMessage(params),
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.1,
      maxOutputTokens: 4000,
      responseMimeType: "application/json",
    },
  });

  const text = response.text;
  if (!text) throw new Error("Gemini returned an empty response");

  const review = parseResponse(text);

  logger.info(
    {
      overallSeverity: review.overallSeverity,
      findingCount: review.findings.length,
    },
    "Code review complete",
  );

  return review;
}
