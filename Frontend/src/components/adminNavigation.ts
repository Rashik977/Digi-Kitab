import { logOut } from "../services/authServices";
import { createElement } from "../utils/createElement";

// Navigation for the admin panel
export const AdminNavbar = () => {
  return createElement(
    "nav",
    { className: "bg-gray-800 text-white shadow-md h-screen w-1/5" },
    createElement(
      "div",
      { className: "container mx-auto flex flex-col items-start p-4" },
      createElement(
        "div",
        { className: "text-lg font-semibold mb-4" },
        "Digi-Kitab Admin"
      ),
      // Users section
      createElement(
        "a",
        {
          href: "/manageUsers",
          "data-link": "",
          className: "hover:bg-gray-700 px-3 py-2 rounded-md w-full mb-2",
        },
        "Manage Users"
      ),
      // Staff section
      createElement(
        "a",
        {
          href: "/manageStaff",
          "data-link": "",
          className: "hover:bg-gray-700 px-3 py-2 rounded-md w-full mb-2",
        },
        "Manage Staff"
      ),
      // Books section
      createElement(
        "a",
        {
          href: "/manageBooks",
          "data-link": "",
          className: "hover:bg-gray-700 px-3 py-2 rounded-md w-full mb-2",
        },
        "Manage Books"
      ),
      // Logout
      createElement(
        "a",
        {
          href: "/",
          "data-link": "",
          className: "hover:bg-gray-700 px-3 py-2 rounded-md w-full mt-auto",
          onclick: logOut,
        },
        "Logout"
      )
    )
  );
};
