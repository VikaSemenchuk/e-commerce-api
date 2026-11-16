import type { RequestHandler } from "express";
import { NotFoundError } from "#errors";
import { Order, Product, User } from "#models";
import { type OrderInputType, type OrderItemType } from "#schemas";

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

const builtOrderData = async (
  body: OrderInputType,
): Promise<OrderOutputType> => {
  const { userId, products } = body;

  const userExists = await User.exists({ _id: userId });
  if (!userExists) throw new NotFoundError("User");

  const ids = products.map((product: OrderItemType) => product.productId);
  const foundProducts = await Product.find({ _id: { $in: ids } });

  const priceById = new Map(
    foundProducts.map((product) => [product._id.toString(), product.price]),
  );

  const items = products.map((product: OrderItemType) => {
    const { productId, quantity } = product;
    const priceAtPurchase = priceById.get(productId);

    if (priceAtPurchase === undefined)
      throw new NotFoundError(`Product ${productId}`);

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
  const orders = await Order.find(filter);
  res.status(200).json(orders);
};

// # POST
export const createOrder: RequestHandler = async (req, res) => {
  const orderData = await builtOrderData(req.body);
  const newOrder = await Order.create(orderData);

  res.status(201).json(newOrder);
};

// # GET by ID
export const getOrderById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const orderById = await Order.findById(id);
  if (!orderById) throw new NotFoundError("Order");

  res.status(200).json(orderById);
};

// # PUT
export const updateOrder: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const orderData = await builtOrderData(req.body);

  const updatedOrder = await Order.findByIdAndUpdate(id, orderData, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!updateOrder) throw new NotFoundError("Order");

  res.status(200).json(updatedOrder);
};

// # DELETE
export const deleteOrder: RequestHandler = async (req, res) => {
   const { id } = req.params;

   const deletedOrder = await Order.findByIdAndDelete(id);
   if (!deletedOrder) throw new NotFoundError("Order");

   res.status(200).json(deletedOrder);
};
