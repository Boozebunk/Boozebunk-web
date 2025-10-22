import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import type { Context } from "@boozebunk-trpc/server/context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

// call param - "path" while development
const timingMiddleware = t.middleware(async ({ next }) => {
  // const start = Date.now();

  const result = await next();

  // const end = Date.now();
  // console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});
export const publicProcedure = t.procedure.use(timingMiddleware);

export const authMiddleware = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "User not Authenticated" });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(authMiddleware);
