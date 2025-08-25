// backend/trpc/fastify-jwt.d.ts
import "@fastify/jwt";
import "@fastify/cookie";

import type { UUIDTypes } from "uuid";

// Define the shape of your JWT payload
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      id: UUIDTypes; // User ID (UUID)
      email: string;
      role: "admin" | "vendor";
    };
    // The 'user' type is what gets attached to request.user after verification
    user: {
      id: UUIDTypes;
      email: string;
      role: "admin" | "vendor";
    };
  }
}

// Extend Fastify's core types to include properties from @fastify/jwt and @fastify/cookie
declare module "fastify" {
  interface FastifyReply {
    // reply.jwtSign() method is added by @fastify/jwt
    jwtSign: (
      payload: FastifyJWT["payload"], // Use the payload type defined above
      options?: import("@fastify/jwt").SignOptions, // Optional: for sign options like expiresIn
    ) => Promise<string>;

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
