import { getOrders } from "#controllers";
import { Router } from "express";

const ordersRoutes = Router();

ordersRoutes.get("/", getOrders);

export default ordersRoutes;
