import { NextFunction, Response } from "express";
import { Request } from "../Interfaces/Auth.interface";
import * as LibraryService from "../Services/library.services";

import loggerWithNameSpace from "../Utils/logger";
import HTTP from "http-status-codes";
import { getBookQuery } from "../Interfaces/Book.interface";

const logger = loggerWithNameSpace("UserController");

export async function getLibrary(
  req: Request<any, any, any, getBookQuery>,
  res: Response,
  next: NextFunction
) {
  try {
    logger.info("Getting books", { query: req.query });
    const { query, user } = req;
    if (!user) throw new Error("User not found");
    res
      .status(HTTP.OK)
      .json(await LibraryService.getLibrary(parseInt(user?.id), query));
  } catch (e) {
    logger.error("Error getting books", { error: e });
    next(e);
  }
}

export async function getAllLibraryBooks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    logger.info("Getting all library books");
    const { user } = req;
    if (!user) throw new Error("User not found");
    res
      .status(HTTP.OK)
      .json(await LibraryService.getAllLibraryBooks(parseInt(user?.id)));
  } catch (e) {
    logger.error("Error getting all library books", { error: e });
    next(e);
  }
}
