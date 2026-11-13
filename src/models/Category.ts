import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Category name is required"],
      unique: true,
    },
  },
  { timestamps: true },
);

export const Category = model("Category", categorySchema, "categories");
