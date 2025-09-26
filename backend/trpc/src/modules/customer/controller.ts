import db from "@boozebunk-trpc/db";
import { vendorStockTable } from "@boozebunk-trpc/db/schema/stock";
import { vendorTable } from "@boozebunk-trpc/db/schema/vendor";
import { createTRPCRouter, publicProcedure } from "@boozebunk-trpc/server/trpc";
import { TRPCError } from "@trpc/server";
import { and, eq, inArray, sql } from "drizzle-orm";
import z from "zod";

export const customerRouter = createTRPCRouter({
  getNearbyVendors: publicProcedure
    .input(
      z.object({
        customerLat: z.number(),
        customerLon: z.number(),
        radiusKm: z.number().default(10),
      }),
    )
    .query(async ({ input }) => {
      try {
        const { customerLat, customerLon, radiusKm } = input;

        const customerLocation = sql`ST_SetSRID(ST_MakePoint(${customerLon}, ${customerLat}), 4326)::geography`;
        const radiusMeters = radiusKm * 1000;

        const vendors = await db
          .select({
            id: vendorTable.id,
            martName: vendorTable.martName,
            storeStatus: vendorTable.martStatus,
            distanceMeters:
              sql<number>`ST_Distance(${vendorTable.locationCoordinates}, ${customerLocation})`.as(
                "distance_meters",
              ),
          })
          .from(vendorTable)
          .where(
            sql`ST_DWithin(${vendorTable.locationCoordinates}, ${customerLocation}, ${radiusMeters})`,
          )
          .orderBy(sql`distance_meters`);

        return vendors;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error getting nearby vendors ${err}`,
        });
      }
    }),

  searchStock: publicProcedure
    .input(
      z.object({
        searchQuery: z.string().optional(),
        vendorIds: z.array(z.string().uuid()).optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const { searchQuery, vendorIds } = input;

        const whereConditions = [];

        if (vendorIds && vendorIds.length > 0) {
          whereConditions.push(inArray(vendorStockTable.vendorId, vendorIds));
        }

        if (searchQuery && searchQuery.trim() !== "") {
          const searchTerms = searchQuery.trim().split(/\s+/).filter(Boolean);

          const tsQueryString = searchTerms.map((term) => `${term}:*`).join(" | ");

          const tsQuery = sql`to_tsquery('english', ${tsQueryString})`;

          whereConditions.push(
            sql`setweight(to_tsvector('english', coalesce(${vendorStockTable.brandName}, '')), 'A') ||
            setweight(to_tsvector('english', coalesce(${vendorStockTable.productName}, '')), 'B') ||
            setweight(to_tsvector('english', coalesce(${vendorStockTable.category}, '')), 'C') ||
            setweight(to_tsvector('english', coalesce(${vendorStockTable.type}, '')), 'D') @@ ${tsQuery}`,
          );
        }

        const finalWhereConditions = and(...whereConditions);

        const stockItems = await db
          .select({
            stockId: vendorStockTable.id,
            vendorName: vendorTable.martName,
            brand: vendorStockTable.brandName,
            productName: vendorStockTable.productName,
            price: vendorStockTable.price,
          })
          .from(vendorStockTable)
          .leftJoin(vendorTable, eq(vendorStockTable.vendorId, vendorTable.id))
          .where(finalWhereConditions)
          .limit(50);

        return { stockItems };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error searching stock ${err}`,
        });
      }
    }),
});
