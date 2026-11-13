import { validateBody, validateParams } from "#middleware";
import { idParamsSchema, productSchema } from "#schemas";
import { Router } from "express";

const productsRoutes = Router();

productsRoutes.get("/", (_req, res) => {
  res.json({ message: "GET products" });
});

productsRoutes.post("/", validateBody(productSchema), (_req, res) => {
  res.json({ message: "POST products" });
});

productsRoutes.get("/:id", validateParams(idParamsSchema), (_req, res) => {
  res.json({ message: "GET product by ID" });
});

productsRoutes.put(
  "/:id",
  validateParams(idParamsSchema),
  validateBody(productSchema),
  (_req, res) => {
    res.json({ message: "PUT product by ID" });
  },
);

productsRoutes.delete("/:id", validateParams(idParamsSchema), (_req, res) => {
  res.json({ message: "DELETE product by ID" });
});

export default productsRoutes;
