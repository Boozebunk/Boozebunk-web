import db from "@boozebunk-trpc/db";
import { vendorAddressesTable } from "@boozebunk-trpc/db/schema/address";
import { userTable } from "@boozebunk-trpc/db/schema/auth/user";
import { vendorTable } from "@boozebunk-trpc/db/schema/vendor";
import { createTRPCRouter, protectedProcedure } from "@boozebunk-trpc/server/trpc";
import { generatePassword, hashPassword } from "@boozebunk-trpc/utils/authUtils";
import { sendEmail } from "@boozebunk-trpc/utils/ses-sender";
import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";

import { vendorRegistrationSchema } from "./dto";

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
});
