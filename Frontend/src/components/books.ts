import { Book } from "../interfaces/Book.interface";
import { addToCart, isBookInCart } from "../services/cartServices";
import { isBookInLibrary } from "../services/libraryServices";
import { createElement } from "../utils/createElement";
import { createStarRating } from "../utils/startRating";
import { showAlert } from "./alert";

// functions to create buy, show in cart and show in library buttons
const createBuyButton = (book: Book, buttonContainer: HTMLElement) => {
  return createElement(
    "button",
    {
      className:
        "text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-700 transition duration-300 bg-blue-500",
      onclick: () => handleBuyClick(book, buttonContainer),
    },
    "Buy"
  );
};

const createShowInCartButton = () => {
  return createElement(
    "button",
    {
      className:
        "bg-orange-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-orange-700 transition duration-300",
      onclick: () => {
        window.location.href = "/checkout";
      },
    },
    "Show in Cart"
  );
};

const createShowInLibraryButton = () => {
  return createElement(
    "button",
    {
      className:
        "bg-green-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-green-700 transition duration-300",
      onclick: () => {
        window.location.href = "/library";
      },
    },
    "Show in Library"
  );
};

// function to handle the buy button click
const handleBuyClick = async (book: Book, buttonContainer: HTMLElement) => {
  await addToCart(book);
  showAlert("Book added to cart", () => {
    buttonContainer.innerHTML = "";
    buttonContainer.appendChild(createShowInCartButton());
  });
};

// function to render books
export const renderBooks = (books: Book[]) => {
  return books.map(async (book) => {
    const isInCart = isBookInCart(parseInt(book.id));
    const isInLibrary = await isBookInLibrary(book.id);
    const buttonContainer = createElement("div");
    isInLibrary
      ? buttonContainer.append(createShowInLibraryButton())
      : isInCart
      ? buttonContainer.append(createShowInCartButton())
      : buttonContainer.append(createBuyButton(book, buttonContainer));
    return createElement(
      "div",
      {
        className:
          "p-4 border rounded-md shadow-md flex flex-col items-center w-[300px] h-[550px] hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition duration-300 dark:bg-neutral-900 dark:text-white dark:border-neutral-900",
      },
      createElement(
        "a",
        {
          href: `/book/${book.id}`,
          "data-link": "true",
        },
        createElement("img", {
          className: "w-[200px] h-[300px] object-cover",
          src: book.coverPath,
          alt: book.title,
        })
      ),
      createElement("h2", { className: " font-semibold mb-2" }, book.title),
      createElement(
        "p",
        { className: "text-gray-400 mb-2 text-sm" },
        `by ${book.author}`
      ),
      createElement(
        "p",
        { className: "text-gray-500 font-bold mb-2" },
        `$${book.price.toFixed(2)}`
      ),
      createElement(
        "div",
        { className: "flex mb-3" },
        ...createStarRating(book.rating)
      ),
      buttonContainer
    );
  });
};
