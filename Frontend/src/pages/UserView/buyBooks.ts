import { createElement } from "../../utils/createElement";
import { Navbar } from "../../components/userNavigation";
import { fetchBooks } from "../../services/bookServices";
import { renderBooks } from "../../components/books";
import { renderPagination } from "../../components/pagination";
import { FilterComponent } from "../../components/filter";

export const render = () => {
  const main = createElement("main", {
    className: `min-h-screen flex flex-col dark:bg-zinc-950`,
  });
  const navigation = Navbar();
  const section = createElement("section", {
    className: "mx-1/2 flex gap-10 flex-col lg:flex-row",
  });
  const aside = createElement("aside", {
    className: "w-full p-5 lg:w-[700px]",
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
    className: " w-full lg:w-1/3 flex gap-2 mb-4 ",
  });

  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(searchButton);

  const filters = {
    category: "",
    genre: "",
    rating: 0,
    priceMin: 0,
    priceMax: 0,
    newlyAdded: false,
  };

  let currentPage = 1;
  const pageSize = 8;
  let currentQuery = "";

  const totalPages = async () => {
    const { meta } = await fetchBooks(currentPage, pageSize, {
      ...filters,
      q: currentQuery,
    });
    const { total, size } = meta;
    return Math.ceil(total / size);
  };

  const loadBooks = async (page: number) => {
    try {
      const { data: books, meta } = await fetchBooks(page, pageSize, {
        ...filters,
        q: currentQuery,
      });
      container.innerHTML = ""; // Clear previous content
      container.appendChild(booksContainer);
      booksContainer.innerHTML = ""; // Clear previous books

      // Render books
      renderBooks(books).forEach(async (bookElement) =>
        booksContainer.appendChild(await bookElement)
      );

      // Render pagination
      container.appendChild(
        renderPagination(meta.page, await totalPages(), loadBooks)
      );
    } catch (error) {
      console.error("Failed to load books:", error);
    }
  };

  const applyFilters = () => {
    filters.category = (
      document.getElementById("category") as HTMLSelectElement
    ).value;
    filters.genre = (
      document.getElementById("genre") as HTMLInputElement
    ).value;
    filters.rating = +(document.getElementById("rating") as HTMLInputElement)
      .value;
    filters.priceMin = +(
      document.getElementById("priceMin") as HTMLInputElement
    ).value;
    filters.priceMax = +(
      document.getElementById("priceMax") as HTMLInputElement
    ).value;

    loadBooks(currentPage);
  };

  searchButton.addEventListener("click", () => {
    currentQuery = (document.getElementById("searchInput") as HTMLInputElement)
      .value;
    loadBooks(currentPage);
  });

  main.appendChild(navigation);
  searchWrapper.appendChild(searchContainer);
  main.appendChild(searchWrapper);
  aside.appendChild(FilterComponent(applyFilters));
  section.appendChild(aside);
  section.appendChild(container);
  main.appendChild(section);

  loadBooks(currentPage);

  return main;
};
