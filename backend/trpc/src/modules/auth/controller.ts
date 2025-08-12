import db from "@boozebunk-trpc/db";
import { adminTable } from "@boozebunk-trpc/db/schema/admin";
import { userTable } from "@boozebunk-trpc/db/schema/auth/user";
import { createTRPCRouter, publicProcedure } from "@boozebunk-trpc/server/trpc";
import { hashPassword, verifyPassword } from "@boozebunk-trpc/utils/authUtils";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import { createAdminSchema, loginCredentialSchema } from "./dto";

export const authRouter = createTRPCRouter({
  login: publicProcedure.input(loginCredentialSchema).mutation(async ({ input, ctx }) => {
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
  }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.res.clearCookie("token", { path: "/" });
    return { success: true, message: "Logged out Successfully" };
  }),

  createAdmin: publicProcedure.input(createAdminSchema).mutation(async ({ input }) => {
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
  }),

  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});
