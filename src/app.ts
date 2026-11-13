import "#db";
import express from "express";
import cors from "cors";

import { categoryRoutes, testRouter } from "#routes";
import { NotFoundError } from "#errors";
import { errorHandler } from "#middleware";


const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? "*" }));
app.use(express.json());

app.use("/categories", categoryRoutes);
app.use("/error", testRouter);

app.use((_req, _res, next) => { 
next(new NotFoundError("Route"))
})

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
