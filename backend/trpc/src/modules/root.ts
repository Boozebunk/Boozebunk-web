import { createTRPCRouter } from "@boozebunk-trpc/server/trpc";

import { authRouter } from "./auth/controller";
import { vendorStockRouter } from "./stock/controller";
import { vendorRouter } from "./vendor/controller";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  vendor: vendorRouter,
  stock: vendorStockRouter,
});

export type AppRouter = typeof appRouter;
