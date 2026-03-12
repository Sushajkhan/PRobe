import { S3Client } from "@aws-sdk/client-s3";

function getS3Client(): S3Client {
  if (!process.env.AWS_REGION) throw new Error("AWS_REGION is not found");
  if (!process.env.AWS_ACCESS_KEY_ID)
    throw new Error("AWS_ACCESS_KEY_ID is not found");
  if (!process.env.AWS_SECRET_ACCESS_KEY)
    throw new Error("AWS_SECRET_ACCESS_KEY is not found");

  return new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

function getBucket(): string {
  if (!process.env.S3_BUCKET_NAME)
    throw new Error("S3_BUCKET_NAME is not found");
  return process.env.S3_BUCKET_NAME;
}

function buildS3Key(
  repoId: string,
  prNumber: number,
  reviewId: string,
): string {
  return `diffs/${repoId}/${prNumber}/${reviewId}.diff`;
}
