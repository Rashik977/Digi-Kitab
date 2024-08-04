import { createElement } from "../utils/createElement";
import { getDarkMode, setDarkMode } from "../utils/darkMode";

export const darkModeToggle = () => {
  const toggleContainer = createElement("div", {
    className: "flex items-center",
  });
  const toggleLabel = createElement("span", {
    className: " mr-4 dark:text-white",
  });
  toggleLabel.textContent = "Dark Mode";

  const toggleSwitch = createElement("div", {
    className:
      "relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in",
  });

  const toggleInput = createElement("input", {
    type: "checkbox",
    name: "toggle",
    id: "toggle",
    className:
      "toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer",
    checked: getDarkMode(),
    onchange: (e: Event) => {
      setDarkMode((e.target as HTMLInputElement).checked);
    },
  });

  const toggleLabelFor = createElement("label", {
    for: "toggle",
    className:
      "toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer",
  });

  toggleSwitch.appendChild(toggleInput);
  toggleSwitch.appendChild(toggleLabelFor);
  toggleContainer.appendChild(toggleLabel);
  toggleContainer.appendChild(toggleSwitch);
  return toggleContainer;
};
