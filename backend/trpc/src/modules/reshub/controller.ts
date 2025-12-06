import { TRPCError } from "@trpc/server";
import { desc, eq, sql } from "drizzle-orm";
import z from "zod";

import db from "@boozebunk-trpc/db";
import { vendorAddressesTable } from "@boozebunk-trpc/db/schema/address";
import { userTable } from "@boozebunk-trpc/db/schema/auth/user";
import { FeedbackTable } from "@boozebunk-trpc/db/schema/feedback";
import { VendorQueryTable } from "@boozebunk-trpc/db/schema/query";
import { vendorTable } from "@boozebunk-trpc/db/schema/vendor";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@boozebunk-trpc/server/trpc";

export const responseHubRouter = createTRPCRouter({
  createVendorQuery: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await db.insert(VendorQueryTable).values({
          vendorId: ctx.user.roleId as string,
          title: input.title,
          description: input.description,
        });

        return {
          success: true,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error Writing Query. ${err}`,
          cause: err,
        });
      }
    }),

  getVendorQueries: protectedProcedure
    .input(
      z.object({
        pageSize: z.number(),
        pageIndex: z.number(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const queries = await db
          .select({
            id: VendorQueryTable.id,
            martName: vendorTable.martName,
            vendorName: vendorTable.vendorName,
            vendorEmail: userTable.email,
            vendorPhone: vendorTable.phoneNumber,
            title: VendorQueryTable.title,
            description: VendorQueryTable.description,
            vendorCity: vendorAddressesTable.addressCity,
            vendorState: vendorAddressesTable.addressState,
            vendorPostalCode: vendorAddressesTable.addressPostalCode,
            queryDate: VendorQueryTable.createdAt,
          })
          .from(VendorQueryTable)
          .leftJoin(vendorTable, eq(VendorQueryTable.vendorId, vendorTable.id))
          .leftJoin(vendorAddressesTable, eq(vendorTable.id, vendorAddressesTable.vendorId))
          .leftJoin(userTable, eq(vendorTable.userId, userTable.id))
          .orderBy(VendorQueryTable.createdAt)
          .limit(input.pageSize)
          .offset(input.pageIndex * input.pageSize);

        return {
          success: true,
          queries,
          totalLength: queries.length,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error getting vendor queries. ${err}`,
          cause: err,
        });
      }
    }),

  deleteQueryById: protectedProcedure
    .input(z.object({ queryId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await db.delete(VendorQueryTable).where(eq(VendorQueryTable.id, input.queryId));

        return {
          success: true,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error deleting query. ${err}`,
          cause: err,
        });
      }
    }),

  deleteAllQueries: protectedProcedure.mutation(async () => {
    try {
      await db.execute(sql`TRUNCATE TABLE ${VendorQueryTable}`);

      return {
        success: true,
      };
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Error deleting all queries. ${err}`,
        cause: err,
      });
    }
  }),

  saveCustomerFeedback: publicProcedure
    .input(
      z.object({
        email: z.string().min(1, "Email is Required"),
        description: z.string().optional(),
        rating: z.number().min(1, "Rating is must"),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        await db.insert(FeedbackTable).values({
          email: input.email,
          description: input.description,
          rating: input.rating,
        });

        return {
          success: true,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Feedback Failed. Please try again. ${err}`,
          cause: err,
        });
      }
    }),

  getCustomerFeedback: protectedProcedure
    .input(
      z.object({
        pageSize: z.number(),
        pageIndex: z.number(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const totalLength = await db
          .select({
            count: sql<number>`count(*)`,
          })
          .from(FeedbackTable)
          .then((res) => res[0]?.count ?? 0);

        const feedbacks = await db
          .select()
          .from(FeedbackTable)
          .limit(input.pageSize)
          .offset(input.pageIndex * input.pageSize)
          .orderBy(desc(FeedbackTable.createdAt));
        return {
          success: true,
          feedbacks,
          totalLength,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error getting feedbacks. Please try again. ${err}`,
          cause: err,
        });
      }
    }),

  deleteFeedbackById: protectedProcedure
    .input(z.object({ feedbackId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await db.delete(FeedbackTable).where(eq(FeedbackTable.id, input.feedbackId));

        return {
          success: true,
          message: "Feedback Successfully Deleted",
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error deleting feedback. Please try again. ${err}`,
        });
      }
    }),

  deleteAllFeedbacks: protectedProcedure.mutation(async () => {
    try {
      await db.execute(sql`TRUNCATE TABLE ${FeedbackTable}`);

      return {
        success: true,
      };
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Error deleting Feedbacks. Please try again. ${err}`,
        cause: err,
      });
    }
  }),
});
