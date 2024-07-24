import { Book } from "../interfaces/Book.interface";
import { createElement } from "../utils/createElement";

export const renderBooks = (books: Book[]) => {
  return books.map((book) =>
    createElement(
      "div",
      {
        className:
          "p-4 border rounded-md shadow-md flex flex-col items-center w-[300px] h-[500px]",
      },
      createElement("img", {
        className: "w-[200px] h-[300px] object-cover",
        src: book.coverPath,
        alt: book.title,
      }),
      createElement(
        "h2",
        { className: "text-lg font-semibold mb-1" },
        book.title
      ),
      createElement(
        "p",
        { className: "text-gray-700 mb-1" },
        `by ${book.author}`
      ),
      createElement(
        "p",
        { className: "text-gray-900 font-bold mb-2" },
        `$${book.price.toFixed(2)}`
      )
    )
  );
};
