import { NextFunction, Response } from "express";
import { Request } from "../Interfaces/Auth.interface";
import * as BookService from "../Services/book.services";

import loggerWithNameSpace from "../Utils/logger";
import HTTP from "http-status-codes";
import { getBookQuery } from "../Interfaces/Book.interface";

const logger = loggerWithNameSpace("UserController");

export async function getBooks(
  req: Request<any, any, any, getBookQuery>,
  res: Response,
  next: NextFunction
) {
  try {
    logger.info("Getting books", { query: req.query });
    const { query } = req;
    res.status(HTTP.OK).json(await BookService.getBooks(query));
  } catch (e) {
    logger.error("Error getting books", { error: e });
    next(e);
  }
}
