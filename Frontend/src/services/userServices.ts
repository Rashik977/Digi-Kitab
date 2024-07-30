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
  id: number,
  name: string,
  email: string,
  password: string
): Promise<void> => {
  const user = getUser();
  let toUpdate;
  if (password === null || password === undefined || password === "") {
    toUpdate = { name, email };
  } else {
    toUpdate = { name, email, password };
  }
  if (!user) {
    throw new Error("User not authenticated");
  }

  const response = await fetchWithAuth(`http://localhost:3000/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(toUpdate),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }
};

export const getUsers = async (
  page: number,
  size: number,
  filter: {
    q?: string;
  }
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (filter.q) {
    params.append("q", filter.q);
  }

  const response = await fetchWithAuth(
    `http://localhost:3000/users?${params.toString()}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
};

export const deleteUser = async (id: number) => {
  const response = await fetchWithAuth(`http://localhost:3000/users/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }
};
