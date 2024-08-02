// ./pages/bookPage.ts
import { createElement } from "../utils/createElement";
import { fetchBookById } from "../services/bookServices";
import { Navbar } from "../components/userNavigation";
import { Book } from "../interfaces/Book.interface";
import { addToCart, isBookInCart } from "../services/cartServices";
import { showAlert } from "../components/alert";
import { isBookInLibrary } from "../services/libraryServices";

export const render = async (bookId: string) => {
  const book = await fetchBookById(+bookId);

  const main = createElement("main", {
    className: "min-h-screen dark:bg-zinc-900 dark:text-white",
  });

  const navigation = Navbar();

  const handleBuyClick = async (book: Book, buttonContainer: HTMLElement) => {
    await addToCart(book);
    showAlert("Book added to cart", () => {
      buttonContainer.innerHTML = "";
      buttonContainer.appendChild(createShowInCartButton());
    });
  };

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

  const bookPage = createElement("div", {
    className:
      "book-page p-6 flex flex-col justify-center items-center gap-10 lg:px-80",
  });
  bookPage.innerHTML = `
    <img src="${book.coverPath}" alt="${book.title} cover" class="mt-4 w-auto h-[300px] object-cover lg:h-[500px] "/>
    <h1 class="text-2xl font-bold">${book.title}</h1>
    <p><strong>Author:</strong> ${book.author}</p>
    <p><strong>Genre:</strong> ${book.genre}</p>
    <p><strong>Description:</strong> ${book.desc}</p>
    <p><strong>Publication Year:</strong> ${book.year}</p>

  `;

  const isInCart = isBookInCart(parseInt(book.id));
  const isInLibrary = await isBookInLibrary(book.id);
  const buttonContainer = createElement("div");
  const button = isInLibrary
    ? buttonContainer.append(createShowInLibraryButton())
    : isInCart
    ? buttonContainer.append(createShowInCartButton())
    : buttonContainer.append(createBuyButton(book, buttonContainer));

  bookPage.appendChild(buttonContainer);
  main.appendChild(navigation);
  main.appendChild(bookPage);

  return main;
};

// Export the render function as the default export
export default {
  render,
};
