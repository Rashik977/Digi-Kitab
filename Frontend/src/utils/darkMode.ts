// get the dark mode status from local storage
export const getDarkMode = (): boolean => {
  return localStorage.getItem("darkMode") === "true";
};

// set the dark mode status in local storage
export const setDarkMode = (isDark: boolean): void => {
  localStorage.setItem("darkMode", isDark.toString());
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};
