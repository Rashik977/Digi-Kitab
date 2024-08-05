import path from "path";
import fs from "fs";
import { NotFoundError } from "../Error/Error";
import { getBookQuery } from "../Interfaces/Book.interface";
import * as LibraryModel from "../Model/library.model";
import config from "../config";
import EPub from "epub";

// Get all books in user library with pagination
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

// Get all library books of a user without pagination
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

// get the content of a chapter
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
          title: "",
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

// get all chapters of a book
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

// set the current chapter of a book
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

// get the current chapter of a book
export const getCurrentChapterId = async (userId: number, bookId: number) => {
  const currentChapter = await LibraryModel.LibraryModel.getCurrentChapterId(
    userId,
    bookId
  );

  if (!currentChapter) throw new NotFoundError("Current chapter not found");
  return currentChapter;
};
