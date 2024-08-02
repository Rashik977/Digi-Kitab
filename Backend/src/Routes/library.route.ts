import express from "express";
import { authenticate, authorize } from "../Middleware/auth.middleware";
import { validateReqQuery } from "../Middleware/validator";
import { getBookQuerySchema } from "../Schema/book.schema";
import {
  getAllLibraryBooks,
  getBookChapters,
  getChapterContent,
  getLibrary,
} from "../Controller/library.controller";

const libraryRoutes = express.Router();

libraryRoutes.get(
  "/",
  authenticate,
  authorize("book.get"),
  validateReqQuery(getBookQuerySchema),
  getLibrary
);

libraryRoutes.get(
  "/all",
  authenticate,
  authorize("book.get"),
  getAllLibraryBooks
);

// Routes for getting all chapters of a book
libraryRoutes.get(
  "/:bookId/chapters",
  authenticate,
  authorize("book.get"),
  getBookChapters
);

// Routes for getting specific chapter content
libraryRoutes.get(
  "/:bookId/:chapterId",
  authenticate,
  authorize("book.get"),
  getChapterContent
);

export default libraryRoutes;
