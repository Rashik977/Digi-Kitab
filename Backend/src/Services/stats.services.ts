import { NotFoundError } from "../Error/Error";
import * as StatsModel from "../Model/stats.model";

// Start a new reading session
export const startSession = async (userId: number, bookId: number) => {
  await StatsModel.StatsModel.startSession(userId, bookId);
};

// End a reading session
export const endSession = async (userId: number, bookId: number) => {
  await StatsModel.StatsModel.endSession(userId, bookId);
};

// Get the total reading time of a book
export const getTotalReadingTime = async (userId: number, bookId: number) => {
  const sessions = await StatsModel.StatsModel.getTotalReadingTime(
    userId,
    bookId
  );
  if (!sessions) throw new NotFoundError("Reading time not found");

  // Calculate the total reading time in minutes
  let totalReadingTime = 0;
  sessions.forEach((session: { startTime: Date; endTime: Date }) => {
    const startTime = new Date(session.startTime);
    const endTime = session.endTime ? new Date(session.endTime) : new Date();
    totalReadingTime += (endTime.getTime() - startTime.getTime()) / (1000 * 60); // Convert milliseconds to minutes
  });

  return Math.floor(totalReadingTime);
};

// Get the daily reading data of a user
export const getDailyReadingData = async (userId: number) => {
  const data = await StatsModel.StatsModel.getDailyReadingData(userId);

  if (!data) throw new NotFoundError("Reading data not found");

  return data;
};
