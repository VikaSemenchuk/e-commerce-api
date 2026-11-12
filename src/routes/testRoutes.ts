import { Router } from "express";

const testRouter = Router();

testRouter.get("/test", () => {
  throw new Error("Test 500 error");
});

export default testRouter;