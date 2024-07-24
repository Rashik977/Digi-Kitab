import { createElement } from "../utils/createElement";

export const renderPagination = (
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
) => {
  const paginationContainer = createElement("div", {
    className: "flex space-x-2 mt-4",
  });

  // Prevent rendering of pagination if there are no pages
  if (totalPages <= 0) return paginationContainer;

  // Ensure currentPage is within the valid range
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  // Page numbers to display, limiting them around the current page
  const pageRange = 5; // Adjust this to show more or fewer page numbers
  let startPage = Math.max(safeCurrentPage - Math.floor(pageRange / 2), 1);
  const endPage = Math.min(startPage + pageRange - 1, totalPages);

  // Adjust startPage if endPage is at the last page
  if (endPage === totalPages) {
    startPage = Math.max(totalPages - pageRange + 1, 1);
  }

  // Create buttons for each page in the range
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
