import db from "@boozebunk-trpc/db";
import { adminTable } from "@boozebunk-trpc/db/schema/admin";
import { userTable } from "@boozebunk-trpc/db/schema/auth/user";
import { verificationTokensTable } from "@boozebunk-trpc/db/schema/auth/verification";
import { createTRPCRouter, publicProcedure } from "@boozebunk-trpc/server/trpc";
import { hashPassword, verifyPassword } from "@boozebunk-trpc/utils/authUtils";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import z from "zod";

import { createAdminSchema, loginCredentialSchema } from "./dto";

export const authRouter = createTRPCRouter({
  login: publicProcedure.input(loginCredentialSchema).mutation(async ({ input, ctx }) => {
    try {
      const user = await db.query.user.findFirst({
        where: eq(userTable.email, input.email),
      });

      if (!user || user.role != input.role) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid Credentials" });
      }

      const isPasswordValid = await verifyPassword(input.password, user.password);

      if (!isPasswordValid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Password is Wrong" });
      }

      //  if (!user.email_verified) {
      //     throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Please verify your email before logging in.' });
      //   }

      // Generating JWT token
      // The payload type is inferred from fastify-jwt.d.ts
      const token = await ctx.res.jwtSign({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // Setting up JWT as an HttpOnly Cookie in the response
      ctx.res.setCookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      //updating lastLoginAt timestamp
      await db.update(userTable).set({ lastLoginAt: new Date() }).where(eq(userTable.id, user.id));

      return {
        success: true,
        message: `${input.role} logged in successfully`,
        user: { id: user.id, email: user.email, role: user.role },
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `An error occurred while loggin in ${error}`,
      });
    }
  }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.res.clearCookie("token", { path: "/" });
    return { success: true, message: "Logged out Successfully" };
  }),

  createAdmin: publicProcedure.input(createAdminSchema).mutation(async ({ input }) => {
    try {
      const existingUser = await db.query.user.findFirst({
        where: eq(userTable.email, input.email),
      });

      if (existingUser) {
        throw new TRPCError({ code: "CONFLICT", message: "User Already Exists" });
      }

      const hashedPassword = await hashPassword(input.password);

      const randomUserId = uuidv4();
      const [newUser] = await db
        .insert(userTable)
        .values({
          id: randomUserId,
          email: input.email,
          password: hashedPassword,
          role: input.role,
        })
        .returning();

      const randomAdminId = uuidv4();
      await db
        .insert(adminTable)
        .values({ id: randomAdminId, userId: newUser?.id || randomAdminId, name: input.name });

      return {
        success: true,
        message: `User (${input.role} created successfully)`,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `An error occurred while creating admin ${error}`,
      });
    }
  }),

  getSession: publicProcedure.query(({ ctx }) => {
    try {
      return ctx.user;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `An error occurred while fetching session ${error}`,
      });
    }
  }),

  requestPasswordReset: publicProcedure
    .input(
      z.object({
        email: z.email("Invalid email format"),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const user = await db.query.user.findFirst({
          where: eq(userTable.email, input.email),
        });

        if (!user) {
          return {
            success: false,
            message: "Account does not exist. Please enter a registered email.",
          };
        }

        const resetToken = uuidv4();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        await db.insert(verificationTokensTable).values({
          id: uuidv4(),
          userId: user.id,
          token: resetToken,
          type: "password_reset",
          expiresAt: expiresAt,
        });

        // const resetLink = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/accounts/${resetToken}/reset-password`;

        // simply need to send the email to the registered user.
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `An error occurred while requesting password reset: ${error}`,
        });
      }
    }),
});
