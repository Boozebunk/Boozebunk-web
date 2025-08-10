import db from "@boozebunk-trpc/db";
import { userTable } from "@boozebunk-trpc/db/schema/auth/user";
import { createTRPCRouter, publicProcedure } from "@boozebunk-trpc/server/trpc";
import { verifyPassword } from "@boozebunk-trpc/utils/authUtils";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { loginCredentialSchema } from "./dto";

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

    //Generating JWT token
    const token = await ctx.req.jwt.sign({
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
});
