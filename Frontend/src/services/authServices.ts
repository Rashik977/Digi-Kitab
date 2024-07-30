import { jwtDecode } from "jwt-decode";
import { User } from "../interfaces/User.interface";

let globalUser: User | null = null;

export const saveToken = (token: string) => {
  localStorage.setItem("accessToken", token);
  globalUser = jwtDecode<User>(token);
};

export const getUser = (): User | null => {
  if (!globalUser) {
    const token = getToken();
    if (token) {
      globalUser = jwtDecode<User>(token);
    }
  }
  return globalUser;
};

export const getToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const removeToken = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  globalUser = null;
};

export const logOut = () => {
  localStorage.clear();
  window.history.pushState(null, "", "/login");
  const event = new PopStateEvent("popstate");
  dispatchEvent(event);
};

export const isAuthenticated = (): boolean => {
  return !!getToken(); // Checks if there's an access token
};

export const refreshToken = async (): Promise<void> => {
  const refreshToken = localStorage.getItem("refreshToken"); // Assuming you store refresh token as well

  if (!refreshToken) {
    removeToken();
    window.history.pushState(null, "", "/login");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/auth/refresh", {
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
