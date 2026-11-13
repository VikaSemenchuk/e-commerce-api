import type { RequestHandler } from "express";

export const getCategoriesList: RequestHandler = async (req, res) => { 
    res.json({ message: "Get categories list" });
}
export const createCategory: RequestHandler = async (req, res) => { 
    res.json({ message: "Create category" });
}

export const getCategoryById: RequestHandler = async (req, res) => {
  res.json({ message: "Get category by ID" });
};
export const updateCategory: RequestHandler = async (req, res) => { 
    console.log(req.body)
    res.json({ message: "Update category" });

}
export const deleteCategory: RequestHandler = async (req, res) => { 
    console.log(req.body)
    res.json({ message: "Delete category" });
}

