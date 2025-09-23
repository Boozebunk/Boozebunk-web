import db from "@boozebunk-trpc/db";
import { vendorStockTable } from "@boozebunk-trpc/db/schema/stock";
import { vendorTable } from "@boozebunk-trpc/db/schema/vendor";
import { createTRPCRouter, protectedProcedure } from "@boozebunk-trpc/server/trpc";
import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import z from "zod";

export const analyticsRouter = createTRPCRouter({
  getStockOverview: protectedProcedure.query(async ({ ctx }) => {
    try {
      const stockCountResult = await db
        .select({
          count: sql<number>`count(*)`,
          outOfStock: sql<number>`count(case when "vendor_stock"."availability" = false then 1 else null end)`,
        })
        .from(vendorStockTable)
        .where(eq(vendorStockTable.vendorId, ctx.user.roleId as string));

      const totalStockListed = stockCountResult[0]?.count ?? 0;
      const outOfStockCount = stockCountResult[0]?.outOfStock ?? 0;

      const outOfStockItems = await db
        .select({
          brandName: vendorStockTable.brandName,
          productName: vendorStockTable.productName,
          size: vendorStockTable.size,
        })
        .from(vendorStockTable)
        .where(
          and(
            eq(vendorStockTable.vendorId, ctx.user.roleId as string),
            eq(vendorStockTable.availability, false),
          ),
        )
        .limit(4);

      return {
        code: "success",
        totalStockListed,
        outOfStockItems,
        outOfStockCount,
      };
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Error getting stockOverview ${err}`,
      });
    }
  }),

  vendorQuickActions: protectedProcedure
    .input(
      z.object({
        martStatus: z.enum(["OPEN", "CLOSED"]),
        martOpenTime: z.string(),
        martCloseTime: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const updateSet: {
          martStatus?: "OPEN" | "CLOSED";
          martOpenTime?: string;
          martCloseTime?: string;
        } = {};

        if (input.martStatus) {
          updateSet.martStatus = input.martStatus;
        }
        if (input.martOpenTime) {
          updateSet.martOpenTime = input.martOpenTime;
        }
        if (input.martCloseTime) {
          updateSet.martCloseTime = input.martCloseTime;
        }

        await db
          .update(vendorTable)
          .set(updateSet)
          .where(eq(vendorTable.id, ctx.user.roleId as string));

        return {
          code: "success",
          message: "Quick Actions Successfully Updated",
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error Quick Actions ${err}`,
        });
      }
    }),
});
