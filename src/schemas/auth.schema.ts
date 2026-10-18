import { z } from "zod";

export const adminLoginSchema = z.object({
  username: z
    .string()
    .min(1, "Username atau email wajib diisi")
    .min(3, "Username minimal 3 karakter"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(6, "Password minimal 6 karakter"),
  rememberMe: z.boolean(),
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;
