import path from "path";
import fs from "fs";
import { NotFoundError } from "../Error/Error";
import { getBookQuery } from "../Interfaces/Book.interface";
import * as LibraryModel from "../Model/library.model";
import config from "../config";
import EPub from "epub";

// Get all users
export const getLibrary = async (userId: number, query: getBookQuery) => {
  const data = await LibraryModel.LibraryModel.getLibrary(userId, query);

  for (const book of data) {
    book.coverPath = encodeURI(
      `http://localhost:${config.port}${book.coverPath}`
    );
    book.epubFilePath = encodeURI(
      `http://localhost:${config.port}${book.epubFilePath}`
    );
  }

  if (!data) throw new NotFoundError("No books found");

  const count = await LibraryModel.LibraryModel.count(userId, query);
  const meta = {
    page: query.page,
    size: data.length,
    total: +count.count,
  };
  return { data, meta };
};

// Get all library books
export const getAllLibraryBooks = async (userId: number) => {
  const data = await LibraryModel.LibraryModel.getAllLibraryBooks(userId);

  for (const book of data) {
    book.coverPath = encodeURI(
      `http://localhost:${config.port}${book.coverPath}`
    );
  }

  if (!data) throw new NotFoundError("No books found");

  return data;
};

export const getChapterContentService = async (
  userId: number,
  bookId: number,
  chapterId: string
) => {
  const book = await LibraryModel.LibraryModel.getLibraryById(userId, bookId);
  if (!book) throw new Error("Book not found");

  const epubFilePath = book.epubFilePath;
  if (!config.book.baseFilePath) throw new Error("Base file path not found");
  const fullPath = path.join(config.book.baseFilePath, epubFilePath);

  if (!fs.existsSync(fullPath)) throw new Error("EPUB file not found");

  return new Promise<{
    title: string;
    author: string;
    chapter: { id: string; title: string; content: string };
  }>((resolve, reject) => {
    const epub = new EPub(fullPath);

    epub.on("end", () => {
      epub.getChapter(chapterId, (error, text) => {
        if (error) return reject(error);

        const chapter = {
          id: chapterId,
          title: "", // Title needs to be fetched, might be part of the EPUB metadata or other means
          content: text,
        };

        resolve({
          title: book.title,
          author: book.author,
          chapter,
        });
      });
    });

    epub.on("error", reject);
    epub.parse();
  });
};

export const getBookChaptersService = async (
  userId: number,
  bookId: number
) => {
  const book = await LibraryModel.LibraryModel.getLibraryById(userId, bookId);
  if (!book) throw new Error("Book not found");

  const epubFilePath = book.epubFilePath;
  if (!config.book.baseFilePath) throw new Error("Base file path not found");
  const fullPath = path.join(config.book.baseFilePath, epubFilePath);

  if (!fs.existsSync(fullPath)) throw new Error("EPUB file not found");

  return new Promise<{
    title: string;
    author: string;
    chapters: { id: string; title: string }[];
  }>((resolve, reject) => {
    const epub = new EPub(fullPath);

    epub.on("end", () => {
      const chapters = epub.flow.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
      }));

      resolve({
        title: book.title,
        author: book.author,
        chapters,
      });
    });

    epub.on("error", reject);
    epub.parse();
  });
};

export const setCurrentChapterId = async (
  userId: number,
  bookId: number,
  chapterId: string
) => {
  const checkCurrentChapter =
    await LibraryModel.LibraryModel.getCurrentChapterId(userId, bookId);

  if (!checkCurrentChapter) {
    await LibraryModel.LibraryModel.setCurrentChapterId(
      userId,
      bookId,
      chapterId
    );
  } else {
    await LibraryModel.LibraryModel.updateCurrentChapterId(
      userId,
      bookId,
      chapterId
    );
  }
};

export const getCurrentChapterId = async (userId: number, bookId: number) => {
  const currentChapter = await LibraryModel.LibraryModel.getCurrentChapterId(
    userId,
    bookId
  );

  if (!currentChapter) throw new NotFoundError("Current chapter not found");
  return currentChapter;
};

export const startSession = async (userId: number, bookId: number) => {
  await LibraryModel.LibraryModel.startSession(userId, bookId);
};

export const endSession = async (userId: number, bookId: number) => {
  await LibraryModel.LibraryModel.endSession(userId, bookId);
};

export const getTotalReadingTime = async (userId: number, bookId: number) => {
  const sessions = await LibraryModel.LibraryModel.getTotalReadingTime(
    userId,
    bookId
  );
  if (!sessions) throw new NotFoundError("Reading time not found");

  console.log(sessions);

  // Calculate the total reading time in minutes
  let totalReadingTime = 0;
  sessions.forEach((session: { startTime: Date; endTime: Date }) => {
    const startTime = new Date(session.startTime);
    const endTime = session.endTime ? new Date(session.endTime) : new Date();
    totalReadingTime += (endTime.getTime() - startTime.getTime()) / (1000 * 60); // Convert milliseconds to minutes
  });

  return Math.floor(totalReadingTime);
};
