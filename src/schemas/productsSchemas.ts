import { z } from "zod";
import { idSchema } from "./shared.ts";

export const productSchema = z.strictObject({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(1, "Name is required"),
  description: z
    .string({ error: "Description is required" })
    .trim()
    .min(1, "Description is required"),
  price: z
    .number({ error: "Price is required" })
    .min(0, "Price must be positive"),
  categoryId: idSchema,
});

export type ProductInputType = z.infer<typeof productSchema>;