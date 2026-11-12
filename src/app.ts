import "#db";
import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? "*" }));
app.use(express.json());

app.get("/categories", (_req, res) => {
    res.json("Categories endpoint");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
