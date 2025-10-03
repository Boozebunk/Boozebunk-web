import db from "@boozebunk-trpc/db";
import { vendorAddressesTable } from "@boozebunk-trpc/db/schema/address";
import { customerTable } from "@boozebunk-trpc/db/schema/customer";
import { popularSearchTable } from "@boozebunk-trpc/db/schema/popsearch";
import { vendorStockTable } from "@boozebunk-trpc/db/schema/stock";
import { vendorTable } from "@boozebunk-trpc/db/schema/vendor";
import { createTRPCRouter, publicProcedure } from "@boozebunk-trpc/server/trpc";
import { TRPCError } from "@trpc/server";
import { and, eq, inArray, or, sql } from "drizzle-orm";
import z from "zod";

import { stockDisplaySchema } from "./dto";

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
            martOpenTime: vendorTable.martOpenTime,
            martCloseTime: vendorTable.martCloseTime,
            martArea: vendorAddressesTable.addressArea,
            martCity: vendorAddressesTable.addressCity,
            martState: vendorAddressesTable.addressState,
            martPostalCode: vendorAddressesTable.addressPostalCode,
            martLat: sql<number>`ST_Y(${vendorTable.locationCoordinates}::geometry)`.as("mart_lat"),
            martLng: sql<number>`ST_X(${vendorTable.locationCoordinates}::geometry)`.as("mart_lng"),
            distanceMeters:
              sql<number>`ST_Distance(${vendorTable.locationCoordinates}, ${customerLocation})`.as(
                "distance_meters",
              ),
          })
          .from(vendorTable)
          .leftJoin(vendorAddressesTable, eq(vendorTable.id, vendorAddressesTable.vendorId))
          .where(
            sql`ST_DWithin(${vendorTable.locationCoordinates}, ${customerLocation}, ${radiusMeters})`,
          )
          .orderBy(sql`distance_meters`);

        const vendorIds = vendors.map((v) => v.id);
        db.update(vendorTable)
          .set({
            viewCount: sql`${vendorTable.viewCount} + 1`,
            updatedAt: new Date(),
          })
          .where(inArray(vendorTable.id, vendorIds))
          .catch((err) => {
            console.error("ASYNC DB ERROR: Failed to increment vendor view count:", err);
          });

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
            martName: vendorTable.martName,
            storeStatus: vendorTable.martStatus,
            martOpenTime: vendorTable.martOpenTime,
            martCloseTime: vendorTable.martCloseTime,
            martArea: vendorAddressesTable.addressArea,
            martCity: vendorAddressesTable.addressCity,
            martState: vendorAddressesTable.addressState,
            martPostalCode: vendorAddressesTable.addressPostalCode,
            martLat: sql<number>`ST_Y(${vendorTable.locationCoordinates}::geometry)`.as("mart_lat"),
            martLng: sql<number>`ST_X(${vendorTable.locationCoordinates}::geometry)`.as("mart_lng"),
            brandName: vendorStockTable.brandName,
            productName: vendorStockTable.productName,
            price: vendorStockTable.price,
            size: vendorStockTable.size,
            category: vendorStockTable.category,
            type: vendorStockTable.type,
          })
          .from(vendorStockTable)
          .leftJoin(vendorTable, eq(vendorStockTable.vendorId, vendorTable.id))
          .leftJoin(vendorAddressesTable, eq(vendorTable.id, vendorAddressesTable.vendorId))
          .where(finalWhereConditions)
          .limit(50);

        // Updating the popular brand search
        if (searchQuery && stockItems.length > 0) {
          const logSearchActivity = async () => {
            const foundBrandNames = [...new Set(stockItems.map((item) => item.brandName))];

            if (foundBrandNames.length > 0) {
              try {
                console.log("Found brand names:", foundBrandNames);
                const ilikeConditions = foundBrandNames.map(
                  (brand) => sql`${popularSearchTable.brandName} ILIKE ${"%" + brand + "%"}`,
                );

                const combinedIlikeWhere = or(...ilikeConditions);

                // Find all existing popular_searches rows that contain the found brand names
                const matchingPopularBrands = await db
                  .select({ id: popularSearchTable.id })
                  .from(popularSearchTable)
                  .where(combinedIlikeWhere);

                const matchingIds = matchingPopularBrands.map((b) => b.id);

                console.log(matchingIds);

                // --- END: Dynamic ILIKE Check ---

                if (matchingIds.length > 0) {
                  console.log("----------------------Doing the duty----------------------");
                  // Update the search count for all matching IDs
                  await db
                    .update(popularSearchTable)
                    .set({
                      searchCount: sql`${popularSearchTable.searchCount} + 1`,
                    })
                    .where(inArray(popularSearchTable.id, matchingIds));
                }
              } catch (err) {
                console.error(
                  "ASYNC LOGGING FAILED: Could not increment popular search count:",
                  err,
                );
              }
            }
          };

          // CRITICAL: Call the async function without 'await' to decouple the process
          logSearchActivity();
        }

        return { stockItems };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error searching stock ${err}`,
        });
      }
    }),

  getCities: publicProcedure.query(async () => {
    try {
      const cities = await db
        .selectDistinct({
          city: sql<string>`TRIM(${vendorAddressesTable.addressCity})`,
        })
        .from(vendorAddressesTable);

      return {
        success: true,
        cities,
      };
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Error fetching cities ${err}`,
      });
    }
  }),

  getStockDisplay: publicProcedure.input(stockDisplaySchema).query(async ({ input }) => {
    try {
      const { city, category, pageIndex, pageSize } = input;

      const whereConditions = [];
      whereConditions.push(eq(vendorAddressesTable.addressCity, city));

      if (category) {
        whereConditions.push(eq(vendorStockTable.category, category));
      }

      const finalWhereConditions = and(...whereConditions);

      const items = await db
        .select({
          martName: vendorTable.martName,
          martStatus: vendorTable.martStatus,
          productName: vendorStockTable.productName,
          brandName: vendorStockTable.brandName,
          category: vendorStockTable.category,
          type: vendorStockTable.type,
          price: vendorStockTable.price,
          size: vendorStockTable.size,
          itemsCount: sql<number>`count(*) OVER()`.as("items_count"),
          martLat: sql<number>`ST_Y(${vendorTable.locationCoordinates}::geometry)`.as("mart_lat"),
          martLng: sql<number>`ST_X(${vendorTable.locationCoordinates}::geometry)`.as("mart_lng"),
        })
        .from(vendorStockTable)
        .leftJoin(vendorTable, eq(vendorStockTable.vendorId, vendorTable.id))
        .leftJoin(vendorAddressesTable, eq(vendorTable.id, vendorAddressesTable.vendorId))
        .where(finalWhereConditions)
        .limit(pageSize)
        .offset(pageIndex * pageSize);

      const totalItemsCount = items[0]?.itemsCount ?? 0;

      return {
        success: true,
        items,
        totalItemsCount,
      };
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Error getting stock-display ${err}`,
      });
    }
  }),

  saveCustomerEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await db
          .insert(customerTable)
          .values({
            email: input.email.trim(),
          })
          .onConflictDoNothing({
            target: customerTable.email,
          })
          .execute();

        return {
          success: "true",
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error saving customer email ${err}`,
        });
      }
    }),

  getMartDetailsById: publicProcedure
    .input(z.object({ vendorId: z.string(), customerLon: z.number(), customerLat: z.number() }))
    .query(async ({ input }) => {
      try {
        const { vendorId, customerLat, customerLon } = input;

        const customerLocation = sql`ST_SetSRID(ST_MakePoint(${customerLon}, ${customerLat}), 4326)::geography`;

        const [martDetails] = await db
          .select({
            martName: vendorTable.martName,
            martStatus: vendorTable.martStatus,
            martOpenTime: vendorTable.martOpenTime,
            martCloseTime: vendorTable.martCloseTime,
            martAddress: vendorAddressesTable.addressFormatted,
            distanceMeters:
              sql<number>`ST_Distance(${vendorTable.locationCoordinates}, ${customerLocation})`.as(
                "distance_meters",
              ),
            martLat: sql<number>`ST_Y(${vendorTable.locationCoordinates}::geometry)`.as("mart_lat"),
            martLng: sql<number>`ST_X(${vendorTable.locationCoordinates}::geometry)`.as("mart_lng"),
          })
          .from(vendorTable)
          .leftJoin(vendorAddressesTable, eq(vendorTable.id, vendorAddressesTable.vendorId))
          .where(eq(vendorTable.id, vendorId));

        db.update(vendorTable)
          .set({
            clickCount: sql`${vendorTable.clickCount} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(vendorTable.id, vendorId))
          .catch((err) => {
            console.error("ASYNC DB ERROR: Failed to increment vendor view count:", err);
          });

        return {
          success: true,
          martDetails,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error getting mart details ${err}`,
        });
      }
    }),

  getMartStockById: publicProcedure
    .input(
      z.object({
        vendorId: z.string(),
        search: z.string(),
        pageIndex: z.number(),
        pageSize: z.number(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const { vendorId, search, pageIndex, pageSize } = input;

        const whereConditions = [];
        whereConditions.push(
          and(eq(vendorStockTable.vendorId, vendorId), eq(vendorStockTable.availability, true)),
        );

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

        const martStocks = await db
          .select({
            id: vendorStockTable.id,
            brandName: vendorStockTable.brandName,
            productName: vendorStockTable.productName,
            category: vendorStockTable.category,
            type: vendorStockTable.type,
            size: vendorStockTable.size,
            price: vendorStockTable.price,
          })
          .from(vendorStockTable)
          .where(finalWhereConditions)
          .orderBy(vendorStockTable.createdAt)
          .limit(pageSize)
          .offset(pageIndex * pageSize);

        const totalCount = totalCountResult[0]?.count || 0;

        return {
          success: true,
          totalCount,
          martStocks,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error getting mart stock ${err}`,
        });
      }
    }),
});
