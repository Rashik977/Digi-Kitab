import { NextFunction, Response } from "express";
import { Request } from "../Interfaces/Auth.interface";
import * as BookService from "../Services/book.services";

import loggerWithNameSpace from "../Utils/logger";
import HTTP from "http-status-codes";
import { Book, getBookQuery } from "../Interfaces/Book.interface";

const logger = loggerWithNameSpace("BookController");

// function to get all books
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

// function to get book by ID
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

// function to upload a book
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

// function to update a book
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

// function to delete a book
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

// function to rate a book
export const rateBook = async (
  req: Request<{ user: { id: string } }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId, rating } = req.body;

    if (!req.user) {
      throw new Error("User not authenticated");
    }
    const userId = req.user.id;

    logger.info("Rating book", { bookId, rating, userId });

    await BookService.rateBook(bookId, parseInt(userId), rating);

    res.status(200).json({ message: "Book rated successfully" });
  } catch (error) {
    next(error);
  }
};

// function to get rating of a book
export const getRating = async (
  req: Request<{ user: { id: string }; bookId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error("User not authenticated");
    }
    const userId = req.user.id;

    const { bookId } = req.params;

    if (!bookId || !userId) {
      throw new Error("bookId and userId are required");
    }

    logger.info("Fetching rating", { bookId, userId });

    const rating = await BookService.getRating(
      parseInt(bookId),
      parseInt(userId)
    );

    res.status(200).json({ rating });
  } catch (error) {
    next(error);
  }
};
