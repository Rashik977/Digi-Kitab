import { Book, getBookQuery } from "../Interfaces/Book.interface";
import { BaseModel } from "./base.model";

export class BookModel extends BaseModel {
  // Function to get all users
  static async getBooks(filter: getBookQuery) {
    const { q, page, size, category, genre, rating, priceMin, priceMax } =
      filter;

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
        "year",
        "cover_path"
      )
      .table("books")
      .limit(size)
      .offset((page - 1) * size);

    if (q) {
      await query.whereLike("title", `%${q}%`);
    }

    if (category) {
      await query.andWhere("category", category);
    }

    if (genre) {
      await query.andWhere("genre", genre);
    }

    if (rating) {
      await query.andWhere("rating", ">=", rating);
    }

    if (priceMin && priceMax) {
      await query.andWhereBetween("price", [priceMin, priceMax]);
    }

    return query;
  }

  static async count(filter: getBookQuery) {
    const { q, category, genre, rating, priceMin, priceMax } = filter;
    const query = this.queryBuilder().count("*").table("books").first();

    if (q) {
      await query.whereLike("title", `%${q}%`);
    }

    if (category) {
      await query.andWhere("category", category);
    }

    if (genre) {
      await query.andWhere("genre", genre);
    }

    if (rating) {
      await query.andWhere("rating", ">=", rating);
    }

    if (priceMin && priceMax) {
      await query.andWhereBetween("price", [priceMin, priceMax]);
    }

    return query;
  }

  static getBookById(id: number) {
    return this.queryBuilder()
      .select(
        "id",
        "title",
        "author",
        "genre",
        "price",
        "rating",
        "category",
        "year",
        "cover_path",
        "desc"
      )
      .table("books")
      .where("id", id)
      .first();
  }

  // Function to create a book
  static async create(book: Book) {
    await this.queryBuilder().insert(book).table("books");
  }

  // Function to update a book
  static async update(id: number, book: Partial<Book>) {
    await this.queryBuilder().update(book).table("books").where({ id });
  }

  // Function to delete a book
  static delete(id: number) {
    return this.queryBuilder().delete().table("books").where({ id });
  }
}
