import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "#controllers";
import { validateBody, validateParams, validateQuery } from "#middleware";
import { idParamsSchema, productQuerySchema, productSchema } from "#schemas";
import { Router } from "express";

const productsRoutes = Router();

productsRoutes.get("/", validateQuery(productQuerySchema), getAllProducts);

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
