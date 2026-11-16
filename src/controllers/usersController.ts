import type { RequestHandler } from "express";

import type { IdParamsType, UserInputType, UserUpdateType } from "#schemas";
import { Order, User } from "#models";
import { HttpError, NotFoundError } from "#errors";

// # GET /users
export const getAllUsers: RequestHandler = async (_req, res) => {
  const usersList = await User.find();
  res.status(200).json(usersList);
};

// # POST /users
export const createUser: RequestHandler<{}, unknown, UserInputType> = async (
  req,
  res,
) => {
  const { body } = req;

  const emailTaken = await User.exists({ email: body.email });
  if (emailTaken) throw new HttpError(409, "Email already in use");

  const newUser = await User.create(body);
  res.status(201).json(newUser);
};

// # GET by Id
export const getUserById: RequestHandler<IdParamsType> = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) throw new NotFoundError("User");
  res.status(200).json(user);
};

// # PUT by Id
export const updateUser: RequestHandler<
  IdParamsType,
  unknown,
  UserUpdateType
> = async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const emailTaken = await User.exists({ email: body.email, _id: { $ne: id } });
  if (emailTaken) throw new HttpError(409, "Email already in use");

  const updatedUser = await User.findByIdAndUpdate(id, body, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!updatedUser) throw new NotFoundError("User");
  res.status(200).json(updatedUser);
};

// # Delete by Id
export const deleteUser: RequestHandler<IdParamsType> = async (req, res) => {
  const { id } = req.params;

  const hasOrder = await Order.exists({ userId: id });
  if (hasOrder)
    throw new HttpError(409, "User has orders and cannot be deleted");

  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) throw new NotFoundError("User");
  res.status(200).json(deletedUser);
};
