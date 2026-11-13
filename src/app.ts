import "#db";
import express from "express";
import cors from "cors";
import { errorHandler } from "#middleware";
import { categoryRoutes, testRouter } from "#routes";


const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? "*" }));
app.use(express.json());



app.use("/categories", categoryRoutes);
app.use("/error", testRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
