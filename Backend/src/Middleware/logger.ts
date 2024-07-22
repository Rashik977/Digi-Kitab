import { NextFunction, Response } from "express";
import loggerNameSpace from "../Utils/logger";
import { Request } from "../Interfaces/Auth.interface";

const logger = loggerNameSpace("RequestLogger");

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  logger.info(`${req.method}: ${req.url}`);
  next();
}
