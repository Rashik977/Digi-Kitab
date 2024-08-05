import { AdminNavbar } from "../../components/adminNavigation";
import { Book } from "../../interfaces/Book.interface";
import * as BookServices from "../../services/bookServices";
import { createElement } from "../../utils/createElement";
import { createPopup, closePopup } from "../../components/popUp";
import { renderPagination } from "../../components/pagination";
import { getUser, logOut } from "../../services/authServices";

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
    const { meta } = await BookServices.fetchBooks(currentPage, pageSize, {
      q: currentQuery,
    });
    const { total, size } = meta;
    return Math.ceil(total / size);
  };

  const loadBook = async (page: number) => {
    try {
      const { data: Book, meta } = await BookServices.fetchBooks(
        page,
        pageSize,
        {
          q: currentQuery,
        }
      );
      container.innerHTML = ""; // Clear previous content
      container.appendChild(bookTable(Book));
      container.appendChild(
        renderPagination(meta.page, await totalPages(), loadBook)
      );
    } catch (error) {
      console.error("Failed to load Book:", error);
    }
  };

  const searchInput = createElement("input", {
    type: "text",
    id: "searchInput",
    className: "p-2 border rounded w-full",
    placeholder: "Search for Book...",
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
    loadBook(currentPage);
  });

  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(searchButton);

  const user = getUser();

  const logoutButtonContainer = createElement("div", {
    className: "w-full flex justify-center items-center",
  });

  const logoutButton = createElement("button", {
    className: "bg-red-500 text-white p-2 rounded w-1/12",
    innerText: "Logout",
    onclick: logOut,
  });

  logoutButtonContainer.appendChild(logoutButton);

  if (user && user.role === "super") {
    main.appendChild(navigation);
  }

  wrapper.appendChild(bookForm());
  wrapper.appendChild(searchContainer);
  wrapper.appendChild(container);
  if (user && user.role === "staff") {
    wrapper.appendChild(logoutButtonContainer);
  }
  main.appendChild(wrapper);

  loadBook(currentPage);

  return main;
};

const bookTable = (Book: Book[]) => {
  const tableHeader = createElement(
    "tr",
    {},
    createElement("th", { className: `p-2 border` }, "ID"),
    createElement("th", { className: "p-2 border" }, "Title"),
    createElement("th", { className: "p-2 border" }, "Category"),
    createElement("th", { className: "p-2 border" }, "Genre"),
    createElement("th", { className: "p-2 border" }, "Price"),
    createElement("th", { className: "p-2 border" }, "Rating"),
    createElement("th", { className: "p-2 border" }, "Actions")
  );

  const tableRows = Book.map((book: Book) =>
    createElement(
      "tr",
      {},
      createElement("td", { className: "p-2 border" }, book.id),
      createElement("td", { className: "p-2 border" }, book.title),
      createElement("td", { className: "p-2 border" }, book.category),
      createElement("td", { className: "p-2 border" }, book.genre),
      createElement("td", { className: "p-2 border" }, book.price.toString()),
      createElement("td", { className: "p-2 border" }, book.rating.toString()),
      createElement(
        "td",
        { className: "p-2 border flex space-x-2" },
        createElement(
          "button",
          {
            className: "text-yellow-500",
            onclick: () => openEditPopup(book),
          },
          "✏️"
        ),
        createElement(
          "button",
          {
            className: "text-red-500",
            onclick: () => deletebook(parseInt(book.id)),
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

const openEditPopup = (book: Book) => {
  const form = createElement(
    "form",
    {},
    createElement("input", {
      type: "text",
      id: "editTitle",
      placeholder: "Title",
      value: book.title,
      className: "mb-2 p-2 border rounded w-full",
    }),
    createElement("input", {
      type: "text",
      id: "editAuthor",
      placeholder: "Author",
      value: book.author,
      className: "mb-2 p-2 border rounded w-full",
    }),
    createElement("input", {
      type: "text",
      id: "editGenre",
      placeholder: "Genre",
      value: book.genre,
      className: "mb-2 p-2 border rounded w-full",
    }),
    createElement(
      "select",
      {
        id: "editCategory",
        className: "mb-4 p-2 w-full",
      },
      createElement("option", { value: "Fiction" }, "Fiction"),
      createElement("option", { value: "Non-Fiction" }, "Non-Fiction")
    ),
    createElement("input", {
      type: "number",
      id: "editPrice",
      placeholder: "Price",
      value: book.price.toString(),
      className: "mb-2 p-2 border rounded w-full",
    }),
    createElement("input", {
      type: "number",
      id: "editRating",
      placeholder: "Rating",
      value: book.rating.toString(),
      className: "mb-2 p-2 border rounded w-full",
    }),
    createElement("input", {
      type: "number",
      id: "editYear",
      placeholder: "Year",
      value: book.year,
      className: "mb-2 p-2 border rounded w-full",
    }),
    createElement("textarea", {
      id: "editDescription",
      placeholder: "Description",
      value: book.desc,
      className: "mb-2 p-2 border rounded w-full",
    }),
    createElement("div", { className: "text-red-500 mt-2 hidden error" }),
    createElement(
      "button",
      {
        type: "submit",
        className: "bg-blue-500 text-white p-2 rounded w-full",
      },
      "Update book"
    )
  );

  const title = form.querySelector("#editTitle") as HTMLInputElement;
  const author = form.querySelector("#editAuthor") as HTMLInputElement;
  const genre = form.querySelector("#editGenre") as HTMLInputElement;
  const category = form.querySelector("#editCategory") as HTMLInputElement;
  const price = form.querySelector("#editPrice") as HTMLInputElement;
  const rating = form.querySelector("#editRating") as HTMLInputElement;
  const year = form.querySelector("#editYear") as HTMLInputElement;
  const description = form.querySelector(
    "#editDescription"
  ) as HTMLInputElement;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const toUpdate = {
        title: title.value,
        author: author.value,
        genre: genre.value,
        category: category.value,
        price: parseInt(price.value),
        rating: parseInt(rating.value),
        year: parseInt(year.value),
        desc: description.value,
      };
      await BookServices.updateBook(parseInt(book.id), toUpdate);
      closePopup(popup);
      window.history.pushState(null, "", "/manageBooks");
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

const deletebook = async (id: number) => {
  try {
    await BookServices.deleteBook(id);
    window.history.pushState(null, "", "/manageBooks");
    const event = new PopStateEvent("popstate");
    dispatchEvent(event);
  } catch (error) {
    console.error(error);
  }
};

const bookForm = () => {
  const form = createElement(
    "form",
    { onsubmit: () => {} },
    createElement("input", {
      type: "file",
      id: "file",
    }),
    createElement("input", {
      type: "text",
      id: "genre",
      placeholder: "genre",
      className: "mb-2 p-2 border rounded w-full",
    }),
    createElement("input", {
      type: "number",
      id: "price",
      placeholder: "Price",
      className: "mb-2 p-2 border rounded w-full",
    }),
    createElement("input", {
      type: "number",
      id: "rating",
      placeholder: "Rating",
      className: "mb-2 p-2 border rounded w-full",
    }),
    createElement(
      "select",
      {
        id: "category",
        className: "mb-4 p-2 w-full",
      },
      createElement("option", { value: "Fiction" }, "Fiction"),
      createElement("option", { value: "Non-Fiction" }, "Non-Fiction")
    ),
    createElement("div", { className: "text-red-500 mt-2 hidden error" }),
    createElement(
      "button",
      {
        type: "submit",
        className: "bg-green-500 text-white p-2 rounded w-full",
      },
      "Add New book"
    )
  );

  const genre = form.querySelector("#genre") as HTMLInputElement;
  const category = form.querySelector("#category") as HTMLInputElement;
  const price = form.querySelector("#price") as HTMLInputElement;
  const rating = form.querySelector("#rating") as HTMLInputElement;
  const file = form.querySelector("#file") as HTMLInputElement;

  const inputs = [genre, category, price, rating];

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const bookDetails = {
      genre: genre.value,
      category: category.value,
      price: parseInt(price.value),
      rating: parseInt(rating.value),
    };
    try {
      if (file.files && file.files.length > 0) {
        await BookServices.uploadBook(bookDetails, file.files[0]);
      } else {
        throw new Error("Please select a file");
      }
      window.history.pushState(null, "", "/manageBooks");
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
