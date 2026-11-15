import { z } from "zod";
import { idSchema } from "./shared.ts";

export const orderItemSchema = z.strictObject({
  productId: idSchema,
  quantity: z
    .number({ error: "Quantity is required" })
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),
});

export const orderSchema = z.strictObject({
  userId: idSchema,
  products: z
    .array(orderItemSchema, { error: "Products are required" })
    .min(1, "Order must contain at least one product")
    .refine(
      (items) => new Set(items.map((i) => i.productId)).size === items.length,
      "Duplicate products are not allowed",
    ),
});

export const orderQuerySchema = z.strictObject({
  userId: idSchema.optional(),
});

export type OrderInputType = z.infer<typeof orderSchema>;
