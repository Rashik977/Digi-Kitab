import { createElement } from "../utils/createElement";

export const createPopup = (content: HTMLElement, onClose: () => void) => {
  const overlay = createElement(
    "div",
    {
      className:
        "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
    },
    createElement(
      "div",
      {
        className: "bg-white p-4 rounded shadow-lg",
      },
      createElement(
        "div",
        {
          className: "flex flex-col items-center justify-center h-full w-full ",
        },
        createElement(
          "button",
          { className: "text-gray-500 self-end ", onclick: onClose },
          "✖️"
        ),
        createElement(
          "div",
          { className: "bg-white p-4 rounded shadow-lg" },
          content
        )
      )
    )
  );

  document.body.appendChild(overlay);

  return overlay;
};

export const closePopup = (popup: HTMLElement) => {
  document.body.removeChild(popup);
};
