import { NextFunction, Response } from "express";
import { Request } from "../Interfaces/Auth.interface";
import * as BookService from "../Services/book.services";

import loggerWithNameSpace from "../Utils/logger";
import HTTP from "http-status-codes";
import { Book, getBookQuery } from "../Interfaces/Book.interface";

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

export async function getBookById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    logger.info("Getting book by ID", { id: req.params.id });
    const { id } = req.params;
    res.status(HTTP.OK).json(await BookService.getBookById(+id));
  } catch (e) {
    logger.error("Error getting book by ID", { error: e });
    next(e);
  }
}

export const uploadBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = req.file;
    const bookDetails: Partial<Book> = req.body;
    logger.info("Uploading book", { file, bookDetails });
    if (file) {
      const result = await BookService.createBook(file, bookDetails);
      res.status(201).json(result);
    } else {
      throw new Error("No file uploaded");
    }
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const bookDetails: Partial<Book> = req.body;
    logger.info("Updating book", { id, bookDetails });
    const result = await BookService.updateBook(id, bookDetails);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    logger.info("Deleting book", { id });
    const result = await BookService.deleteBook(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
