import { z } from "zod";

export const loginCredentialSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(3, "Invalid password"),
  role: z.enum(["ADMIN", "VENDOR"]),
});

export type LoginCredentials = z.infer<typeof loginCredentialSchema>;
