import { Router } from "express"

const usersRoutes = Router()

usersRoutes.get("/", (req, res) => { 
    res.json("Users get")
})
usersRoutes.post("/", (req, res) => { 
    res.json("Users post")
})
usersRoutes.get("/:id", (req, res) => { 
    res.json("Users get by ID")
})
usersRoutes.put("/:id", (req, res) => { 
    res.json("Users put")
})
usersRoutes.delete("/:id", (req, res) => { 
    res.json("Users delete")
})

export default usersRoutes;