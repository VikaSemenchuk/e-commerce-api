import { Router } from "express";
import { validateBody, validateParams } from "#middleware";
import { categorySchema, idParamsSchema } from "#schemas";
import {
  createCategory,
  deleteCategory,
  getCategoriesList,
  getCategoryById,
  updateCategory,
} from "#controllers";

const categoriesRoutes = Router();

categoriesRoutes.get("/", getCategoriesList);
categoriesRoutes.post("/", validateBody(categorySchema), createCategory);
categoriesRoutes.get("/:id", validateParams(idParamsSchema), getCategoryById);
categoriesRoutes.put(
  "/:id",
  validateParams(idParamsSchema),
  validateBody(categorySchema),
  updateCategory,
);
categoriesRoutes.delete("/:id", validateParams(idParamsSchema), deleteCategory);

export default categoriesRoutes;
