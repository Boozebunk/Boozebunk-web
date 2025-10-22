import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

import { env } from "@boozebunk-trpc/env";

const BUCKET_NAME = "bb-vendor-stock-images";
const FILE_EXPIRY_SECONDS = 3600;

const s3Client = new S3Client({
  region: env.AWS_REGION!,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * Generates a secure, temporary Presigned URL for direct file upload to S3.
 */
export async function generatePresignedUploadUrl(fileName: string, fileType: string) {
  const fileExtension = fileName.split(".").pop();
  const fileKey = `banners/${uuidv4()}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: FILE_EXPIRY_SECONDS });

  const s3Url = `https://${BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${fileKey}`;

  return {
    uploadUrl,
    fileKey: fileKey,
    s3Url: s3Url,
    ACL: "public-read",
  };
}

/**
 * Deletes an object from S3 using its file key (path).
 * Used in the deleteBanner mutation.
 */
export async function deleteS3Object(fileKey: string) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });
  await s3Client.send(command);
  return true;
}
