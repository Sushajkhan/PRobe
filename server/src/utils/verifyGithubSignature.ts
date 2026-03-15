import crypto from "crypto";

export function verifyGitHubSignature(
  payload: Buffer,
  signature: string | undefined,
): boolean {
  if (!signature) return false;
  if (!process.env.GITHUB_WEBHOOK_SECRET) {
    throw new Error("GITHUB_WEBHOOK_SECRET is not set in .env");
  }

  const expected = `sha256=${crypto
    .createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex")}`;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature),
    );
  } catch {
    return false;
  }
}
