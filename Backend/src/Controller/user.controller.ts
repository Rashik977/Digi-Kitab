import { NextFunction, Response } from "express";
import { Request } from "../Interfaces/Auth.interface";
import * as UserService from "../Services/user.services";

import loggerWithNameSpace from "../Utils/logger";
import HTTP from "http-status-codes";
import { getUserQuery } from "../Interfaces/User.interface";
import { Roles } from "../Constants/Roles";
import { UnauthorizedError } from "../Error/Error";

const logger = loggerWithNameSpace("UserController");

// Get all users
export async function getUsers(
  req: Request<any, any, any, getUserQuery>,
  res: Response,
  next: NextFunction
) {
  try {
    logger.info("Fetching all users");
    const { query } = req;
    res.status(HTTP.OK).json(await UserService.getUsers(query));
  } catch (e) {
    logger.error("Error fetching users", { error: e });
    next(e);
  }
}

// Create a new user
export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { body } = req;

  try {
    logger.info("Creating a new user", { user: body });
    const message = await UserService.createUser(body, req.user!);
    res.status(HTTP.CREATED).json(message);
  } catch (e) {
    logger.error("Error creating user", { error: e });
    next(e);
  }
}

// Update a user
export async function updateUsers(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  const id = parseInt(req.params.id);

  const userIdFromToken = req.user!.id;
  const userRoleFromToken = req.user!.role;
  const userIdFromParams = req.params.id;

  try {
    if (
      userRoleFromToken !== Roles.SUPER &&
      userIdFromToken.toString() !== userIdFromParams.toString()
    ) {
      throw new UnauthorizedError("Unauthorized");
    }

    logger.info("Updating user");
    const message = await UserService.updateUsers(id, req.body, req.user!);
    res.status(HTTP.OK).json(message);
  } catch (e) {
    logger.error("Error updating user", { error: e });
    next(e);
  }
}

// Delete a User
export async function deleteUsers(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  const id = parseInt(req.params.id);
  try {
    logger.info("Deleting user", { id });
    const message = await UserService.deleteUsers(id);
    res.status(HTTP.OK).json(message);
  } catch (e) {
    logger.error("Error deleting user", { error: e });
    next(e);
  }
}
