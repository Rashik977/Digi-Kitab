import { createElement } from "../utils/createElement";

export const FilterComponent = (onApplyFilters: () => void) => {
  const aside = createElement("aside", {
    className: "bg-white rounded-lg shadow-md p-6 w-[250px] dark:bg-slate-900",
  });

  const createHeader = (text: string) =>
    createElement(
      "h2",
      { className: "text-lg font-semibold mb-3 dark:text-white" },
      text
    );
  const createSelect = (id: string) =>
    createElement("select", {
      id,
      className:
        "mb-4 p-2 w-full border-2 border-gray-300 rounded-md focus:outline-none focus:border-purple-500",
    });
  const createInput = (id: string, placeholder: string) =>
    createElement("input", {
      id,
      type: "number",
      className:
        "mb-4 p-2 w-full border-2 border-gray-300 rounded-md focus:outline-none focus:border-purple-500",
      placeholder,
    });

  const categoryHeader = createHeader("Category");
  const categorySelect = createSelect("category");
  ["All", "Fiction", "Non-Fiction"].forEach((category) => {
    const option = createElement("option", { value: category }, category);
    categorySelect.appendChild(option);
  });

  const genreHeader = createHeader("Genre");
  const genreSelect = createSelect("genre");
  [
    "All",
    "Romance",
    "Fantasy",
    "Historical",
    "Mystery",
    "Politics",
    "Science",
    "True Crime",
  ].forEach((genre) => {
    const option = createElement("option", { value: genre }, genre);
    genreSelect.appendChild(option);
  });

  const ratingInput = createInput("rating", "Rating (min)");
  const priceMinInput = createInput("priceMin", "Price Min");
  const priceMaxInput = createInput("priceMax", "Price Max");

  const applyButton = createElement(
    "button",
    {
      className:
        "p-3 bg-purple-500 text-white rounded-lg w-full hover:bg-purple-700 transition duration-300",
      onclick: onApplyFilters,
    },
    "Apply Filters"
  );

  aside.appendChild(categoryHeader);
  aside.appendChild(categorySelect);
  aside.appendChild(genreHeader);
  aside.appendChild(genreSelect);
  aside.appendChild(ratingInput);
  aside.appendChild(priceMinInput);
  aside.appendChild(priceMaxInput);
  aside.appendChild(applyButton);

  return aside;
};
