import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import logger from "../lib/logger";

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

export async function uploadDiffToS3(
  repoId: string,
  prNumber: number,
  reviewId: string,
  diff: string,
): Promise<string> {
  const s3 = getS3Client();
  const bucket = getBucket();
  const key = buildS3Key(repoId, prNumber, reviewId);

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: diff,
      ContentType: "text/plain",
      Metadata: {
        repoId,
        prNumber: String(prNumber),
        reviewId,
      },
    }),
  );

  logger.info(
    { bucket, key, sizeBytes: Buffer.byteLength(diff) },
    "Diff uploaded to S3",
  );

  return key;
}

export async function getDiffSignedUrl(
  s3Key: string,
  expiresIn: number = 3600,
): Promise<string> {
  const s3 = getS3Client();
  const bucket = getBucket();

  const command = new GetObjectCommand({ Bucket: bucket, Key: s3Key });
  const url = await getSignedUrl(s3, command, { expiresIn });

  logger.info({ key: s3Key, expiresIn }, "Generated signed URL for diff");

  return url;
}

export async function deleteDiffFromS3(s3Key: string): Promise<void> {
  const s3 = getS3Client();
  const bucket = getBucket();

  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: s3Key }));

  logger.info({ key: s3Key }, "Diff deleted from S3");
}
