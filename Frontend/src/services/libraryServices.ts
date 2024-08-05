import { Book } from "../interfaces/Book.interface";
import { fetchWithAuth } from "./authServices";

// function to fetch library books with pagination
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
    `${import.meta.env.VITE_BACKEND_URL}/library?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch library books");
  }
  return response.json();
};

// function to fetch all library books without pagination
export const fetchAllLibraryBooks = async (): Promise<Book[]> => {
  const response = await fetchWithAuth(
    `${import.meta.env.VITE_BACKEND_URL}/library/all`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch all library books");
  }
  return response.json();
};

// Check if a book is in the library
export const isBookInLibrary = async (bookId: string): Promise<boolean> => {
  const libraryBooks = await fetchAllLibraryBooks();
  return libraryBooks.some((book) => book.id === bookId);
};

// Get all chapters of a book
export const fetchBookChapters = async (bookId: number) => {
  const response = await fetchWithAuth(
    `${import.meta.env.VITE_BACKEND_URL}/library/${bookId}/chapters`,
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

// Get chapter content
export const fetchChapterContent = async (
  bookId: number,
  chapterId: string
) => {
  const response = await fetchWithAuth(
    `${import.meta.env.VITE_BACKEND_URL}/library/${bookId}/${chapterId}`,
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

// Get the current chapter of a book that the user is reading
export const fetchCurrentChapterId = async (bookId: number) => {
  const response = await fetchWithAuth(
    `${import.meta.env.VITE_BACKEND_URL}/library/${bookId}/current-chapter`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch current chapter");
  }
  return response.json();
};

// Set the current chapter of a book that the user is reading
export const setCurrentChapterId = async (
  bookId: number,
  chapterId: string
) => {
  const response = await fetchWithAuth(
    `${import.meta.env.VITE_BACKEND_URL}/library/${bookId}/current-chapter`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chapterId }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to set current chapter");
  }
  return response.json();
};
