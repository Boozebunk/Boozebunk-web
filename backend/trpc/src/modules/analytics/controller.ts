import db from "@boozebunk-trpc/db";
import { userTable } from "@boozebunk-trpc/db/schema/auth/user";
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

  getVendorActivity: protectedProcedure.query(async () => {
    try {
      const now = new Date();

      // Date of last 30 days from current (today).
      const last30Days = new Date(now);
      last30Days.setDate(now.getDate() - 30);

      // Date of previous 30 days from the last 30 days (month before the last month).
      const previous30Days = new Date(last30Days);
      previous30Days.setDate(last30Days.getDate() - 30);

      // date of last 7 days from current (today).
      const last7Days = new Date(now);
      last7Days.setDate(now.getDate() - 7);

      // Date of previous 7 days from the last 7 days (week before the last week).
      const previous7Days = new Date(last7Days);
      previous7Days.setDate(last7Days.getDate() - 7);

      const result = await db
        .select({
          newVendorsLast30Days: sql<number>`count(case when ${vendorTable.createdAt} >= ${last30Days} then 1 else null end)`,
          newVendorsPrev30Days: sql<number>`count(case when ${vendorTable.createdAt} >= ${previous30Days} and ${vendorTable.createdAt} < ${last30Days} then 1 else null end)`,

          loginsLast7Days: sql<number>`count(case when ${userTable.lastLoginAt} >= ${last7Days} then 1 else null end)`,
          loginsPrev7Days: sql<number>`count(case when ${userTable.lastLoginAt} >= ${previous7Days} and ${userTable.lastLoginAt} < ${last7Days} then 1 else null end)`,
        })
        .from(vendorTable)
        .innerJoin(userTable, eq(vendorTable.userId, userTable.id))
        .where(eq(userTable.role, "vendor"));

      const { newVendorsLast30Days, newVendorsPrev30Days, loginsLast7Days, loginsPrev7Days } =
        result[0] ?? {
          newVendorsLast30Days: 0,
          newVendorsPrev30Days: 0,
          loginsLast7Days: 0,
          loginsPrev7Days: 0,
        };

      // Calculating (vendors registered) the % change with respect to the previous month.
      let newVendorsChange = 0;
      if (newVendorsPrev30Days > 0) {
        newVendorsChange =
          ((newVendorsLast30Days - newVendorsPrev30Days) / newVendorsPrev30Days) * 100;
      } else if (newVendorsLast30Days > 0) {
        newVendorsChange = 100;
      }

      // Calculating (vendor login frequency) the % change with respect to the previous week.
      let loginFrequencyChange = 0;
      if (loginsPrev7Days > 0) {
        loginFrequencyChange = ((loginsLast7Days - loginsPrev7Days) / loginsPrev7Days) * 100;
      } else if (loginsLast7Days > 0) {
        loginFrequencyChange = 100;
      }

      return {
        success: true,
        newVendors: {
          count: newVendorsLast30Days,
          change: newVendorsChange,
        },
        loginFrequency: {
          avgLoginsPerWeek: loginsLast7Days,
          change: loginFrequencyChange,
        },
      };
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `getting VendorActivity Failed ${err}`,
      });
    }
  }),

  getUserOverview: protectedProcedure.query(async ({ ctx }) => {
    try {
      const [martValues] = await db
        .select({
          viewCount: vendorTable.viewCount,
          clickCount: vendorTable.clickCount,
        })
        .from(vendorTable)
        .where(eq(vendorTable.id, ctx.user.roleId as string));

      return {
        success: true,
        viewCount: martValues?.viewCount ?? 0,
        clickCount: martValues?.clickCount ?? 0,
      };
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `getting UserOverview Failed ${err}`,
      });
    }
  }),
});
