import { fetchWithAuth, getUser } from "./authServices";

export const createStaff = async (
  name: string,
  email: string,
  password: string
): Promise<void> => {
  const response = await fetchWithAuth("http://localhost:3000/staff", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }
};

export const updateStaff = async (
  id: number,
  name: string,
  email: string,
  password: string
): Promise<void> => {
  const Staff = getUser();
  let toUpdate;
  if (password === null || password === undefined || password === "") {
    toUpdate = { name, email };
  } else {
    toUpdate = { name, email, password };
  }
  if (!Staff) {
    throw new Error("Staff not authenticated");
  }

  const response = await fetchWithAuth(`http://localhost:3000/staff/${id}`, {
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

export const getStaff = async (
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
    `http://localhost:3000/staff?${params.toString()}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
};

export const deleteStaff = async (id: number) => {
  const response = await fetchWithAuth(`http://localhost:3000/staff/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }
};
