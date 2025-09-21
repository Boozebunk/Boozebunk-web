import db from "@boozebunk-trpc/db";
import { vendorAddressesTable } from "@boozebunk-trpc/db/schema/address";
import { userTable } from "@boozebunk-trpc/db/schema/auth/user";
import { VendorQueryTable } from "@boozebunk-trpc/db/schema/query";
import { vendorTable } from "@boozebunk-trpc/db/schema/vendor";
import { createTRPCRouter, protectedProcedure } from "@boozebunk-trpc/server/trpc";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";

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
          message: "Query Created Successfully",
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error Writing Query ${err}`,
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
          message: `Error getting vendor queries ${err}`,
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
          message: "Query Successfully Deleted",
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error deleting query ${err}`,
        });
      }
    }),

  deleteAllQueries: protectedProcedure.mutation(async () => {
    try {
      await db.delete(VendorQueryTable);

      return {
        success: true,
        message: "Queries Deletion Successfull",
      };
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Error deleting all queries: ${err}`,
      });
    }
  }),
});
