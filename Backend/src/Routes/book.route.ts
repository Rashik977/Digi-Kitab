import express from "express";
import { authenticate, authorize } from "../Middleware/auth.middleware";
import { getBooks } from "../Controller/book.controller";
import { validateReqQuery } from "../Middleware/validator";
import { getBookQuerySchema } from "../Schema/book.schema";

const bookRoutes = express.Router();

bookRoutes.get(
  "/",
  authenticate,
  authorize("book.get"),
  validateReqQuery(getBookQuerySchema),
  getBooks
);

export default bookRoutes;
