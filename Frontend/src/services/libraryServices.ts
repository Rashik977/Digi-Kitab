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

export const fetchCurrentChapterId = async (bookId: number) => {
  const response = await fetchWithAuth(
    `http://localhost:3000/library/${bookId}/current-chapter`,
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

export const setCurrentChapterId = async (
  bookId: number,
  chapterId: string
) => {
  const response = await fetchWithAuth(
    `http://localhost:3000/library/${bookId}/current-chapter`,
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

export const startSession = async (bookId: number) => {
  const response = await fetchWithAuth(
    `http://localhost:3000/library/${bookId}/start-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to start session");
  }
};

export const endSession = async (bookId: number) => {
  const response = await fetchWithAuth(
    `http://localhost:3000/library/${bookId}/end-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to end session");
  }
};

export const fetchReadingTime = async (bookId: number) => {
  const response = await fetchWithAuth(
    `http://localhost:3000/library/${bookId}/reading-time`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch reading time");
  }
  return response.json();
};
