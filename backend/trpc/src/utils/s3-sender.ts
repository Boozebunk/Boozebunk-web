import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@boozebunk-trpc/env";
import { v4 as uuidv4 } from "uuid";

const BUCKET_NAME = "bb-vendor-stock-images";
const FILE_EXPIRY_SECONDS = 3600; // 1 hour for the upload link to remain valid

// 1. AWS Client Setup - Reuses existing .env credentials
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
  // Create a unique key for the file to prevent overwrites, placed in a 'banners/' folder
  const fileKey = `banners/${uuidv4()}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey, // The final path/name of the file in S3
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: FILE_EXPIRY_SECONDS });

  // Construct the final URL that you will save to the database
  const s3Url = `https://${BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${fileKey}`;

  return {
    uploadUrl,
    fileKey: fileKey, // This unique key is essential for DB storage and future DELETION
    s3Url: s3Url,
    // This tells S3 to make the uploaded object readable by the public
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
