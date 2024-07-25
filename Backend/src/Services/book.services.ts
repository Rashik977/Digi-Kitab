import * as BookModel from "../Model/book.model";
import { NotFoundError } from "../Error/Error";
import { getBookQuery } from "../Interfaces/Book.interface";
import config from "../config";

// Get all users
export const getBooks = async (query: getBookQuery) => {
  const data = await BookModel.BookModel.getBooks(query);

  for (const book of data) {
    book.coverPath = encodeURI(
      `http://localhost:${config.port}${book.coverPath}`
    );
  }

  if (!data) throw new NotFoundError("No users found");

  const count = await BookModel.BookModel.count(query);
  const meta = {
    page: query.page,
    size: data.length,
    total: +count.count,
  };
  return { data, meta };
};

// Get a single book by ID
export const getBookById = async (id: number) => {
  const data = await BookModel.BookModel.getBookById(id);

  if (!data) throw new NotFoundError("Book not found");

  data.coverPath = encodeURI(
    `http://localhost:${config.port}${data.coverPath}`
  );
  return data;
};
