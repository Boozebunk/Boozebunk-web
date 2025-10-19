import db from "@boozebunk-trpc/db";
import { vendorAddressesTable } from "@boozebunk-trpc/db/schema/address";
import { userTable } from "@boozebunk-trpc/db/schema/auth/user";
import { vendorTable } from "@boozebunk-trpc/db/schema/vendor";
import { createTRPCRouter, protectedProcedure } from "@boozebunk-trpc/server/trpc";
import { generatePassword, hashPassword } from "@boozebunk-trpc/utils/authUtils";
import { sendEmail } from "@boozebunk-trpc/utils/ses-sender";
import { TRPCError } from "@trpc/server";
import { and, eq, gt, lt, or, sql } from "drizzle-orm";
import z from "zod";

import { editVendorSchema, gettingVendorInputSchema, vendorRegistrationSchema } from "./dto";

export const vendorRouter = createTRPCRouter({
  createVendor: protectedProcedure.input(vendorRegistrationSchema).mutation(async ({ input }) => {
    try {
      const existingUser = await db.query.user.findFirst({
        where: eq(userTable.email, input.email),
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User Already Exists",
        });
      }

      const RandomPassword = await generatePassword(8);
      const hashedPassword = await hashPassword(RandomPassword);

      await db.transaction(async (tx) => {
        const newUser = await tx
          .insert(userTable)
          .values({
            email: input.email,
            password: hashedPassword,
            role: "vendor",
          })
          .returning();

        const vendor = await tx
          .insert(vendorTable)
          .values({
            userId: newUser[0]?.id || "",
            martName: input.martName,
            vendorName: input.vendorName,
            phoneNumber: input.phoneNumber,
            licenseNumber: input.licenseNumber,
            locationCoordinates: sql`ST_SetSRID(ST_MakePoint(${input.locationCoordinates.lng}, ${input.locationCoordinates.lat}), 4326)`,
          })
          .returning();

        await tx.insert(vendorAddressesTable).values({
          vendorId: vendor[0]?.id || "",
          addressFormatted: input.addressFormatted,
          addressArea: input.addressArea,
          addressCity: input.addressCity,
          addressState: input.addressState,
          addressPostalCode: input.addressPostalCode,
        });

        await tx
          .update(userTable)
          .set({
            roleId: vendor[0]?.id,
          })
          .where(eq(userTable.id, vendor[0]?.userId || ""));
      });

      await sendEmail(input.email, `Welcome to Boozebunk ${input.vendorName}`, "welcome-vendor", {
        vendorName: input.vendorName,
        email: input.email,
        password: RandomPassword,
      });

      return {
        success: true,
        message: "Vendor Created Successfully",
      };
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Sever not Creating an Vendor ${err}`,
      });
    }
  }),

  getVendorsList: protectedProcedure.input(gettingVendorInputSchema).query(async ({ input }) => {
    const { search, isActive, pageIndex, pageSize, fromDate, toDate } = input;

    const whereConditions = [];
    whereConditions.push(eq(vendorTable.isActive, isActive));

    if (search && search.trim() !== "") {
      // --- FIX: Construct tsquery for flexible prefix matching ---
      const searchTerms = search.trim().split(/\s+/).filter(Boolean); // Split by whitespace, remove empty strings
      // Combine with OR (|) for flexibility, and :* for prefix matching
      const tsQueryString = searchTerms.map((term) => `${term}:*`).join(" & ");
      const tsQuery = sql`to_tsquery('english', ${tsQueryString})`; // Create the tsquery

      whereConditions.push(
        or(
          sql`setweight(to_tsvector('english', coalesce(${vendorTable.martName}, '')), 'A') ||
                setweight(to_tsvector('english', coalesce(${vendorTable.vendorName}, '')), 'B') ||
                setweight(to_tsvector('english', coalesce(${vendorTable.phoneNumber}, '')), 'C') ||
                setweight(to_tsvector('english', coalesce(${vendorTable.licenseNumber}, '')), 'D') @@ ${tsQuery}`,

          sql`to_tsvector('english', coalesce(${userTable.email}, '')) @@ ${tsQuery}`,

          sql`setweight(to_tsvector('english', coalesce(${vendorAddressesTable.addressState}, '')), 'A') ||
                setweight(to_tsvector('english', coalesce(${vendorAddressesTable.addressPostalCode}, '')), 'B') ||
                setweight(to_tsvector('english', coalesce(${vendorAddressesTable.addressCity}, '')), 'C') ||
                setweight(to_tsvector('english', coalesce(${vendorAddressesTable.addressArea}, '')), 'D') @@ ${tsQuery}`,
        ),
      );
    }

    if (fromDate && toDate) {
      const endDateInclusive = new Date(toDate);
      endDateInclusive.setDate(endDateInclusive.getDate() + 1);
      whereConditions.push(
        and(gt(vendorTable.createdAt, fromDate), lt(vendorTable.createdAt, endDateInclusive)),
      );
    }

    const finalWhereConditions = and(...whereConditions);

    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(vendorTable)
      .leftJoin(userTable, eq(vendorTable.userId, userTable.id))
      .leftJoin(vendorAddressesTable, eq(vendorTable.id, vendorAddressesTable.vendorId))
      .where(finalWhereConditions);

    const totalCount = totalCountResult[0]?.count || 0;

    const vendors = await db
      .select({
        id: vendorTable.id,
        martName: vendorTable.martName,
        vendorName: vendorTable.vendorName,
        phoneNumber: vendorTable.phoneNumber,
        RegisteredOn: vendorTable.createdAt,
        isActive: vendorTable.isActive,
        licenseNumber: vendorTable.licenseNumber,
        // Select email from userTable
        vendorEmail: userTable.email,
        // Select address components from vendorAddressesTable
        addressCity: vendorAddressesTable.addressCity,
        addressState: vendorAddressesTable.addressState,
        addressPostalCode: vendorAddressesTable.addressPostalCode,
        addressArea: vendorAddressesTable.addressArea,
      })
      .from(vendorTable)
      .leftJoin(userTable, eq(vendorTable.userId, userTable.id))
      .leftJoin(vendorAddressesTable, eq(vendorTable.id, vendorAddressesTable.vendorId))
      .where(finalWhereConditions)
      .orderBy(vendorTable.createdAt)
      .limit(pageSize)
      .offset(pageIndex * pageSize);

    return {
      success: true,
      vendorsData: vendors,
      totalCount,
    };
  }),

  editVendorActivity: protectedProcedure
    .input(z.object({ vendorId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const vendor = await db.query.vendor.findFirst({
          where: eq(vendorTable.id, input.vendorId),
        });

        if (!vendor) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Vendor does not exists",
          });
        }

        await db
          .update(vendorTable)
          .set({
            isActive: vendor.isActive ? false : true,
          })
          .where(eq(vendorTable.id, input.vendorId));

        return {
          success: true,
          message: "Successfully Update Vendor Activity",
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Vendor Activity updation failed ${err}`,
        });
      }
    }),

  deleteVendor: protectedProcedure
    .input(z.object({ vendorId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const vendor = await db.query.vendor.findFirst({
          where: eq(vendorTable.id, input.vendorId),
        });

        if (!vendor) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Vendor does not exists",
          });
        }

        // Vendor and Address data automatically get deletes as set delete on cascade
        await db.delete(userTable).where(eq(userTable.id, vendor.userId));
        // await db.delete(vendorTable).where(eq(vendorTable.id, input.vendorId));
        // await db
        //   .delete(vendorAddressesTable)
        //   .where(eq(vendorAddressesTable.vendorId, input.vendorId));

        return {
          success: true,
          message: "Vendor Successfully Deleted",
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Vendor Deletion failed ${err}`,
        });
      }
    }),

  editVendor: protectedProcedure.input(editVendorSchema).mutation(async ({ input }) => {
    try {
      const filteredInputs = Object.entries(input).filter(
        ([key, value]) =>
          value !== undefined && value !== "" && value !== null && key !== "vendorId",
      );

      const inputsToUpdate = Object.fromEntries(filteredInputs);

      await db.update(vendorTable).set(inputsToUpdate).where(eq(vendorTable.id, input.vendorId));

      return {
        success: true,
        message: "Successfully Edited Vendor Details",
      };
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Error Editing Vendor Details ${err}`,
      });
    }
  }),

  getVendorsOverview: protectedProcedure.query(async () => {
    try {
      const totalCount = await db
        .select({
          totalVendors: sql<number>`count(*)`,
          activeVendors: sql<number>`count(case when "vendors"."is_active" = true then 1 else null end)`,
        })
        .from(vendorTable);

      const totalVendors = totalCount[0]?.totalVendors ?? 0;
      const activeVendors = totalCount[0]?.activeVendors ?? 0;
      const frozenVendors = totalVendors - activeVendors;

      return {
        success: true,
        totalVendors,
        activeVendors,
        frozenVendors,
      };
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Error Fetching Vendors Overview -> ${err}`,
      });
    }
  }),

  isVendorDeleted: protectedProcedure.query(async ({ ctx }) => {
    try {
      const vendor = await db.query.vendor.findFirst({
        where: eq(vendorTable.userId, ctx.user.id as string),
      });

      return {
        success: true,
        isDeleted: vendor ? false : true,
      };
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Error checking vendor deletion status -> ${err}`,
      });
    }
  }),
});
