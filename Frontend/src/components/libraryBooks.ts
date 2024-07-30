import { Book } from "../interfaces/Book.interface";
import { createElement } from "../utils/createElement";
import { fetchUserRating, submitRating } from "../services/bookServices";

const createStarRating = (bookId: number, initialRating: number | null) => {
  const starContainer = createElement("div", { className: "flex" });

  for (let i = 1; i <= 5; i++) {
    const star = createElement("span", {
      className: "text-4xl cursor-pointer",
      innerHTML: "&#9733;",
      "data-rating": i.toString(),
    });

    star.addEventListener("mouseover", () => updateStars(starContainer, i));
    star.addEventListener("mouseout", () =>
      updateStars(starContainer, initialRating || 0)
    );
    star.addEventListener("click", async () => {
      await submitRating(bookId, i);
      window.location.reload();
      const newRating = await fetchUserRating(bookId);
      updateStars(starContainer, newRating || 0);
    });

    starContainer.appendChild(star);
  }

  updateStars(starContainer, initialRating || 0);
  return starContainer;
};

const updateStars = (container: HTMLElement, rating: number) => {
  const stars = container.children;
  for (let i = 0; i < stars.length; i++) {
    stars[i].className = `text-4xl cursor-pointer ${
      i < rating ? "text-yellow-500" : "text-gray-300"
    }`;
  }
};

export const renderLibraryBooks = (books: Book[]) => {
  return Promise.all(
    books.map(async (book) => {
      const initialRating = await fetchUserRating(+book.id);

      return createElement(
        "div",
        {
          className:
            "p-4 border rounded-md shadow-md flex flex-col items-center w-[300px] h-[550px]",
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
        createStarRating(+book.id, initialRating)
      );
    })
  );
};
