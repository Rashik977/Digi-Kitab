import express from "express";
import { authenticate, authorize } from "../Middleware/auth.middleware";
import {
  deleteBook,
  getBookById,
  getBooks,
  getRating,
  rateBook,
  updateBook,
  uploadBook,
} from "../Controller/book.controller";
import { validateReqParams, validateReqQuery } from "../Middleware/validator";
import { bookIdSchema, getBookQuerySchema } from "../Schema/book.schema";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const bookRoutes = express.Router();

// Route to get all books
bookRoutes.get(
  "/",
  authenticate,
  authorize("book.get"),
  validateReqQuery(getBookQuerySchema),
  getBooks
);

// Route to get a book by ID
bookRoutes.get(
  "/:id",
  authenticate,
  authorize("book.get"),
  validateReqParams(bookIdSchema),
  getBookById
);

// Route to upload a book
bookRoutes.post(
  "/",
  authenticate,
  authorize("book.post"),
  upload.single("file"),
  uploadBook
);

// Route to update a book
bookRoutes.put(
  "/:id",
  authenticate,
  authorize("book.put"),
  validateReqParams(bookIdSchema),
  updateBook
);

// Route to delete a book
bookRoutes.delete(
  "/:id",
  authenticate,
  authorize("book.delete"),
  validateReqParams(bookIdSchema),
  deleteBook
);

// Route to rate a book
bookRoutes.post("/rate", authenticate, rateBook);

// Route to get the rating of a book
bookRoutes.get("/rating/:bookId", authenticate, getRating);

export default bookRoutes;
