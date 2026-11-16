import { createOrder, getOrders } from "#controllers";
import { validateBody, validateQuery } from "#middleware";
import { orderQuerySchema, orderSchema } from "#schemas";
import { Router } from "express";

const ordersRoutes = Router();

ordersRoutes.get("/", validateQuery(orderQuerySchema), getOrders);
ordersRoutes.post("/", validateBody(orderSchema), createOrder);

export default ordersRoutes;
