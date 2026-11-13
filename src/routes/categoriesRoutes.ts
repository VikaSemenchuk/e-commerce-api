import { Router } from "express";
import { getCategorisList } from "#controllers";

const categoryRoutes = Router();

categoryRoutes.get("/", getCategorisList);

export default categoryRoutes;