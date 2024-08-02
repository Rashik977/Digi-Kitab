import { getUser, logOut } from "../services/authServices";
import { createElement } from "../utils/createElement";

export const Navbar = () => {
  const user = getUser();

  const createDropdown = () => {
    const dropdown = createElement(
      "div",
      {
        className:
          "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden",
        id: "userDropdown",
      },
      createElement(
        "a",
        {
          href: "/settings",
          "data-link": "",
          className:
            "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-300",
        },
        "Settings"
      ),
      createElement(
        "a",
        {
          href: "/",
          "data-link": "",
          className:
            "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-300",
          onclick: logOut,
        },
        "Logout"
      )
    );

    return dropdown;
  };

  const toggleDropdown = () => {
    const dropdown = document.getElementById("userDropdown");
    if (dropdown) {
      dropdown.classList.toggle("hidden");
    }
  };

  return createElement(
    "nav",
    {
      className:
        "bg-white dark:bg-black dark:text-white text-gray-800 shadow-md",
    },
    createElement(
      "div",
      { className: "container mx-auto flex items-center justify-between p-4" },
      createElement(
        "div",
        { className: "text-3xl font-bold" },
        createElement(
          "span",
          {
            className:
              "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-orange-400",
            style: "text-shadow: 2px 2px 4px rgba(0,0,0,0.1);",
          },
          "Digi-Kitab"
        )
      ),
      createElement(
        "div",
        { className: "hidden md:flex items-center space-x-6" },
        createElement(
          "a",
          {
            href: "/library",
            "data-link": "",
            className: "hover:text-purple-600 transition duration-300",
          },
          "Library"
        ),
        createElement(
          "a",
          {
            href: "/buyBooks",
            "data-link": "",
            className: "hover:text-purple-600 transition duration-300",
          },
          "Buy Books"
        ),
        createElement(
          "a",
          {
            href: "/checkout",
            "data-link": "",
            className:
              "hover:text-purple-600 transition duration-300 relative group",
          },
          createElement("img", {
            src: "/icons/shop.png",
            className:
              "h-6 transition duration-300 group-hover:opacity-80 brightness-100 invert dark:brightness-0 dark:invert ",
          }),
          createElement("span", {
            className:
              "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full",
          })
        ),
        createElement(
          "div",
          { className: "relative" },
          createElement(
            "div",
            {
              className: "flex items-center space-x-2 cursor-pointer group",
              onclick: toggleDropdown,
            },
            createElement(
              "span",
              {
                className:
                  "text-sm font-medium group-hover:text-purple-600 transition duration-300",
              },
              user?.name || "User"
            ),
            createElement("img", {
              src: "/icons/user.png",
              className:
                "h-8 w-8 rounded-full object-cover transition duration-300 group-hover:ring-2 group-hover:ring-purple-600 brightness-100 invert dark:brightness-0 dark:invert",
            })
          ),
          createDropdown()
        )
      )
    )
  );
};
