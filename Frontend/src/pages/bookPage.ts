// ./pages/bookPage.ts
import { createElement } from "../utils/createElement";
import { fetchBookById } from "../services/bookServices";
import { Navbar } from "../components/userNavigation";

export const render = async (bookId: string) => {
  const book = await fetchBookById(+bookId);

  const main = createElement("main");

  const navigation = Navbar();

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

  main.appendChild(navigation);
  main.appendChild(bookPage);

  return main;
};

// Export the render function as the default export
export default {
  render,
};
