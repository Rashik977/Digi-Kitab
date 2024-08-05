import knex from "knex";
import { getBookQuery } from "../Interfaces/Book.interface";
import { BaseModel } from "./base.model";
import { subDays, startOfDay, format, subMonths, startOfMonth } from "date-fns";

export class LibraryModel extends BaseModel {
  // Function to get all books in user library with pagination
  static async getLibrary(userId: number, filter: getBookQuery) {
    const { q, page, size } = filter;

    if (!page || page < 1) {
      throw new Error("Invalid page number");
    }
    if (!size || size < 1) {
      throw new Error("Invalid page size");
    }

    const query = this.queryBuilder()
      .select(
        "books.id",
        "books.title",
        "books.author",
        "books.genre",
        "books.price",
        "books.rating",
        "books.category",
        "books.year",
        "books.cover_path",
        "books.desc",
        "epub_file_path",
        "total_chapters"
      )
      .table("books")
      .innerJoin("order_items", "order_items.book_id", "books.id")
      .innerJoin("orders", "orders.id", "order_items.order_id")
      .where("orders.user_id", userId)
      .limit(size)
      .offset((page - 1) * size);

    if (q) {
      query.whereLike("title", `%${q}%`);
    }

    return await query;
  }

  // Function to count the number of books in user library with pagination
  static async count(userId: number, filter: getBookQuery) {
    const { q } = filter;
    const query = this.queryBuilder()
      .count("*")
      .table("books")
      .innerJoin("order_items", "order_items.book_id", "books.id")
      .innerJoin("orders", "orders.id", "order_items.order_id")
      .where("orders.user_id", userId)
      .first();

    if (q) {
      query.whereLike("title", `%${q}%`);
    }

    return await query;
  }

  // Function to get all library books of a user without pagination
  static async getAllLibraryBooks(userId: number) {
    return this.queryBuilder()
      .select(
        "books.id",
        "books.title",
        "books.author",
        "books.genre",
        "books.price",
        "books.rating",
        "books.category",
        "books.year",
        "books.cover_path",
        "books.desc",
        "epub_file_path"
      )
      .table("books")
      .innerJoin("order_items", "order_items.book_id", "books.id")
      .innerJoin("orders", "orders.id", "order_items.order_id")
      .where("orders.user_id", userId);
  }

  // Function to get the library book by id
  static async getLibraryById(userId: number, bookId: number) {
    return this.queryBuilder()
      .select(
        "books.id",
        "books.title",
        "books.author",
        "books.genre",
        "books.price",
        "books.rating",
        "books.category",
        "books.year",
        "books.cover_path",
        "books.desc",
        "epub_file_path"
      )
      .table("books")
      .innerJoin("order_items", "order_items.book_id", "books.id")
      .innerJoin("orders", "orders.id", "order_items.order_id")
      .where("orders.user_id", userId)
      .andWhere("books.id", bookId)
      .first();
  }

  // Function to get the current chapter of the book being read by the user
  static async getCurrentChapterId(userId: number, bookId: number) {
    return this.queryBuilder()
      .select("chapter_id")
      .table("reading_progress")
      .where("user_id", userId)
      .andWhere("book_id", bookId)
      .first();
  }

  // Function to set the current chapter of the book being read by the user
  static async setCurrentChapterId(
    userId: number,
    bookId: number,
    chapterId: string
  ) {
    return this.queryBuilder().table("reading_progress").insert({
      user_id: userId,
      book_id: bookId,
      chapter_id: chapterId,
    });
  }

  // Function to update the current chapter of the book being read by the user
  static async updateCurrentChapterId(
    userId: number,
    bookId: number,
    chapterId: string
  ) {
    return this.queryBuilder()
      .table("reading_progress")
      .where("user_id", userId)
      .andWhere("book_id", bookId)
      .update({ chapter_id: chapterId });
  }


}
