import { z } from "zod";

export const loginCredentialSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(3, "Invalid password"),
  role: z.enum(["admin", "vendor"]),
});

export const createAdminSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(3, "invalid password"),
  role: z.enum(["admin", "vendor"]),
});

export type LoginCredentials = z.infer<typeof loginCredentialSchema>;
export type CreateAdminType = z.infer<typeof createAdminSchema>;
