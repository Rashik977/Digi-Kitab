import { Book } from "../interfaces/Book.interface";
import { fetchWithAuth } from "./authServices";

export const fetchBooks = async (
  page: number,
  size: number
): Promise<{
  data: Book[];
  meta: { page: number; size: number; total: number };
}> => {
  const response = await fetchWithAuth(
    `http://localhost:3000/books?page=${page}&size=${size}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }
  return response.json();
};
