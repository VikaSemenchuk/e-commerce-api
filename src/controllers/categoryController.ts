import type { RequestHandler } from "express";

export const getCategorisList: RequestHandler = async (req, res) => { 
    res.json({ message: "Get categories list" });
}