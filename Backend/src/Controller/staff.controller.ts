import { NextFunction, Response } from "express";
import { Request } from "../Interfaces/Auth.interface";
import * as StaffService from "../Services/staff.services";

import loggerWithNameSpace from "../Utils/logger";
import HTTP from "http-status-codes";
import { getUserQuery } from "../Interfaces/User.interface";
import { Roles } from "../Constants/Roles";
import { UnauthorizedError } from "../Error/Error";

const logger = loggerWithNameSpace("StaffController");

// Get all Staff
export async function getStaff(
  req: Request<any, any, any, getUserQuery>,
  res: Response,
  next: NextFunction
) {
  try {
    logger.info("Fetching all staff");
    const { query } = req;
    res.status(HTTP.OK).json(await StaffService.getStaff(query));
  } catch (e) {
    logger.error("Error fetching Staff", { error: e });
    next(e);
  }
}

// Create a new staff
export async function createStaff(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { body } = req;

  try {
    logger.info("Creating a new Staff", { user: body });
    const message = await StaffService.createStaff(body, req.user!);
    res.status(HTTP.CREATED).json(message);
  } catch (e) {
    logger.error("Error creating Staff", { error: e });
    next(e);
  }
}

// Update a staff
export async function updateStaff(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  const id = parseInt(req.params.id);

  const userRoleFromToken = req.user!.role;

  try {
    if (userRoleFromToken !== Roles.SUPER) {
      throw new UnauthorizedError("Unauthorized");
    }

    logger.info("Updating staff");
    const message = await StaffService.updateStaff(id, req.body, req.user!);
    res.status(HTTP.OK).json(message);
  } catch (e) {
    logger.error("Error updating staff", { error: e });
    next(e);
  }
}

// Delete a Staff
export async function deleteStaff(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  const id = parseInt(req.params.id);
  try {
    logger.info("Deleting staff", { id });
    const message = await StaffService.deleteStaff(id);
    res.status(HTTP.OK).json(message);
  } catch (e) {
    logger.error("Error deleting staff", { error: e });
    next(e);
  }
}
