import { type FastifyCorsOptions } from "@fastify/cors";

export const CorsConfig: FastifyCorsOptions = {
  origin: [
    "http://localhost:3000",
    // Add your production frontend URL here
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-trpc-source", "X-Requested-With"],
  maxAge: 86400,
};
