import { z } from "zod";

export const createCategorySchema = z.strictObject({
  name: z.string().trim().min(1, "Name is required"),
});

export type CategoryInputType = z.infer<typeof createCategorySchema>;
