import { Book } from "../interfaces/Book.interface";
import { fetchWithAuth } from "./authServices";

export const fetchLibraryBooks = async (
  page: number,
  size: number,
  query: string = ""
): Promise<{
  data: Book[];
  meta: { page: number; size: number; total: number };
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (query) {
    params.append("q", query);
  }

  const response = await fetchWithAuth(
    `http://localhost:3000/library?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch library books");
  }
  return response.json();
};

export const fetchAllLibraryBooks = async (): Promise<Book[]> => {
  const response = await fetchWithAuth(`http://localhost:3000/library/all`);
  if (!response.ok) {
    throw new Error("Failed to fetch all library books");
  }
  return response.json();
};

export const isBookInLibrary = async (bookId: string): Promise<boolean> => {
  const libraryBooks = await fetchAllLibraryBooks();
  return libraryBooks.some((book) => book.id === bookId);
};

export const fetchBookChapters = async (bookId: number) => {
  const response = await fetchWithAuth(
    `http://localhost:3000/library/${bookId}/chapters`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch chapters");
  }
  return response.json();
};

export const fetchChapterContent = async (
  bookId: number,
  chapterId: string
) => {
  const response = await fetchWithAuth(
    `http://localhost:3000/library/${bookId}/${chapterId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch chapter content");
  }
  return response.json();
};
