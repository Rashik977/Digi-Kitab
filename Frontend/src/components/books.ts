import { Book } from "../interfaces/Book.interface";
import { createElement } from "../utils/createElement";

const createStarRating = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const starClass = i <= rating ? "text-yellow-500" : "text-gray-300";
    stars.push(
      createElement("span", { className: starClass, innerHTML: "&#9733;" }) // Unicode for star symbol
    );
  }
  return stars;
};

export const renderBooks = (books: Book[]) => {
  return books.map((book) =>
    createElement(
      "a",
      {
        href: `/book/${book.id}`,
        className:
          "p-4 border rounded-md shadow-md flex flex-col items-center w-[300px] h-[500px]",
        "data-link": "true",
      },
      createElement("img", {
        className: "w-[200px] h-[300px] object-cover",
        src: book.coverPath,
        alt: book.title,
      }),
      createElement(
        "h2",
        { className: "text-base font-semibold mb-1" },
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
      ),
      createElement(
        "div",
        { className: "flex mb-2" },
        ...createStarRating(book.rating)
      )
    )
  );
};
