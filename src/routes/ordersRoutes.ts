import { createOrder, deleteOrder, getOrderById, getOrders, updateOrder } from "#controllers";
import { validateBody, validateParams, validateQuery } from "#middleware";
import { idParamsSchema, orderQuerySchema, orderSchema } from "#schemas";
import { Router } from "express";

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
