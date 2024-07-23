import { removeToken } from "../utils/auth";
import { createElement } from "../utils/createElement";

export const render = () => {
  const container = createElement("div", { className: "p-6" });

  const heading = createElement(
    "h1",
    { className: "text-3xl mb-4" },
    "Dashboard"
  );
  const logoutButton = createElement(
    "button",
    { className: "bg-red-500 text-white p-2 rounded" },
    "Logout"
  );

  logoutButton.addEventListener("click", () => {
    removeToken();
    window.history.pushState(null, "", "/login");
    const event = new PopStateEvent("popstate");
    dispatchEvent(event);
  });

  container.appendChild(heading);
  container.appendChild(logoutButton);
  return container;
};
