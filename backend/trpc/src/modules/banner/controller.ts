import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";

import db from "@boozebunk-trpc/db";
import { bannersTable } from "@boozebunk-trpc/db/schema/banners";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@boozebunk-trpc/server/trpc";
import { deleteS3Object, generatePresignedUploadUrl } from "@boozebunk-trpc/utils/s3-sender";

import { createBannerSchema, deleteBannerSchema } from "./dto";

export const bannerRouter = createTRPCRouter({
  getBannerUploadUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string().min(1),
        fileType: z
          .string()
          .refine((type) => type.startsWith("image/"), { message: "File type must be an image." }),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied." });
        }

        const result = await generatePresignedUploadUrl(input.fileName, input.fileType);

        return {
          uploadUrl: result.uploadUrl,
          fileKey: result.fileKey,
          s3Url: result.s3Url,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to generate upload URL. ${error}`,
          cause: error,
        });
      }
    }),

  createBanner: protectedProcedure.input(createBannerSchema).mutation(async ({ input, ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Only Admin can add banners." });
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
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Creating Banner Failed. ${error}`,
        cause: error,
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
        message: `Fetching Banners Failed. ${error}`,
        cause: error,
      });
    }
  }),

  deleteBanner: protectedProcedure.input(deleteBannerSchema).mutation(async ({ input, ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only Admin can delete banners.",
      });
    }

    try {
      // Find the banner and retrieve the file key
      const [bannerToDelete] = await db
        .select({ fileKey: bannersTable.fileKey })
        .from(bannersTable)
        .where(eq(bannersTable.id, input.id));

      if (!bannerToDelete) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Banner not found." });
      }

      // Delete the object from S3
      try {
        await deleteS3Object(bannerToDelete.fileKey);
      } catch (s3Error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete banner image from S3. ${s3Error}`,
          cause: s3Error,
        });
      }

      // Step 3: Delete the record from the database
      await db.delete(bannersTable).where(eq(bannersTable.id, input.id));

      return {
        success: true,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Error deleting banner. ${error}`,
        cause: error,
      });
    }
  }),
});
