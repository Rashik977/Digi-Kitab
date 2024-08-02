import { getBookQuery } from "../Interfaces/Book.interface";
import { BaseModel } from "./base.model";

export class LibraryModel extends BaseModel {
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
        "epub_file_path"
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
}
