import type { RequestHandler } from "express";
import type { CategoryInputType, IdParamsType } from "#schemas";
import { Category } from "#models";
import {  NotFoundError } from "#errors";

// #GET /categories
export const getCategoriesList: RequestHandler = async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
};
// #POST /categories
export const createCategory: RequestHandler<
  {},
  unknown,
  CategoryInputType
> = async (req, res) => {
  const { body } = req;
  const newCategory = await Category.create(body);
  res.status(201).json(newCategory);
};
// #GET /categories/:id
export const getCategoryById: RequestHandler<IdParamsType> = async (
  req,
  res,
) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) throw new NotFoundError("Category");
  res.status(200).json(category);
};
// #PUT /categories/:id
export const updateCategory: RequestHandler<
  IdParamsType,
  unknown,
  CategoryInputType
> = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const updatedCategory = await Category.findByIdAndUpdate(id, body, {
    returnDocument: "after",
    validator: true,
  });
  if (!updatedCategory) throw new NotFoundError("Category");

  res.status(200).json(updatedCategory);
};
// #DELETE /categories/:id
export const deleteCategory: RequestHandler<IdParamsType> = async (
  req,
  res,
) => {
  const { id } = req.params;
  const deletedCategory = await Category.findByIdAndDelete(id);
  if (!deletedCategory) throw new NotFoundError("Category");
  res.status(200).json(deletedCategory);
};
