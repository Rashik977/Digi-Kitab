import { NextFunction, Response } from "express";
import { Request } from "../Interfaces/Auth.interface";
import * as LibraryService from "../Services/library.services";

import loggerWithNameSpace from "../Utils/logger";
import HTTP from "http-status-codes";
import { getBookQuery } from "../Interfaces/Book.interface";

const logger = loggerWithNameSpace("UserController");

export async function getLibrary(
  req: Request<any, any, any, getBookQuery>,
  res: Response,
  next: NextFunction
) {
  try {
    logger.info("Getting books", { query: req.query });
    const { query, user } = req;
    if (!user) throw new Error("User not found");
    res
      .status(HTTP.OK)
      .json(await LibraryService.getLibrary(parseInt(user?.id), query));
  } catch (e) {
    logger.error("Error getting books", { error: e });
    next(e);
  }
}

export async function getAllLibraryBooks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    logger.info("Getting all library books");
    const { user } = req;
    if (!user) throw new Error("User not found");
    res
      .status(HTTP.OK)
      .json(await LibraryService.getAllLibraryBooks(parseInt(user?.id)));
  } catch (e) {
    logger.error("Error getting all library books", { error: e });
    next(e);
  }
}

export async function getChapterContent(
  req: Request<{ bookId: string; chapterId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { bookId, chapterId } = req.params;
    const { user } = req;
    if (!user) throw new Error("User not found");

    logger.info(`Getting content for chapter ${chapterId} of book ${bookId}`);
    const chapterContent = await LibraryService.getChapterContentService(
      parseInt(user.id),
      parseInt(bookId),
      chapterId
    );

    res.status(200).json(chapterContent);
  } catch (e) {
    logger.error(
      `Error getting content for chapter ${req.params.chapterId} of book ${req.params.bookId}`,
      {
        error: e,
      }
    );
    next(e);
  }
}

export async function getBookChapters(
  req: Request<{ bookId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { bookId } = req.params;
    const { user } = req;
    if (!user) throw new Error("User not found");

    logger.info(`Getting chapters for book ${bookId}`);
    const chapters = await LibraryService.getBookChaptersService(
      parseInt(user.id),
      parseInt(bookId)
    );

    res.status(200).json(chapters);
  } catch (e) {
    logger.error(`Error getting chapters for book ${req.params.bookId}`, {
      error: e,
    });
    next(e);
  }
}

export async function setCurrentChapterId(
  req: Request<{ bookId: string }, any, { chapterId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { bookId } = req.params;
    const { chapterId } = req.body;
    const { user } = req;
    if (!user) throw new Error("User not found");

    logger.info(`Setting current chapter for book ${bookId} to ${chapterId}`);
    await LibraryService.setCurrentChapterId(
      parseInt(user.id),
      parseInt(bookId),
      chapterId
    );

    res.status(200).json({ message: "Current chapter set" });
  } catch (e) {
    logger.error(
      `Error setting current chapter for book ${req.params.bookId}`,
      {
        error: e,
      }
    );
    next(e);
  }
}

export async function getCurrentChapterId(
  req: Request<{ bookId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { bookId } = req.params;
    const { user } = req;
    if (!user) throw new Error("User not found");

    logger.info(`Getting current chapter for book ${bookId}`);
    const currentChapter = await LibraryService.getCurrentChapterId(
      parseInt(user.id),
      parseInt(bookId)
    );

    res.status(200).json(currentChapter);
  } catch (e) {
    logger.error(
      `Error getting current chapter for book ${req.params.bookId}`,
      {
        error: e,
      }
    );
    next(e);
  }
}

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
    await LibraryService.startSession(parseInt(user.id), parseInt(bookId));

    res.status(200).json({ message: "Session started" });
  } catch (e) {
    logger.error(`Error starting session for book ${req.params.bookId}`, {
      error: e,
    });
    next(e);
  }
}

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
    await LibraryService.endSession(parseInt(user.id), parseInt(bookId));

    res.status(200).json({ message: "Session ended" });
  } catch (e) {
    logger.error(`Error ending session for book ${req.params.bookId}`, {
      error: e,
    });
    next(e);
  }
}

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
    const totalReadingTime = await LibraryService.getTotalReadingTime(
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

export async function getDailyReadingData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { user } = req;
    if (!user) throw new Error("User not found");

    logger.info(`Getting daily reading data for user ${user.id}`);
    const data = await LibraryService.getDailyReadingData(parseInt(user.id));

    res.status(200).json(data);
  } catch (e) {
    logger.error(`Error getting daily reading data`, { error: e });
    next(e);
  }
}
