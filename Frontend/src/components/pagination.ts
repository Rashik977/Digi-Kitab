import { createElement } from "../utils/createElement";

export const renderPagination = (
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
) => {
  const paginationContainer = createElement("div", {
    className: "flex space-x-2 mt-4",
  });

  if (totalPages <= 0) return paginationContainer;

  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const pageRange = 5;
  let startPage = Math.max(safeCurrentPage - Math.floor(pageRange / 2), 1);
  const endPage = Math.min(startPage + pageRange - 1, totalPages);

  if (endPage === totalPages) {
    startPage = Math.max(totalPages - pageRange + 1, 1);
  }

  for (let page = startPage; page <= endPage; page++) {
    const button = createElement(
      "button",
      {
        className: `px-3 py-1 border rounded-md ${
          page === safeCurrentPage
            ? "bg-blue-500 text-white"
            : "bg-white text-blue-500"
        }`,
        onclick: () => onPageChange(page),
      },
      page.toString()
    );

    paginationContainer.appendChild(button);
  }

  return paginationContainer;
};
