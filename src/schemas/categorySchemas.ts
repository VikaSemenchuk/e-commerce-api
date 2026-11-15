import { z } from "zod";

export const categorySchema = z.strictObject({
  name: z.string().trim().min(1, "Name is required"),
});

export type CategoryInputType = z.infer<typeof categorySchema>;
