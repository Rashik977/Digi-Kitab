import { createElement } from "../utils/createElement";
import { Navbar } from "../components/userNavigation";
import { fetchBooks } from "../services/bookServices";
import { renderBooks } from "../components/books";
import { renderPagination } from "../components/pagination";

export const render = () => {
  const main = createElement("main");
  const navigation = Navbar();
  const container = createElement("div", {
    className: "p-6 flex flex-col items-center justify-center",
  });

  const booksContainer = createElement("div", {
    className: "flex flex-wrap gap-10 justify-center",
  });

  let currentPage = 1;
  const pageSize = 8;

  const totalPages = async () => {
    const { meta } = await fetchBooks(currentPage, pageSize);
    const { total, size } = meta;
    return Math.ceil(total / size);
  };

  const loadBooks = async (page: number) => {
    try {
      const { data: books, meta } = await fetchBooks(page, pageSize);
      container.innerHTML = ""; // Clear previous content
      container.appendChild(booksContainer);
      booksContainer.innerHTML = ""; // Clear previous books

      // Render books
      renderBooks(books).forEach((bookElement) =>
        booksContainer.appendChild(bookElement)
      );

      // Render pagination
      container.appendChild(
        renderPagination(meta.page, await totalPages(), loadBooks)
      );
    } catch (error) {
      console.error("Failed to load books:", error);
    }
  };

  main.appendChild(navigation);
  main.appendChild(container);

  loadBooks(currentPage);

  return main;
};
