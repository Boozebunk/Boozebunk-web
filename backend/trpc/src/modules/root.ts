import { createTRPCRouter } from "@boozebunk-trpc/server/trpc";

import { authRouter } from "./auth/controller";
import { vendorRouter } from "./vendor/controller";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  vendor: vendorRouter,
});

export type AppRouter = typeof appRouter;
