import db from "@boozebunk-trpc/db";
import { vendorStockTable } from "@boozebunk-trpc/db/schema/stock";
import { vendorTable } from "@boozebunk-trpc/db/schema/vendor";
import { createTRPCRouter, protectedProcedure } from "@boozebunk-trpc/server/trpc";
import { getImageUrlAndCache } from "@boozebunk-trpc/utils/imageService";
import { TRPCError } from "@trpc/server";
import { and, eq, inArray, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import z from "zod";

import {
  bulkUploadStockSchema,
  gettingVendorStockSchema,
  stockEditSchema,
  vendorAddStockSchema,
} from "./dto";

export const vendorStockRouter = createTRPCRouter({
  addStock: protectedProcedure.input(vendorAddStockSchema).mutation(async ({ ctx, input }) => {
    try {
      const vendor = await db.query.vendor.findFirst({
        where: eq(vendorTable.userId, ctx.user.id as string),
        columns: {
          id: true,
          isActive: true,
        },
      });

      if (!vendor) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Vendor Account Does not exists",
        });
      }

      if (!vendor?.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Account is froozen.",
        });
      }

      const randomUUID = uuidv4();

      const imagePromise = getImageUrlAndCache(input.brand, input.productName);

      const finalImageUrl = (await Promise.race([
        imagePromise,
        new Promise((resolve) => setTimeout(() => resolve(undefined), 100)),
      ])) as string | undefined;

      await db
        .insert(vendorStockTable)
        .values({
          id: randomUUID,
          vendorId: vendor.id,
          productName: input.productName,
          brandName: input.brand,
          category: input.category,
          type: input.type,
          size: input.size,
          price: input.price,
          availability: input.availability,
          productImageUrl: finalImageUrl,
        })
        .returning();

      if (!finalImageUrl) {
        // If the image wasn't ready immediately, run the full promise asynchronously
        imagePromise.then((url) => {
          if (url) {
            db.update(vendorStockTable)
              .set({ productImageUrl: url })
              .where(eq(vendorStockTable.id, randomUUID))
              .catch((e) => console.error("ASYNC IMAGE UPDATE FAILED:", e));
          }
        });
      }

      return {
        success: true,
        message: "Stock Updated Successfully",
      };
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Error in StockAddition ${err}`,
      });
    }
  }),

  getVendorStock: protectedProcedure
    .input(gettingVendorStockSchema)
    .query(async ({ input, ctx }) => {
      try {
        const { search, pageIndex, pageSize, stockFilter } = input;

        const whereConditions = [];

        whereConditions.push(eq(vendorStockTable.vendorId, ctx.user.roleId as string));

        if (stockFilter === "in") {
          whereConditions.push(eq(vendorStockTable.availability, true));
        } else if (stockFilter === "out") {
          whereConditions.push(eq(vendorStockTable.availability, false));
        }

        if (search && search.trim() !== "") {
          const searchTerms = search.trim().split(/\s+/).filter(Boolean);
          const tsQueryString = searchTerms.map((term) => `${term}:*`).join(" & ");
          const tsQuery = sql`to_tsquery('english', ${tsQueryString})`;

          whereConditions.push(
            sql`setweight(to_tsvector('english', coalesce(${vendorStockTable.brandName}, '')), 'A') ||
                setweight(to_tsvector('english', coalesce(${vendorStockTable.productName}, '')), 'B') ||
                setweight(to_tsvector('english', coalesce(${vendorStockTable.category}, '')), 'C') ||
                setweight(to_tsvector('english', coalesce(${vendorStockTable.type}, '')), 'D') ||
                setweight(to_tsvector('english', coalesce(${vendorStockTable.size}, '')), 'D') @@ ${tsQuery}`,
          );
        }

        const finalWhereConditions = and(...whereConditions);

        const totalCountResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(vendorStockTable)
          .where(finalWhereConditions);

        const totalCount = totalCountResult[0]?.count || 0;

        const vendorStocks = await db
          .select({
            id: vendorStockTable.id,
            brand: vendorStockTable.brandName,
            productName: vendorStockTable.productName,
            category: vendorStockTable.category,
            type: vendorStockTable.type,
            size: vendorStockTable.size,
            price: vendorStockTable.price,
            availability: vendorStockTable.availability,
            productImageUrl: vendorStockTable.productImageUrl,
          })
          .from(vendorStockTable)
          .where(finalWhereConditions)
          .orderBy(vendorStockTable.createdAt)
          .limit(pageSize)
          .offset(pageIndex * pageSize);

        return {
          success: true,
          totalCount,
          vendorStocks,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error fetching stock details ${err}`,
        });
      }
    }),

  editVendorStock: protectedProcedure.input(stockEditSchema).mutation(async ({ ctx, input }) => {
    try {
      const vendor = await db.query.vendor.findFirst({
        where: eq(vendorTable.id, ctx.user.roleId as string),
        columns: {
          isActive: true,
        },
      });

      if (!vendor?.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Account is froozen.",
        });
      }

      const filteredInput = Object.entries(input).filter(
        ([key, value]) =>
          value !== "" && value !== undefined && value !== null && key !== "stockId",
      );

      const stockToUpdate = Object.fromEntries(filteredInput);

      await db
        .update(vendorStockTable)
        .set(stockToUpdate)
        .where(eq(vendorStockTable.id, input.stockId));
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Stock edit failed ${err}`,
      });
    }
  }),

  updateVendorStockAvailability: protectedProcedure
    .input(
      z.object({
        stockIds: z.array(z.string()).min(1, "At least one stock ID is required."),
        availability: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const vendor = await db.query.vendor.findFirst({
          where: eq(vendorTable.id, ctx.user.roleId as string),
          columns: {
            isActive: true,
          },
        });

        if (!vendor?.isActive) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Account is froozen.",
          });
        }

        await db
          .update(vendorStockTable)
          .set({
            availability: input.availability,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(vendorStockTable.vendorId, ctx.user.roleId as string),
              inArray(vendorStockTable.id, input.stockIds),
            ),
          );

        return {
          success: true,
          message: `Successfully updated for ${input.stockIds.length} item(s).`,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error while updating Stock ${err}`,
        });
      }
    }),

  bulkUploadStock: protectedProcedure
    .input(
      z.object({
        data: bulkUploadStockSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const existingVendor = await db.query.vendor.findFirst({
          where: eq(vendorTable.userId, ctx.user.id as string),
          columns: { id: true, isActive: true },
        });

        if (!existingVendor) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Vendor account does not exist!",
          });
        }

        if (!existingVendor?.isActive) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Account is froozen.",
          });
        }

        // Prepare data and track original indices for image update
        const itemsToInsert = input.data.map((item) => {
          const [brandName, productName, category, type, size, price] = item;
          const stockId = uuidv4();

          return {
            // These properties are required for the DB insert
            id: stockId,
            vendorId: existingVendor.id,
            productName: productName,
            brandName: brandName,
            category: category,
            type: type === "" ? null : type,
            size: size,
            price: price,

            // Temporary, non-DB fields to help with image fetching later:
            _brand: brandName,
            _product: productName,
          };
        });

        // 1. Perform the BULK INSERT (Awaited - must be done first)
        await db.insert(vendorStockTable).values(itemsToInsert);

        // 2. Initiate ASYNCHRONOUS IMAGE FETCH AND UPDATE (Fire-and-Forget)
        // We use Promise.allSettled to handle all image lookups concurrently.

        const imageUpdateJob = async () => {
          const updatePromises = itemsToInsert.map(async (item) => {
            const externalImageUrl = await getImageUrlAndCache(item._brand, item._product);

            if (externalImageUrl) {
              // Perform a quick update to the specific stock item
              await db
                .update(vendorStockTable)
                .set({ productImageUrl: externalImageUrl })
                .where(eq(vendorStockTable.id, item.id));
            }
          });

          // Use allSettled to ensure all promises run to completion (success or failure)
          // We DO NOT await Promise.allSettled here because we want the response to be instant.
          await Promise.allSettled(updatePromises);
          console.log(`[BULK IMAGE JOB] Completed updates for ${itemsToInsert.length} items.`);
        };

        // CRITICAL: Call the entire job without 'await'
        imageUpdateJob().catch((err) => {
          console.error("BULK IMAGE JOB FAILED UNEXPECTEDLY:", err);
        });

        // 3. IMMEDIATE RETURN to the vendor
        return {
          success: true,
          message: `Successfully uploaded ${itemsToInsert.length} stock item(s). Images are loading in the background.`,
        };
      } catch (err) {
        // ... (Error handling)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to bulk uplaod ${err}`,
        });
      }
    }),

  deleteVendorStock: protectedProcedure
    .input(
      z.object({
        stockId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const existingVendor = await db.query.vendor.findFirst({
          where: eq(vendorTable.userId, ctx.user.id as string),
          columns: { id: true, isActive: true },
        });

        if (!existingVendor) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Vendor account does not exist!",
          });
        }

        if (!existingVendor?.isActive) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Account is froozen.",
          });
        }

        await db.delete(vendorStockTable).where(eq(vendorStockTable.id, input.stockId));

        return {
          success: true,
          message: "Stock Deleted Successfully",
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error deleting stock ${err}`,
        });
      }
    }),
});
