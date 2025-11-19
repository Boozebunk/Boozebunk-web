import "@fastify/jwt";
import "@fastify/cookie";

import type { UUIDTypes } from "uuid";

// Define the shape of your JWT payload and user object
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      id: UUIDTypes; // User ID (UUID)
      roleId: UUIDTypes;
      email: string;
      role: "admin" | "vendor";
    };
    user: {
      id: UUIDTypes;
      roleId: UUIDTypes;
      email: string;
      role: "admin" | "vendor";
    };
  }
}

// Extend Fastify's core types to include properties from @fastify/jwt and @fastify/cookie
declare module "fastify" {
  interface FastifyRequest {
    // FIX: jwtSign is attached to the Request object
    jwtSign: (
      payload: FastifyJWT["payload"],
      options?: import("@fastify/jwt").SignOptions,
    ) => Promise<string>;
  }

  interface FastifyReply {
    // setCookie and clearCookie remain correctly on the Reply object
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
