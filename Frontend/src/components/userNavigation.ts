import { getUser, logOut } from "../services/authServices";
import { createElement } from "../utils/createElement";

export const Navbar = () => {
  const user = getUser();

  // Function to create the dropdown menu
  const createDropdown = () => {
    const dropdown = createElement(
      "div",
      {
        id: "userDropdown",
        className:
          "absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 hidden",
      },
      createElement(
        "a",
        {
          href: "/stats",
          "data-link": "",
          className:
            "block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300",
        },
        "Stats"
      ),
      createElement(
        "a",
        {
          href: "/settings",
          "data-link": "",
          className:
            "block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300",
        },
        "Settings"
      ),
      createElement(
        "a",
        {
          href: "/",
          "data-link": "",
          className:
            "block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300",
          onclick: logOut,
        },
        "Logout"
      )
    );

    return dropdown;
  };

  // Function to toggle the dropdown visibility
  const toggleDropdown = () => {
    const dropdown = document.getElementById("userDropdown");
    if (dropdown) {
      dropdown.classList.toggle("hidden");
    }
  };

  // Function to toggle the sidebar visibility
  const toggleSidebar = () => {
    const sidebar = document.getElementById("mobile-menu");
    if (sidebar) {
      sidebar.classList.toggle("-translate-x-full");
    }
  };

  return createElement(
    "nav",
    {
      className:
        "bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-md relative",
    },
    createElement(
      "div",
      { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
      createElement(
        "div",
        { className: "flex items-center justify-between h-16" },
        createElement(
          "div",
          { className: "flex-shrink-0 flex items-center" },
          createElement(
            "span",
            {
              className:
                "text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-orange-400",
              style: "text-shadow: 2px 2px 4px rgba(0,0,0,0.1);",
            },
            createElement(
              "a",
              {
                href: "/library",
                "data-link": "",
              },
              "Digi-Kitab"
            )
          )
        ),
        createElement("button", {
          className:
            "md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500",
          onclick: toggleSidebar,
          ariaLabel: "Toggle menu",
          innerHTML: `
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          `,
        }),
        createElement(
          "div",
          { className: "hidden md:flex items-center space-x-4" },
          createElement(
            "a",
            {
              href: "/library",
              "data-link": "",
              className:
                "text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300",
            },
            "Library"
          ),
          createElement(
            "a",
            {
              href: "/buyBooks",
              "data-link": "",
              className:
                "text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300",
            },
            "Buy Books"
          ),
          createElement(
            "a",
            {
              href: "/checkout",
              "data-link": "",
              className:
                "text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center",
            },
            createElement("img", {
              src: "/icons/shop.png",
              className:
                "h-5 w-5 mr-1 transition duration-300 group-hover:opacity-80 brightness-100 invert dark:brightness-0 dark:invert",
            }),
            "Checkout"
          ),
          createElement(
            "div",
            { className: "relative ml-3" },
            createElement(
              "div",
              {
                className: "flex items-center space-x-2 cursor-pointer",
                onclick: toggleDropdown,
              },
              createElement(
                "span",
                {
                  className:
                    "text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition duration-300",
                },
                user?.name || "User"
              ),
              createElement("img", {
                src: "/icons/user.png",
                className:
                  "h-8 w-8 rounded-full object-cover transition duration-300 ring-2 ring-transparent hover:ring-purple-600 dark:hover:ring-purple-400 brightness-100 invert dark:brightness-0 dark:invert",
              })
            ),
            createDropdown()
          )
        )
      )
    ),
    createElement(
      "div",
      {
        id: "mobile-menu",
        className:
          "fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 z-30 transform -translate-x-full transition-transform duration-300 md:hidden overflow-y-auto",
      },
      createElement(
        "div",
        { className: "px-2 pt-2 pb-3 space-y-1" },
        createElement(
          "a",
          {
            href: "/library",
            "data-link": "",
            className:
              "block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300",
          },
          "Library"
        ),
        createElement(
          "a",
          {
            href: "/buyBooks",
            "data-link": "",
            className:
              "block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300",
          },
          "Buy Books"
        ),
        createElement(
          "a",
          {
            href: "/checkout",
            "data-link": "",
            className:
              "block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300",
          },
          "Checkout"
        ),
        createElement(
          "a",
          {
            href: "/stats",
            "data-link": "",
            className:
              "block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300",
          },
          "Stats"
        ),
        createElement(
          "a",
          {
            href: "/settings",
            "data-link": "",
            className:
              "block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300",
          },
          "Settings"
        ),
        createElement(
          "a",
          {
            href: "/",
            "data-link": "",
            className:
              "block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300",
            onclick: logOut,
          },
          "Logout"
        )
      )
    )
  );
};
