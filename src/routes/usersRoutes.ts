import { Router } from "express";

import { validateBody, validateParams } from "#middleware";
import { idParamsSchema, userSchema, userUpdateSchema } from "#schemas";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "#controllers";

const usersRoutes = Router();

usersRoutes.get("/", getAllUsers);
usersRoutes.post("/", validateBody(userSchema), createUser);
usersRoutes.get("/:id", validateParams(idParamsSchema), getUserById);
usersRoutes.put(
  "/:id",
  validateParams(idParamsSchema),
  validateBody(userUpdateSchema),
  updateUser,
);
usersRoutes.delete("/:id", validateParams(idParamsSchema), deleteUser);

export default usersRoutes;
