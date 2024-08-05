import express from "express";
import { authenticate } from "../Middleware/auth.middleware";
import {
  endSession,
  getDailyReadingData,
  getTotalReadingTime,
  startSession,
} from "../Controller/stats.controller";

const statRoutes = express.Router();
// Route to get daily reading data
statRoutes.get("/reading-data/daily", authenticate, getDailyReadingData);

// Route to start a reading session
statRoutes.post("/:bookId/start-session", authenticate, startSession);

// Route to end a reading session
statRoutes.post("/:bookId/end-session", authenticate, endSession);

// Route to get the total reading time of a book
statRoutes.get("/:bookId/reading-time", authenticate, getTotalReadingTime);

export default statRoutes;
