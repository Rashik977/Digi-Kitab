import express from "express";
import { authenticate, authorize } from "../Middleware/auth.middleware";
import { validateReqQuery } from "../Middleware/validator";
import { getBookQuerySchema } from "../Schema/book.schema";
import {
  getAllLibraryBooks,
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

export default libraryRoutes;
