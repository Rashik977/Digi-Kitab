import express from "express";
import {
  createStaff,
  getStaff,
  updateStaff,
  deleteStaff,
} from "../Controller/staff.controller";
import { authenticate, authorize } from "../Middleware/auth.middleware";
import {
  validateReqBody,
  validateReqParams,
  validateReqQuery,
} from "../Middleware/validator";
import {
  createUserBodySchema,
  getUserQuerySchema,
  updateUserBodySchema,
  userIdSchema,
} from "../Schema/user.schema";

const staffRoutes = express.Router();
staffRoutes.get(
  "/",
  authenticate,
  authorize("staff.get"),
  validateReqQuery(getUserQuerySchema),
  getStaff
);

staffRoutes.post(
  "/",
  authenticate,
  authorize("staff.post"),
  validateReqBody(createUserBodySchema),
  createStaff
);

staffRoutes.put(
  "/:id",
  authenticate,
  authorize("staff.put"),
  validateReqParams(userIdSchema),
  validateReqBody(updateUserBodySchema),
  updateStaff
);

staffRoutes.delete(
  "/:id",
  authenticate,
  authorize("staff.delete"),
  validateReqParams(userIdSchema),
  deleteStaff
);

export default staffRoutes;
