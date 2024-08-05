import { createPopup, closePopup } from "./popUp";
import { createElement } from "../utils/createElement";

// Function to show an alert popup
export const showAlert = (message: string, onClose: () => void) => {
  const alertContent = createElement(
    "div",
    { className: "flex flex-col items-center" },
    createElement("p", { className: "mb-4" }, message),
    createElement("button", {
      className: "p-2 border rounded bg-blue-500 text-white",
      innerText: "OK",
      onclick: () => {
        closePopup(popupElement), onClose();
      },
    })
  );

  const popupElement = createPopup(alertContent, () =>
    closePopup(popupElement)
  );
};
