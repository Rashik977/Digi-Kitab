import { createElement } from "../utils/createElement";

export const Navbar = () => {
  return createElement(
    "nav",
    { className: "bg-gray-800 text-white shadow-md" },
    createElement(
      "div",
      { className: "container mx-auto flex items-center justify-between p-4" },
      createElement(
        "div",
        { className: "text-lg font-semibold" },
        "Digi-Kitab"
      ),
      createElement(
        "div",
        { className: "hidden md:flex space-x-4" },
        createElement(
          "a",
          {
            href: "/buyBooks",
            "data-link": "",
            className: "hover:bg-gray-700 px-3 py-2 rounded-md",
          },
          "Buy Books"
        ),
        createElement(
          "a",
          {
            href: "/settings",
            "data-link": "",
            className: "hover:bg-gray-700 px-3 py-2 rounded-md",
          },
          "Settings"
        )
      )
    )
  );
};
