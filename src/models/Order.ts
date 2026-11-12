import { Schema, model } from "mongoose";

const orderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product's id is required"],
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Product's price is required"],
      min: [1, "Product's price must be positive"],
    },
    quantity: {
      type: Number,
      required: [true, "Product's quantity is required"],
      min: [1, "Product's quantity must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Product's quantity must be an integer",
      },
    },
  },
  {
    _id: false,
  },
);

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User's id is required"],
      index: true,
    },
    products: {
      type: [orderItemSchema],
      validate: {
        validator: (items: unknown[]) => items.length > 0,
        message: "Order must contain at least one product",
      },
    },
    total: {
      type: Number,
      required: [true, "Total is required"],
      min: [1, "Total must be positive"],
      validate: {
        validator: Number.isInteger,
        message: "Product's ttotal must be an integer",
      },
    },
  },
  {
    timestamps: true,
  },
);

export const Order = model("Order", orderSchema, "orders");
