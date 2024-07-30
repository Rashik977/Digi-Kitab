import { AdminNavbar } from "../components/adminNavigation";
import { User } from "../interfaces/User.interface";
import * as UserServices from "../services/userServices";
import { createElement } from "../utils/createElement";
import { createPopup, closePopup } from "../components/popUp";
import { renderPagination } from "../components/pagination";

export const render = async () => {
  const main = createElement("main", {
    className: "flex",
  });
  const navigation = AdminNavbar();
  const wrapper = createElement("div", {
    className: "flex flex-col w-full p-10",
  });
  const container = createElement("div", {
    className: "p-6 flex flex-col w-full gap-10",
  });

  let currentPage = 1;
  const pageSize = 10;
  let currentQuery = "";

  const totalPages = async () => {
    const { meta } = await UserServices.getUsers(currentPage, pageSize, {
      q: currentQuery,
    });
    const { total, size } = meta;
    return Math.ceil(total / size);
  };

  const loadUsers = async (page: number) => {
    try {
      const { data: users, meta } = await UserServices.getUsers(
        page,
        pageSize,
        {
          q: currentQuery,
        }
      );
      container.innerHTML = ""; // Clear previous content
      container.appendChild(userTable(users));
      container.appendChild(
        renderPagination(meta.page, await totalPages(), loadUsers)
      );
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const searchInput = createElement("input", {
    type: "text",
    id: "searchInput",
    className: "p-2 border rounded w-full",
    placeholder: "Search for users...",
  });

  const searchButton = createElement("button", {
    className: "p-2 border rounded bg-blue-500 text-white",
    innerText: "Search",
  });

  const searchContainer = createElement("div", {
    className: "w-full flex gap-2 p-10 ",
  });

  searchButton.addEventListener("click", () => {
    currentQuery = (document.getElementById("searchInput") as HTMLInputElement)
      .value;
    loadUsers(currentPage);
  });

  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(searchButton);

  main.appendChild(navigation);
  wrapper.appendChild(userForm());
  wrapper.appendChild(searchContainer);
  wrapper.appendChild(container);
  main.appendChild(wrapper);

  loadUsers(currentPage);

  return main;
};

const userTable = (users: User[]) => {
  const tableHeader = createElement(
    "tr",
    {},
    createElement("th", { className: `p-2 border` }, "ID"),
    createElement("th", { className: "p-2 border" }, "Name"),
    createElement("th", { className: "p-2 border" }, "Email"),
    createElement("th", { className: "p-2 border" }, "Actions")
  );

  const tableRows = users.map((user: User) =>
    createElement(
      "tr",
      {},
      createElement("td", { className: "p-2 border" }, user.id),
      createElement("td", { className: "p-2 border" }, user.name),
      createElement("td", { className: "p-2 border" }, user.email),
      createElement(
        "td",
        { className: "p-2 border flex space-x-2" },
        createElement(
          "button",
          {
            className: "text-yellow-500",
            onclick: () => openEditPopup(user),
          },
          "✏️"
        ),
        createElement(
          "button",
          {
            className: "text-red-500",
            onclick: () => deleteUser(user.id),
          },
          "🗑️"
        )
      )
    )
  );

  return createElement(
    "table",
    { className: "w-full border-collapse" },
    createElement("thead", { className: "bg-gray-200" }, tableHeader),
    createElement("tbody", {}, ...tableRows)
  );
};

const openEditPopup = (user: User) => {
  const form = createElement(
    "form",
    {},
    createElement("input", {
      type: "text",
      id: "editName",
      placeholder: "Name",
      value: user.name,
      className: "mb-2 p-2 border rounded w-full",
    }),
    createElement("input", {
      type: "email",
      id: "editEmail",
      placeholder: "Email",
      value: user.email,
      className: "mb-2 p-2 border rounded w-full",
    }),
    createElement("input", {
      type: "text",
      id: "editPassword",
      placeholder: "Leave empty to keep password same",
      className: "mb-2 p-2 border rounded w-full",
    }),
    createElement("div", { className: "text-red-500 mt-2 hidden error" }),
    createElement(
      "button",
      {
        type: "submit",
        className: "bg-blue-500 text-white p-2 rounded w-full",
      },
      "Update User"
    )
  );

  const name = form.querySelector("#editName") as HTMLInputElement;
  const email = form.querySelector("#editEmail") as HTMLInputElement;
  const password = form.querySelector("#editPassword") as HTMLInputElement;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await UserServices.updateUser(
        user.id,
        name.value,
        email.value,
        password.value
      );
      closePopup(popup);
      window.history.pushState(null, "", "/manageUsers");
      const event = new PopStateEvent("popstate");
      dispatchEvent(event);
    } catch (error) {
      const errorElement = form.querySelector(".error") as HTMLElement;
      errorElement.textContent = `${error}`;
      errorElement.classList.remove("hidden");
    }
  });

  const popup = createPopup(form, () => closePopup(popup));
};

const deleteUser = async (id: number) => {
  try {
    await UserServices.deleteUser(id);
    window.history.pushState(null, "", "/manageUsers");
    const event = new PopStateEvent("popstate");
    dispatchEvent(event);
  } catch (error) {
    console.error(error);
  }
};

const userForm = () => {
  const form = createElement(
    "form",
    { onsubmit: () => {} },
    createElement("input", {
      type: "text",
      id: "name",
      placeholder: "Name",
      className: "mb-2 p-2 border rounded w-full",
    }),
    createElement("input", {
      type: "email",
      id: "email",
      placeholder: "Email",
      className: "mb-2 p-2 border rounded w-full",
    }),
    createElement("input", {
      type: "password",
      id: "password",
      placeholder: "Password",
      className: "mb-2 p-2 border rounded w-full",
    }),
    createElement("input", {
      type: "password",
      id: "confirmPassword",
      placeholder: "Confirm Password",
      className: "mb-2 p-2 border rounded w-full",
    }),
    createElement("div", { className: "text-red-500 mt-2 hidden error" }),
    createElement(
      "button",
      {
        type: "submit",
        className: "bg-green-500 text-white p-2 rounded w-full",
      },
      "Add New User"
    )
  );

  const name = form.querySelector("#name") as HTMLInputElement;
  const email = form.querySelector("#email") as HTMLInputElement;
  const password = form.querySelector("#password") as HTMLInputElement;
  const confirmPassword = form.querySelector(
    "#confirmPassword"
  ) as HTMLInputElement;

  const inputs = [name, email, password, confirmPassword];

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      if (password.value !== confirmPassword.value) {
        throw new Error("Passwords do not match");
      }
      await UserServices.register(name.value, email.value, password.value);
      window.history.pushState(null, "", "/manageUsers");
      const event = new PopStateEvent("popstate");
      dispatchEvent(event);
    } catch (error) {
      const errorElement = form.querySelector(".error") as HTMLElement;
      errorElement.textContent = `${error}`;
      errorElement.classList.remove("hidden");
    }
  });

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const errorElement = form.querySelector(".error") as HTMLElement;
      errorElement.classList.add("hidden");
    });
  });

  return form;
};
