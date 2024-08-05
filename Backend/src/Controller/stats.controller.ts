import { NextFunction, Response } from "express";
import { Request } from "../Interfaces/Auth.interface";
import * as StatsService from "../Services/stats.services";

import loggerWithNameSpace from "../Utils/logger";

const logger = loggerWithNameSpace("StatsController");

// function to start a reading session
export async function startSession(
  req: Request<{ bookId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { bookId } = req.params;
    const { user } = req;
    if (!user) throw new Error("User not found");

    logger.info(`Starting session for book ${bookId}`);
    await StatsService.startSession(parseInt(user.id), parseInt(bookId));

    res.status(200).json({ message: "Session started" });
  } catch (e) {
    logger.error(`Error starting session for book ${req.params.bookId}`, {
      error: e,
    });
    next(e);
  }
}

// function to end a reading session
export async function endSession(
  req: Request<{ bookId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { bookId } = req.params;
    const { user } = req;
    if (!user) throw new Error("User not found");

    logger.info(`Ending session for book ${bookId}`);
    await StatsService.endSession(parseInt(user.id), parseInt(bookId));

    res.status(200).json({ message: "Session ended" });
  } catch (e) {
    logger.error(`Error ending session for book ${req.params.bookId}`, {
      error: e,
    });
    next(e);
  }
}

// function to get the total reading time of a book
export async function getTotalReadingTime(
  req: Request<{ bookId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { bookId } = req.params;
    const { user } = req;
    if (!user) throw new Error("User not found");

    logger.info(`Getting total reading time for book ${bookId}`);
    const totalReadingTime = await StatsService.getTotalReadingTime(
      parseInt(user.id),
      parseInt(bookId)
    );

    res.status(200).json(totalReadingTime);
  } catch (e) {
    logger.error(
      `Error getting total reading time for book ${req.params.bookId}`,
      {
        error: e,
      }
    );
    next(e);
  }
}

// function to get the daily reading data
export async function getDailyReadingData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { user } = req;
    if (!user) throw new Error("User not found");

    logger.info(`Getting daily reading data for user ${user.id}`);
    const data = await StatsService.getDailyReadingData(parseInt(user.id));

    res.status(200).json(data);
  } catch (e) {
    logger.error(`Error getting daily reading data`, { error: e });
    next(e);
  }
}
