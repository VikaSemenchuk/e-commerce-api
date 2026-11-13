import { z } from "zod";

export const idSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ID format" });

export const idParamsSchema = z.object({
  id: idSchema,
});

export type IdParamsType = z.infer<typeof idParamsSchema>;

// export const nameSchema = z.string().trim().min(1, { message: "Name is required" });