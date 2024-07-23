import { createElement } from "../utils/createElement";

export const render = () => {
  const container = createElement("div", {
    className: "flex justify-center items-center h-screen",
  });

  const heading = createElement(
    "h1",
    { className: "text-3xl" },
    "404 Not Found"
  );

  container.appendChild(heading);
  return container;
};
