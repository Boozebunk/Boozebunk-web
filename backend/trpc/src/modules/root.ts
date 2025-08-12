import { createTRPCRouter } from "@boozebunk-trpc/server/trpc";

import { authRouter } from "./auth/controller";

export const appRouter = createTRPCRouter({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
