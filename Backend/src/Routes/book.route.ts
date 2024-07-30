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

bookRoutes.get(
  "/",
  authenticate,
  authorize("book.get"),
  validateReqQuery(getBookQuerySchema),
  getBooks
);

bookRoutes.get(
  "/:id",
  authenticate,
  authorize("book.get"),
  validateReqParams(bookIdSchema),
  getBookById
);

bookRoutes.post(
  "/",
  authenticate,
  authorize("book.post"),
  upload.single("file"),
  uploadBook
);

bookRoutes.put(
  "/:id",
  authenticate,
  authorize("book.put"),
  validateReqParams(bookIdSchema),
  updateBook
);

bookRoutes.delete(
  "/:id",
  authenticate,
  authorize("book.delete"),
  validateReqParams(bookIdSchema),
  deleteBook
);

bookRoutes.post("/rate", authenticate, rateBook);
bookRoutes.get("/rating/:bookId", authenticate, getRating);

export default bookRoutes;
