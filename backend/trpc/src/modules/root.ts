import { createTRPCRouter } from "@boozebunk-trpc/server/trpc";

import { authRouter } from "./auth/controller";
import { responseHubRouter } from "./reshub/controller";
import { vendorStockRouter } from "./stock/controller";
import { vendorRouter } from "./vendor/controller";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  vendor: vendorRouter,
  stock: vendorStockRouter,
  reshub: responseHubRouter,
});

export type AppRouter = typeof appRouter;
