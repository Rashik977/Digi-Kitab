import { NextFunction, Request, Response } from "express";

import * as AuthServices from "../Services/auth.services";
import HTTP from "http-status-codes";
import loggerWithNameSpace from "../Utils/logger";

const logger = loggerWithNameSpace("AuthController");

// Function to register a new user
export async function login(req: Request, res: Response, next: NextFunction) {
  const { body } = req;
  try {
    logger.info("Logging in user", { email: body.email });
    const data = await AuthServices.login(body);
    res.status(HTTP.OK).json(data);
  } catch (e) {
    logger.error("Error logging in user", { error: e });
    next(e);
  }
}

// Function to refresh access token
export async function refresh(req: Request, res: Response, next: NextFunction) {
  const { body } = req;

  try {
    logger.info("Refreshing token");
    const data = await AuthServices.refresh(body);
    res.status(HTTP.CREATED).json(data);
  } catch (e) {
    logger.error("Error refreshing token", { error: e });
    next(e);
  }
}
