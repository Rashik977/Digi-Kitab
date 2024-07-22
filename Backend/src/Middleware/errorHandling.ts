import { Request, Response, NextFunction } from "express";
import { BaseError } from "../Error/Error";

import loggerWithNameSpace from "../Utils/logger";

const logger = loggerWithNameSpace("ErrorHandling");

// Error handler middleware
export function errorHandler(
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  logger.error("Handling error", { statusCode, message, error: err });
  res.status(statusCode).json({
    error: {
      message,
      statusCode,
    },
  });
}
