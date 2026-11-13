import mongoose from "mongoose";
import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { HttpError, NotFoundError } from "#errors";

const isProd = process.env.NODE_ENV === "production";

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof NotFoundError || error instanceof HttpError) {
    res.status(error.status).json({ message: error.message });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      message: error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; "),
    });
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: `Invalid ${error.path}: ${error.value}` });
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      message: Object.values(error.errors)
        .map((e) => e.message)
        .join("; "),
    });
    return;
  }

  if (error instanceof Error && "type" in error) {
    switch (error.type) {
      case "entity.parse.failed":
        res
          .status(400)
          .json({ message: "Request-Body received invalid JSON." });
        return;
      case "entity.too.large":
        res.status(413).json({ message: "Request-Body is too large." });
        return;
      case "charset.unsupported":
      case "encoding.unsupported":
        res.status(415).json({
          message: "Request-Body uses an unsupported encoding.",
        });
        return;
    }
  }

  const message =
    !isProd && error instanceof Error ? error.message : "Internal Server Error";

  res.status(500).json({ message });
};
