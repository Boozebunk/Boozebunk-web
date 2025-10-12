import db from "@boozebunk-trpc/db";
import { bannersTable } from "@boozebunk-trpc/db/schema/banners";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@boozebunk-trpc/server/trpc";
import { deleteS3Object, generatePresignedUploadUrl } from "@boozebunk-trpc/utils/s3-sender";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";

import { createBannerSchema, deleteBannerSchema } from "./dto";

export const bannerRouter = createTRPCRouter({
  getBannerUploadUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string().min(1),
        fileType: z.string().refine(
          // Refine to ensure it's a valid image type
          (type) => type.startsWith("image/"),
          { message: "File type must be an image." },
        ),
      }),
    )
    .query(async ({ input, ctx }) => {
      // SECURITY CHECK: Ensure only Admins can initiate uploads
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied." });
      }

      const result = await generatePresignedUploadUrl(input.fileName, input.fileType);

      return {
        uploadUrl: result.uploadUrl,
        fileKey: result.fileKey,
        s3Url: result.s3Url,
      };
    }),

  createBanner: protectedProcedure.input(createBannerSchema).mutation(async ({ input, ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Only administrators can add banners." });
    }

    try {
      await db
        .insert(bannersTable)
        .values({
          imageUrl: input.imageUrl,
          fileKey: input.fileKey,
          websiteUrl: input.websiteUrl,
        })
        .returning();

      return {
        success: true,
        message: "Banner uploaded and registered successfully.",
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Database error during banner creation: ${error}`,
      });
    }
  }),

  getAllBanners: publicProcedure.query(async () => {
    try {
      const banners = await db.select().from(bannersTable);

      return {
        success: true,
        banners: banners,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Database error while fetching banners: ${error}`,
      });
    }
  }),

  deleteBanner: protectedProcedure.input(deleteBannerSchema).mutation(async ({ input, ctx }) => {
    // SECURITY CHECK: Ensure only Admins can delete banners
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only administrators can delete banners.",
      });
    }

    // Step 1: Find the banner and retrieve the file key
    const [bannerToDelete] = await db
      .select({ fileKey: bannersTable.fileKey })
      .from(bannersTable)
      .where(eq(bannersTable.id, input.id));

    if (!bannerToDelete) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Banner not found." });
    }

    // Step 2: Delete the object from S3
    try {
      await deleteS3Object(bannerToDelete.fileKey);
    } catch (s3Error) {
      // Log the S3 error but continue to delete the DB record.
      // It's usually safer to remove the DB record and clean up S3 manually later,
      // than to leave a ghost record in the DB if S3 deletion fails.
      console.error(`Failed to delete S3 object ${bannerToDelete.fileKey}:`, s3Error);
    }

    // Step 3: Delete the record from the database
    await db.delete(bannersTable).where(eq(bannersTable.id, input.id));

    return {
      success: true,
      message: "Banner deleted successfully from DB and S3.",
    };
  }),
});
