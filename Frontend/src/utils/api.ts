import { getToken, refreshToken } from "./auth";

export const login = async (email: string, password: string): Promise<void> => {
  const response = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const { accessToken, refreshToken } = await response.json();
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  } else {
    const error = await response.json();
    throw new Error(error.error.message);
  }
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<void> => {
  const response = await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }
};

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();

  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, options);

    if (response.status === 401) {
      // Handle token expiration
      await refreshToken();
      // Retry the request with a new token
      const newToken = getToken();
      if (newToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return fetch(url, options);
      }
    }

    return response;
  } catch (error) {
    console.error("API request failed:", error);
    throw error; // Optionally rethrow to handle at the calling site
  }
};
