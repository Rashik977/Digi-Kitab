export const saveToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

export const getToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const removeToken = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
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
    const response = await fetch("/api/refresh", {
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
