import { createElement } from "../utils/createElement";
import { Navbar } from "../components/userNavigation";
import { fetchLibraryBooks } from "../services/libraryServices";
import { renderPagination } from "../components/pagination";
import { renderLibraryBooks } from "../components/libraryBooks";

export const render = () => {
  const main = createElement("main", {
    className: `min-h-screen flex flex-col dark:bg-zinc-950 dark:text-white`,
  });
  const navigation = Navbar();
  const section = createElement("section", {
    className: "mx-auto flex gap-10",
  });
  const container = createElement("div", {
    className: "p-6 flex flex-col items-center justify-center",
  });

  const booksContainer = createElement("div", {
    className: "flex flex-wrap gap-10 justify-center",
  });

  const searchInput = createElement("input", {
    type: "text",
    id: "searchInput",
    className: "p-2 border rounded w-full",
    placeholder: "Search for books...",
  });

  const searchButton = createElement("button", {
    className:
      "p-2 border bg-purple-500 text-white  rounded-lg hover:bg-purple-700 transition duration-300 dark:border-purple-700",
    innerText: "Search",
  });

  const searchWrapper = createElement("div", {
    className: "w-full flex justify-center p-10",
  });

  const searchContainer = createElement("div", {
    className: "w-full lg:w-1/3 flex gap-2 mb-4  ",
  });

  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(searchButton);

  let currentPage = 1;
  const pageSize = 8;
  let currentQuery = "";

  const totalPages = async () => {
    const { meta } = await fetchLibraryBooks(
      currentPage,
      pageSize,
      currentQuery
    );
    const { total, size } = meta;
    return Math.ceil(total / size);
  };

  const loadLibraryBooks = async (page: number) => {
    try {
      const { data: books, meta } = await fetchLibraryBooks(
        page,
        pageSize,
        currentQuery
      );
      container.innerHTML = ""; // Clear previous content
      container.appendChild(booksContainer);
      booksContainer.innerHTML = ""; // Clear previous books

      // Render books
      // Await the promise returned by renderLibraryBooks
      const bookElements = await renderLibraryBooks(books);

      // Check if bookElements is an array and append each element to the container
      if (Array.isArray(bookElements)) {
        bookElements.forEach((bookElement) => {
          if (bookElement) {
            booksContainer.appendChild(bookElement);
          }
        });
      }

      // Render pagination
      container.appendChild(
        renderPagination(meta.page, await totalPages(), loadLibraryBooks)
      );
    } catch (error) {
      console.error("Failed to load library books:", error);
    }
  };

  searchButton.addEventListener("click", () => {
    currentQuery = (document.getElementById("searchInput") as HTMLInputElement)
      .value;
    loadLibraryBooks(currentPage);
  });

  main.appendChild(navigation);
  searchWrapper.appendChild(searchContainer);
  main.appendChild(searchWrapper);
  section.appendChild(container);
  main.appendChild(section);

  loadLibraryBooks(currentPage);

  return main;
};
