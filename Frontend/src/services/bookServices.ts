import { Book } from "../interfaces/Book.interface";
import { fetchWithAuth } from "./authServices";

export const fetchBooks = async (
  page: number,
  size: number,
  filters: {
    q?: string;
    category?: string;
    genre?: string;
    rating?: number;
    priceMin?: number;
    priceMax?: number;
  } = {}
): Promise<{
  data: Book[];
  meta: { page: number; size: number; total: number };
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (filters.q) {
    params.append("q", filters.q.toString());
  }

  if (filters.category && filters.category !== "All")
    params.append("category", filters.category);
  if (filters.genre && filters.genre !== "All")
    params.append("genre", filters.genre);
  if (filters.rating) params.append("rating", filters.rating.toString());
  if (filters.priceMin) params.append("priceMin", filters.priceMin.toString());
  if (filters.priceMax) params.append("priceMax", filters.priceMax.toString());

  const response = await fetchWithAuth(
    `http://localhost:3000/books?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }
  return response.json();
};

export const fetchBookById = async (id: number): Promise<Book> => {
  const response = await fetchWithAuth(`http://localhost:3000/books/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch book");
  }
  return response.json();
};

export const uploadBook = async (bookDetails: Partial<Book>, file: File) => {
  const formData = new FormData();

  for (const key in bookDetails) {
    if (bookDetails.hasOwnProperty(key)) {
      formData.append(key, (bookDetails as any)[key]);
    }
  }

  formData.append("file", file);

  const response = await fetchWithAuth("http://localhost:3000/books", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload book");
  }

  return response.json();
};

export const updateBook = async (id: number, bookDetails: Partial<Book>) => {
  const response = await fetchWithAuth(`http://localhost:3000/books/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookDetails),
  });

  if (!response.ok) {
    throw new Error("Failed to update book");
  }

  return response.json();
};

export const deleteBook = async (id: number) => {
  const response = await fetchWithAuth(`http://localhost:3000/books/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete book");
  }

  return response.json();
};
