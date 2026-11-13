import { z } from "zod";

export const idSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ID format: 24 symbols required" });

export const paramsSchema = z.object({
  id: idSchema,
});

// export const nameSchema = z.string().trim().min(1, { message: "Name is required" });