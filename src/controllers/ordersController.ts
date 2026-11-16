import type { RequestHandler } from "express";

import { type IdParamsType, type OrderInputType } from "#schemas";
import { Order, Product, User } from "#models";
import { HttpError, NotFoundError } from "#errors";

type OrderProductItemType = {
  productId: string;
  quantity: number;
  priceAtPurchase: number;
};

type OrderOutputType = {
  userId: string;
  products: OrderProductItemType[];
  total: number;
};

const populateProduct = {
  path: "products.currentProduct",
  select: "name description price categoryId",
  populate: { path: "categoryId", select: "name" },
};

const buildOrderData = async (
  body: OrderInputType,
): Promise<OrderOutputType> => {
  const { userId, products } = body;

  const userExists = await User.exists({ _id: userId });
  if (!userExists) throw new HttpError(400, "User does not exist");

  const ids = products.map((product) => product.productId);
  const foundProducts = await Product.find({ _id: { $in: ids } });

  const priceById = new Map(
    foundProducts.map((product) => [product._id.toString(), product.price]),
  );

  const items = products.map((product) => {
    const { productId, quantity } = product;
    const priceAtPurchase = priceById.get(productId);

    if (priceAtPurchase === undefined)
      throw new HttpError(400, "Product does not exist");

    return { productId, quantity, priceAtPurchase };
  });

  const total =
    Math.round(
      items.reduce(
        (sum, item) => sum + item.priceAtPurchase * item.quantity,
        0,
      ) * 100,
    ) / 100;

  return { userId, products: items, total };
};

// # GET
export const getOrders: RequestHandler = async (req, res) => {
  const { userId } = req.query;

  const filter: Record<string, unknown> = {};
  if (userId) filter.userId = userId;
  const orders = await Order.find(filter).populate(populateProduct);
  res.status(200).json(orders);
};

// # POST
export const createOrder: RequestHandler<{}, unknown, OrderInputType> = async (
  req,
  res,
) => {
  const orderData = await buildOrderData(req.body);
  const newOrder = await Order.create(orderData);
  await newOrder.populate(populateProduct);

  res.status(201).json(newOrder);
};

// # GET by ID
export const getOrderById: RequestHandler<IdParamsType> = async (req, res) => {
  const { id } = req.params;

  const orderById = await Order.findById(id).populate(populateProduct);
  if (!orderById) throw new NotFoundError("Order");

  res.status(200).json(orderById);
};

// # PUT
export const updateOrder: RequestHandler<
  IdParamsType,
  unknown,
  OrderInputType
> = async (req, res) => {
  const { id } = req.params;
  const orderData = await buildOrderData(req.body);

  const updatedOrder = await Order.findByIdAndUpdate(id, orderData, {
    returnDocument: "after",
    runValidators: true,
  }).populate(populateProduct);

  if (!updatedOrder) throw new NotFoundError("Order");

  res.status(200).json(updatedOrder);
};

// # DELETE
export const deleteOrder: RequestHandler<IdParamsType> = async (req, res) => {
  const { id } = req.params;

  const deletedOrder =
    await Order.findByIdAndDelete(id).populate(populateProduct);

  if (!deletedOrder) throw new NotFoundError("Order");

  res.status(200).json(deletedOrder);
};
