import * as BookModel from "../Model/book.model";
import { NotFoundError } from "../Error/Error";
import { getBookQuery } from "../Interfaces/Book.interface";

// Get all users
export const getBooks = async (query: getBookQuery) => {
  const data = await BookModel.BookModel.getBooks(query);
  if (!data) throw new NotFoundError("No users found");

  const count = await BookModel.BookModel.count(query);
  const meta = {
    page: query.page,
    size: data.length,
    total: +count.count,
  };
  return { data, meta };
};
