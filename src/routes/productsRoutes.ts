import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "#controllers";
import { validateBody, validateParams } from "#middleware";
import { idParamsSchema, productSchema } from "#schemas";
import { Router } from "express";

const productsRoutes = Router();

productsRoutes.get("/", getAllProducts);
//! Products filter by category
productsRoutes.post("/", validateBody(productSchema), createProduct);
productsRoutes.get("/:id", validateParams(idParamsSchema), getProductById);
productsRoutes.put(
  "/:id",
  validateParams(idParamsSchema),
  validateBody(productSchema),
  updateProduct,
);
productsRoutes.delete("/:id", validateParams(idParamsSchema), deleteProduct);

export default productsRoutes;
