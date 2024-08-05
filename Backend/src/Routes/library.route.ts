import express from "express";
import { authenticate, authorize } from "../Middleware/auth.middleware";
import { validateReqQuery } from "../Middleware/validator";
import { getBookQuerySchema } from "../Schema/book.schema";
import {
  getAllLibraryBooks,
  getBookChapters,
  getChapterContent,
  getCurrentChapterId,
  getLibrary,
  setCurrentChapterId,
} from "../Controller/library.controller";

const libraryRoutes = express.Router();

// Route to get the library books of a user paginated
libraryRoutes.get(
  "/",
  authenticate,
  authorize("book.get"),
  validateReqQuery(getBookQuerySchema),
  getLibrary
);

// Route to get all library books
libraryRoutes.get(
  "/all",
  authenticate,
  authorize("book.get"),
  getAllLibraryBooks
);

// Route to set the current chapter ID for a book
libraryRoutes.post(
  "/:bookId/current-chapter",
  authenticate,
  setCurrentChapterId
);

// Route to get the current chapter ID for a book
libraryRoutes.get(
  "/:bookId/current-chapter",
  authenticate,
  authorize("book.get"),
  getCurrentChapterId
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
