import db from "@boozebunk-trpc/db";
import { vendorStockTable } from "@boozebunk-trpc/db/schema/stock";
import { vendorTable } from "@boozebunk-trpc/db/schema/vendor";
import { createTRPCRouter, protectedProcedure } from "@boozebunk-trpc/server/trpc";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import { vendorAddStockSchema } from "./dto";

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
});
