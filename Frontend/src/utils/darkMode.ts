export const getDarkMode = (): boolean => {
  return localStorage.getItem("darkMode") === "true";
};

export const setDarkMode = (isDark: boolean): void => {
  localStorage.setItem("darkMode", isDark.toString());
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

