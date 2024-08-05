import "./styles/style.css";

import { initRouter } from "./router";
import { getDarkMode, setDarkMode } from "./utils/darkMode";

// Initialize the router and set the display mode
document.addEventListener("DOMContentLoaded", () => {
  initRouter();
  setDarkMode(getDarkMode());
});
