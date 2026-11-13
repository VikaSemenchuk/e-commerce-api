import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be positive"],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category ID is required"],
      index: true,
    },
  },
  { timestamps: true },
);

export const Product = model("Product", productSchema, "products");