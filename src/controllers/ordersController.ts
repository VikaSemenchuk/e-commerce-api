import { Order } from "#models";
import type { RequestHandler } from "express";

export const getOrders: RequestHandler = async (req, res) => {
  const { userId } = req.query;

  const filter: Record<string, unknown> = {};
  if (userId) filter.userId = userId;
  const orders = await Order.find(filter);
  res.status(200).json(orders);
};
