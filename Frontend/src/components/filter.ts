import { createElement } from "../utils/createElement";

export const FilterComponent = (onApplyFilters: () => void) => {
  const aside = createElement("aside", {
    className: "w-64 p-6 bg-gray-200",
  });

  const categoryHeader = createElement("h2", { className: "mb-4" }, "Category");
  const categorySelect = createElement("select", {
    id: "category",
    className: "mb-4 p-2 w-full",
  });
  ["All", "Fiction", "Non-Fiction"].forEach((category) => {
    const option = createElement("option", { value: category }, category);
    categorySelect.appendChild(option);
  });

  const genreHeader = createElement("h2", { className: "mb-4" }, "Genre");
  const genreSelect = createElement("select", {
    id: "genre",
    className: "mb-4 p-2 w-full",
  });
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

  const ratingInput = createElement("input", {
    id: "rating",
    type: "number",
    className: "mb-4 p-2 w-full",
    placeholder: "Rating (min)",
  });

  const priceMinInput = createElement("input", {
    id: "priceMin",
    type: "number",
    className: "mb-4 p-2 w-full",
    placeholder: "Price Min",
  });

  const priceMaxInput = createElement("input", {
    id: "priceMax",
    type: "number",
    className: "mb-4 p-2 w-full",
    placeholder: "Price Max",
  });

  const applyButton = createElement(
    "button",
    {
      className: "p-2 bg-blue-500 text-white w-full",
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
