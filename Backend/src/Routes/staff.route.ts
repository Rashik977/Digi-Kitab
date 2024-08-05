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

// Route to get all staff
staffRoutes.get(
  "/",
  authenticate,
  authorize("staff.get"),
  validateReqQuery(getUserQuerySchema),
  getStaff
);

// Route to create a staff
staffRoutes.post(
  "/",
  authenticate,
  authorize("staff.post"),
  validateReqBody(createUserBodySchema),
  createStaff
);

// Route to update a staff
staffRoutes.put(
  "/:id",
  authenticate,
  authorize("staff.put"),
  validateReqParams(userIdSchema),
  validateReqBody(updateUserBodySchema),
  updateStaff
);

// Route to delete a staff
staffRoutes.delete(
  "/:id",
  authenticate,
  authorize("staff.delete"),
  validateReqParams(userIdSchema),
  deleteStaff
);

export default staffRoutes;
