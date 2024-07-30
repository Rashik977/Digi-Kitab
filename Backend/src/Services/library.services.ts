import { NotFoundError } from "../Error/Error";
import { getBookQuery } from "../Interfaces/Book.interface";
import * as LibraryModel from "../Model/library.model";
import config from "../config";

// Get all users
export const getLibrary = async (userId: number, query: getBookQuery) => {
  const data = await LibraryModel.LibraryModel.getLibrary(userId, query);

  for (const book of data) {
    book.coverPath = encodeURI(
      `http://localhost:${config.port}${book.coverPath}`
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
