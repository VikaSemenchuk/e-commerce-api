// import type { idSchema } from "#schemas/shared.ts";
import type { RequestHandler } from "express";
// import type { z } from "zod";
import type { ZodType } from "zod";

export const validateBody = (schema: ZodType): RequestHandler => {
  return (req, _res, next) => {
      const result = schema.safeParse(req.body);

      if(!result.success) {
          next(result.error);
         return
      }

      req.body = result.data;
    next();
  };
};
export const validateParams = (schema: ZodType): RequestHandler => {
  return (req, _res, next) => {
      const result = schema.safeParse(req.params);

      if(!result.success) {
          next(result.error);
         return
      }
    next();
  };
};


