import db from "@boozebunk-trpc/db";
import { vendorStockTable } from "@boozebunk-trpc/db/schema/stock";
import { vendorTable } from "@boozebunk-trpc/db/schema/vendor";
import { createTRPCRouter, protectedProcedure } from "@boozebunk-trpc/server/trpc";
import { TRPCError } from "@trpc/server";
import { and, eq, inArray, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import z from "zod";

import { gettingVendorStockSchema, vendorAddStockSchema } from "./dto";

export const vendorStockRouter = createTRPCRouter({
  addStock: protectedProcedure.input(vendorAddStockSchema).mutation(async ({ ctx, input }) => {
    try {
      const vendor = await db.query.vendor.findFirst({
        where: eq(vendorTable.userId, ctx.user.id as string),
      });

      if (!vendor) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Vendor Account Does not exists",
        });
      }

      const randomUUID = uuidv4();
      console.log("about to add new stock");
      // adding the stock into the stock table
      const newStock = await db
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
        })
        .returning();

      console.log(newStock);

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

        const existingVendor = await db.query.vendor.findFirst({
          where: eq(vendorTable.userId, ctx.user.id as string),
        });

        if (!existingVendor) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Vendor Account Does not exists",
          });
        }

        const whereConditions = [];

        whereConditions.push(eq(vendorStockTable.vendorId, existingVendor.id));

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

  updateVendorStock: protectedProcedure
    .input(
      z.object({
        stockIds: z.array(z.string()).min(1, "At least one stock ID is required."),
        availability: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const existingVendor = await db.query.vendor.findFirst({
          where: eq(vendorTable.userId, ctx.user.id as string),
          columns: { id: true },
        });

        if (!existingVendor) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Vendor account does not exist!",
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
              eq(vendorStockTable.vendorId, existingVendor.id),
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
          columns: { id: true },
        });

        if (!existingVendor) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Vendor account does not exist!",
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
