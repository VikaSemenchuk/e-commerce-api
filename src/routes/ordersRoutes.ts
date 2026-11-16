import { Router } from "express";

import { validateBody, validateParams, validateQuery } from "#middleware";
import { idParamsSchema, orderQuerySchema, orderSchema } from "#schemas";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrder,
} from "#controllers";

const ordersRoutes = Router();

ordersRoutes.get("/", validateQuery(orderQuerySchema), getOrders);
ordersRoutes.post("/", validateBody(orderSchema), createOrder);
ordersRoutes.get("/:id", validateParams(idParamsSchema), getOrderById);
ordersRoutes.put(
  "/:id",
  validateParams(idParamsSchema),
  validateBody(orderSchema),
  updateOrder,
);
ordersRoutes.delete("/:id", validateParams(idParamsSchema), deleteOrder);

export default ordersRoutes;
