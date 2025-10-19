import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { headers as nextHeaders } from "next/headers";
import superjson from "superjson";

import type { appRouter } from "@boozebunk-trpc/modules/root";

type HeadersInit = Record<string, string>;

// IMPORTANT: Define the type of your App Router (assuming it's exported from your backend package)
type AppRouter = typeof appRouter;

// We create a server-side client that lives *only* in server components.
// It uses `httpBatchLink` but forwards the incoming request headers (especially the cookie)
export const api = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:8080/api/trpc",
      transformer: superjson,
      // CRITICAL: This function runs on the server and attaches the cookie/auth header
      // from the incoming request to the outgoing tRPC request.
      async headers() {
        // Next.js headers() function only works in Server Components/Actions.
        // It provides the request headers.
        const headerStore = await nextHeaders();
        const headersToForward: HeadersInit = {};

        // Forward essential headers, especially the cookie containing the session token
        const cookieHeader = headerStore.get("cookie");
        if (cookieHeader) {
          headersToForward["cookie"] = cookieHeader;
        }

        return headersToForward;
      },
    }),
  ],
});
