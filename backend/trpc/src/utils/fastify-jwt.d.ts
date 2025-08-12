// backend/trpc/fastify-jwt.d.ts
import "@fastify/jwt";
import "@fastify/cookie";

// Define the shape of your JWT payload
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      id: string; // User ID (UUID)
      email: string;
      role: "admin" | "vendor";
    };
    // The 'user' type is what gets attached to request.user after verification
    user: {
      id: string;
      email: string;
      role: "admin" | "vendor";
    };
  }
}

// Extend Fastify's core types to include properties from @fastify/jwt and @fastify/cookie
declare module "fastify" {
  interface FastifyReply {
    // reply.jwtSign() method is added by @fastify/jwt
    setCookie: (
      name: string,
      value: string,
      options?: import("@fastify/cookie").FastifyCookieOptions,
    ) => FastifyReply;
    clearCookie: (
      name: string,
      options?: import("@fastify/cookie").FastifyCookieOptions,
    ) => FastifyReply;
  }
}
