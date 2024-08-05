import { ReadingStats } from "../interfaces/ReadingStats";
import { fetchWithAuth } from "./authServices";

// Start a reading session
export const startSession = async (bookId: number) => {
  const response = await fetchWithAuth(
    `${import.meta.env.VITE_BACKEND_URL}/stats/${bookId}/start-session`,
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

// End a reading session
export const endSession = async (bookId: number) => {
  const response = await fetchWithAuth(
    `${import.meta.env.VITE_BACKEND_URL}/stats/${bookId}/end-session`,
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

// Fetch reading time for a book
export const fetchReadingTime = async (bookId: number) => {
  const response = await fetchWithAuth(
    `${import.meta.env.VITE_BACKEND_URL}/stats/${bookId}/reading-time`,
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

// Fetch reading stats
export const fetchReadingStats = async (): Promise<ReadingStats[]> => {
  try {
    const response = await await fetchWithAuth(
      `${import.meta.env.VITE_BACKEND_URL}/stats/reading-data/daily`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching reading stats:", error);
    throw error;
  }
};
