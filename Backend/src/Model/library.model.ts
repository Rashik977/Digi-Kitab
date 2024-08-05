import knex from "knex";
import { getBookQuery } from "../Interfaces/Book.interface";
import { BaseModel } from "./base.model";
import { subDays, startOfDay, format, subMonths, startOfMonth } from "date-fns";

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

  static async getCurrentChapterId(userId: number, bookId: number) {
    return this.queryBuilder()
      .select("chapter_id")
      .table("reading_progress")
      .where("user_id", userId)
      .andWhere("book_id", bookId)
      .first();
  }

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

  static async startSession(userId: number, bookId: number) {
    await this.queryBuilder().table("reading_session").insert({
      user_id: userId,
      book_id: bookId,
    });
  }

  static async endSession(userId: number, bookId: number) {
    // Find the most recent session for the user and book
    const [latestSession] = await this.queryBuilder()
      .select("id") // Assuming the table has a primary key column named 'id'
      .from("reading_session")
      .where({ user_id: userId, book_id: bookId })
      .orderBy("start_time", "desc") // Order by the start_time descending
      .limit(1);

    if (latestSession) {
      // Update the end_time of the most recent session
      await this.queryBuilder()
        .table("reading_session")
        .where({ id: latestSession.id })
        .update({ end_time: this.queryBuilder().fn.now() });
    }
  }

  static async getTotalReadingTime(userId: number, bookId: number) {
    const sessions = await this.queryBuilder()
      .select("start_time", "end_time")
      .from("reading_session")
      .where("user_id", userId)
      .andWhere("book_id", bookId);

    return sessions;
  }

  static async getReadingTimeForPeriod(userId: number, start: Date, end: Date) {
    const sessions = await this.queryBuilder()
      .select("start_time", "end_time")
      .from("reading_session")
      .where("user_id", userId)
      .andWhereBetween("start_time", [start, end]);

    return sessions;
  }

  static async getDailyReadingData(userId: number) {
    const now = new Date();
    const startDate = subDays(now, 30);

    const data = await this.queryBuilder()
      .select(this.queryBuilder().raw("DATE(start_time) as date"))
      .select(
        this.queryBuilder().raw(
          `sum(EXTRACT(EPOCH FROM (end_time - start_time)) / 60) as total_minutes`
        )
      )
      .from("reading_session")
      .where({ user_id: userId })
      .andWhere("start_time", ">=", startDate)
      .groupByRaw("DATE(start_time)")
      .orderBy("date");

    // Fill in missing dates with zeroes
    const filledData = Array.from({ length: 30 }, (_, i) => {
      const date = startOfDay(subDays(now, 30 - i));
      const formattedDate = format(date, "yyyy-MM-dd"); // Use `format` from date-fns
      const entry = data.find((d) => {
        const entryDate = new Date(d.date);
        return entryDate.toISOString().split("T")[0] === formattedDate;
      });

      return {
        date: formattedDate,
        minutes: entry ? parseFloat(entry.totalMinutes) : 0,
      };
    });

    return filledData;
  }
}
