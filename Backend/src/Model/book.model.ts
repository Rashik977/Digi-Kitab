import { getBookQuery } from "../Interfaces/Book.interface";
import { BaseModel } from "./base.model";

export class BookModel extends BaseModel {
  // Function to get all users
  static getBooks(filter: getBookQuery) {
    const { q, page, size } = filter;

    if (!page || page < 1) {
      throw new Error("Invalid page number");
    }
    if (!size || size < 1) {
      throw new Error("Invalid page size");
    }

    const query = this.queryBuilder()
      .select(
        "id",
        "title",
        "author",
        "genre",
        "price",
        "rating",
        "category",
        "year"
      )
      .table("books")
      .limit(size)
      .offset((page - 1) * size);
    if (q) {
      query.whereLike("title", `%${q}%`);
    }
    return query;
  }

  // Function to count users
  static count(filter: getBookQuery) {
    const { q } = filter;
    const query = this.queryBuilder().count("*").table("books").first();

    if (q) {
      query.whereLike("title", `%${q}%`);
    }
    return query;
  }
}
