import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import z from "zod";

import db from "@boozebunk-trpc/db";
import { adminTable } from "@boozebunk-trpc/db/schema/admin";
import { userTable } from "@boozebunk-trpc/db/schema/auth/user";
import { verificationTokensTable } from "@boozebunk-trpc/db/schema/auth/verification";
import { env } from "@boozebunk-trpc/env";
import { createTRPCRouter, publicProcedure } from "@boozebunk-trpc/server/trpc";
import { hashPassword, verifyPassword } from "@boozebunk-trpc/utils/authUtils";
import { sendEmail } from "@boozebunk-trpc/utils/ses-sender";

import { createAdminSchema, loginCredentialSchema } from "./dto";

export const authRouter = createTRPCRouter({
  login: publicProcedure.input(loginCredentialSchema).mutation(async ({ input, ctx }) => {
    try {
      const user = await db.query.user.findFirst({
        where: eq(userTable.email, input.email),
      });

      if (!user || user.role != input.role) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Email Account Not Found" });
      }

      const isPasswordValid = await verifyPassword(input.password, user.password);

      if (!isPasswordValid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Password is Incorrect" });
      }

      // Generating JWT token
      // The payload type is inferred from fastify-jwt.d.ts
      const token = await ctx.res.jwtSign({
        id: user.id,
        roleId: user.roleId ?? "None",
        email: user.email,
        role: user.role,
      });

      //TODO: comment the sameSite & domain properties when testing in localhost and also set the secure to false
      ctx.res.setCookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: ".boozebunk.com",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      console.log("Added Cookie in browser ✅");

      //updating lastLoginAt timestamp
      await db.update(userTable).set({ lastLoginAt: new Date() }).where(eq(userTable.id, user.id));

      return {
        success: true,
        user: { id: user.id, roleId: user.roleId, email: user.email, role: user.role },
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `An error occurred while logging in ${error}`,
        cause: error,
      });
    }
  }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    // uncomment when testing on local testing
    // ctx.res.clearCookie("token", { path: "/" });

    //TODO: for local testing comment the whole code below and uncomment the above line
    ctx.res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".boozebunk.com",
      path: "/",
    });

    return { success: true };
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
      const [newAdmin] = await db
        .insert(adminTable)
        .values({ id: randomAdminId, userId: newUser?.id || randomAdminId, name: input.name })
        .returning();

      await db
        .update(userTable)
        .set({
          roleId: newAdmin?.id,
        })
        .where(eq(userTable.id, newAdmin?.userId || randomUserId));

      return {
        success: true,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `An error occurred while creating admin ${error}`,
        cause: error,
      });
    }
  }),

  getSession: publicProcedure.query(({ ctx }) => {
    try {
      console.log("getSession data ✅ ", ctx.user);
      return ctx.user;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `An error occurred while fetching session data ${error}`,
        cause: error,
      });
    }
  }),

  requestPasswordReset: publicProcedure
    .input(
      z.object({
        email: z.email("Invalid Email"),
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

        // Deleting all the tokens if any already existing
        await db.delete(verificationTokensTable).where(eq(verificationTokensTable.userId, user.id));

        const resetToken = uuidv4();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        //Create a new Token record
        await db.insert(verificationTokensTable).values({
          id: uuidv4(),
          userId: user.id,
          token: resetToken,
          type: "password_reset",
          expiresAt: expiresAt,
        });

        const resetLink = `${env.FRONTEND_URL}/accounts/${resetToken}/reset-password`;

        await sendEmail(input.email, "Password Reset for Boozebunk", "reset-password", {
          resetLink,
        });

        return {
          success: true,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `An error occurred while requesting password reset ${error}`,
          cause: error,
        });
      }
    }),

  changePassword: publicProcedure
    .input(z.object({ token_id: z.string(), password: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const token = await db.query.verification.findFirst({
          where: eq(verificationTokensTable.token, input.token_id),
        });

        if (!token) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Expired password reset token. Please retry.",
          });
        }

        const hashedPassword = await hashPassword(input.password);

        await db
          .update(userTable)
          .set({
            password: hashedPassword,
          })
          .where(eq(userTable.id, token.userId));

        const user = await db.query.user.findFirst({
          where: eq(userTable.id, token.userId),
        });

        await db.delete(verificationTokensTable).where(eq(verificationTokensTable.id, token.id));

        return {
          success: true,
          userRole: user?.role || "vendor",
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `An error occurred while changing password ${err}`,
          cause: err,
        });
      }
    }),
});
