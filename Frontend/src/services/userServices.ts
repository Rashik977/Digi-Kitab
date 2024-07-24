import { fetchWithAuth, getUser } from "./authServices";

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

export const updateUser = async (
  name: string,
  email: string,
  password: string
): Promise<void> => {
  const user = getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const response = await fetchWithAuth(
    `http://localhost:3000/users/${user.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }
};
