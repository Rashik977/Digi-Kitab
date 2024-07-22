import { Schema } from "joi";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../Error/Error";

import loggerWithNameSpace from "../Utils/logger";

const logger = loggerWithNameSpace("ValidatorMiddleware");

// function to validate request query
export function validateReqQuery(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    logger.info("Validating query params");
    const { error, value } = schema.validate(req.query);

    if (error) {
      logger.error("Error validating query params", { error });
      next(new BadRequestError(error.message));
    }

    req.query = value;
    next();
  };
}

// function to validate request body
export function validateReqBody(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    logger.info("Validating request body");
    const { error, value } = schema.validate(req.body);

    if (error) {
      logger.error("Error validating request body", { error });
      next(new BadRequestError(error.message));
    }

    req.body = value;
    next();
  };
}

// function to validate request params
export function validateReqParams(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    logger.info("Validating request params");
    const { error, value } = schema.validate(req.params);

    if (error) {
      logger.error("Error validating request params", { error });
      next(new BadRequestError(error.message));
    }

    req.params = value;
    next();
  };
}
