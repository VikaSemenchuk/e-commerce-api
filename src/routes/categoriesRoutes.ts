import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategoriesList,
  getCategoryById,
  updateCategory,
} from "#controllers";
import { validateBody, validateParams } from "#middleware";
import { categorySchema, idParamsSchema } from "#schemas";

const categoryRoutes = Router();

categoryRoutes.get("/", getCategoriesList);
categoryRoutes.post("/", validateBody(categorySchema), createCategory);
categoryRoutes.get("/:id", validateParams(idParamsSchema), getCategoryById);
categoryRoutes.put(
  "/:id",
  validateParams(idParamsSchema),
  validateBody(categorySchema),
  updateCategory,
);
categoryRoutes.delete("/:id", validateParams(idParamsSchema), deleteCategory);

export default categoryRoutes;
