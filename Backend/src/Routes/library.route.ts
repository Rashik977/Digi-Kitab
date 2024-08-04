import express from "express";
import { authenticate, authorize } from "../Middleware/auth.middleware";
import { validateReqQuery } from "../Middleware/validator";
import { getBookQuerySchema } from "../Schema/book.schema";
import {
  endSession,
  getAllLibraryBooks,
  getBookChapters,
  getChapterContent,
  getCurrentChapterId,
  getLibrary,
  getTotalReadingTime,
  setCurrentChapterId,
  startSession,
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

libraryRoutes.post("/:bookId/start-session", authenticate, startSession);

// Route to end a reading session
libraryRoutes.post("/:bookId/end-session", authenticate, endSession);

libraryRoutes.get("/:bookId/reading-time", authenticate, getTotalReadingTime);

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
