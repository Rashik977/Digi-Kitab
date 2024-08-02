import "./styles/style.css";

import { initRouter } from "./router";
import { getDarkMode, setDarkMode } from "./utils/darkMode";

document.addEventListener("DOMContentLoaded", () => {
  initRouter();
  setDarkMode(getDarkMode());
});
