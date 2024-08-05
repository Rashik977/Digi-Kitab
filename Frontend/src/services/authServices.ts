import { jwtDecode } from "jwt-decode";
import { User } from "../interfaces/User.interface";

let globalUser: User | null = null;

// Save the token to local storage and decode it to get the user object
export const saveToken = (token: string) => {
  localStorage.setItem("accessToken", token);
  globalUser = jwtDecode<User>(token);
};

// Get the user object from the token
export const getUser = (): User | null => {
  if (!globalUser) {
    const token = getToken();
    if (token) {
      globalUser = jwtDecode<User>(token);
    }
  }
  return globalUser;
};

// Get the token from local storage
export const getToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

// Remove the token from local storage
export const removeToken = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  globalUser = null;
};

// Log out the user by clearing the local storage and redirecting to the login page
export const logOut = () => {
  localStorage.clear();
  window.history.pushState(null, "", "/login");
  const event = new PopStateEvent("popstate");
  dispatchEvent(event);
};

// Check if the user is authenticated by checking if there's an access token
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Get the refresh token from local storage and decode it to get the user object and save the access token to local storage
export const refreshToken = async (): Promise<void> => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    removeToken();
    window.history.pushState(null, "", "/login");
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const { accessToken } = await response.json();
      saveToken(accessToken); // Update access token
    } else {
      removeToken();
      window.history.pushState(null, "", "/login");
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    removeToken();
    window.history.pushState(null, "", "/login");
  }
};

// Fetch data from the API with the access token
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
    throw error;
  }
};
