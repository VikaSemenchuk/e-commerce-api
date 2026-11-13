import { NotFoundError, HttpError } from "#errors";
import { Product, Category } from "#models";
import type { IdParamsType, ProductInputType } from "#schemas";
import type { RequestHandler } from "express";

//# GET /products
export const getAllProducts: RequestHandler = async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
};

// # POST /products
export const createProduct: RequestHandler<
  {},
  unknown,
  ProductInputType
> = async (req, res) => {
  const { body } = req;
  const newProduct = await Product.create(body);
  const categoryExists = await Category.exists({ _id: newProduct.categoryId });
  if (!categoryExists) throw new HttpError(400, "Category does not exist");
  res.status(201).json(newProduct);
};

// # GET /products/:id
export const getProductById: RequestHandler<IdParamsType> = async (
  req,
  res,
) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) throw new NotFoundError("Product");

  res.status(200).json(product);
};

// # PUT /products/:id
export const updateProduct: RequestHandler<
  IdParamsType,
  unknown,
  ProductInputType
> = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const updatedProduct = await Product.findByIdAndUpdate(id, body, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!updatedProduct) throw new NotFoundError("Product");
  const categoryExists = await Category.exists({
    _id: updatedProduct.categoryId,
  });

  if (!categoryExists) throw new HttpError(400, "Category does not exist");

  res.status(200).json(updatedProduct);
};

// # DELETE /products/:id
export const deleteProduct: RequestHandler<IdParamsType> = async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id);

  if (!deletedProduct) throw new NotFoundError("Product");
  res.status(200).json(deletedProduct);
};
