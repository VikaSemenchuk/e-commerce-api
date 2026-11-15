import { z } from "zod";

export const userSchema = z.strictObject({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
  email: z.string().trim().toLowerCase().pipe(z.email("Invalid email format")),
  password: z
    .string()
    .regex(/^\S+$/, "Password must not contain spaces")
    .min(8, "Password must be at least 8 characters long")
    .max(72, "Password is too long"),
});

export const userUpdateSchema = userSchema.omit({ password: true });

export type UserInputType = z.infer<typeof userSchema>;
export type UserUpdateType = z.infer<typeof userUpdateSchema>;
