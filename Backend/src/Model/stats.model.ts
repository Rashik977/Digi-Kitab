import { startOfDay, subDays, format } from "date-fns";
import { BaseModel } from "./base.model";

export class StatsModel extends BaseModel {
  // Function to start a reading session
  static async startSession(userId: number, bookId: number) {
    await this.queryBuilder().table("reading_session").insert({
      user_id: userId,
      book_id: bookId,
    });
  }

  // Function to end a reading session
  static async endSession(userId: number, bookId: number) {
    // Finding the most recent session for the user and book
    const [latestSession] = await this.queryBuilder()
      .select("id")
      .from("reading_session")
      .where({ user_id: userId, book_id: bookId })
      .orderBy("start_time", "desc") // Order by the start_time descending
      .limit(1);

    if (latestSession) {
      await this.queryBuilder()
        .table("reading_session")
        .where({ id: latestSession.id })
        .update({ end_time: this.queryBuilder().fn.now() });
    }
  }

  // Function to get total reading time for a user and book
  static async getTotalReadingTime(userId: number, bookId: number) {
    const sessions = await this.queryBuilder()
      .select("start_time", "end_time")
      .from("reading_session")
      .where("user_id", userId)
      .andWhere("book_id", bookId);

    return sessions;
  }

  // Function to get daily reading data for a user
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
      const formattedDate = format(date, "yyyy-MM-dd");
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
