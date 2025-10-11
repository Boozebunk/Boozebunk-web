import { createTRPCRouter } from "@boozebunk-trpc/server/trpc";

import { analyticsRouter } from "./analytics/controller";
import { authRouter } from "./auth/controller";
import { bannerRouter } from "./banner/controller";
import { blogRouter } from "./blog/controller";
import { customerRouter } from "./customer/controller";
import { responseHubRouter } from "./reshub/controller";
import { vendorStockRouter } from "./stock/controller";
import { vendorRouter } from "./vendor/controller";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  vendor: vendorRouter,
  stock: vendorStockRouter,
  reshub: responseHubRouter,
  analytics: analyticsRouter,
  customer: customerRouter,
  banner: bannerRouter,
  blog: blogRouter,
});

export type AppRouter = typeof appRouter;
