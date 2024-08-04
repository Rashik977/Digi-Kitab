import { createElement } from "../utils/createElement";
import {
  endSession,
  fetchBookChapters,
  fetchChapterContent,
  setCurrentChapterId,
  startSession,
} from "../services/libraryServices";
import { darkModeToggle } from "../components/darkModeToggle";

const renderChapterList = (
  bookId: number,
  chapters: { id: string; title: string }[],
  currentChapterId: string
) => {
  const chapterListContainer = createElement("div", {
    className:
      "chapter-list bg-gray-100 w-64 h-full fixed left-0 top-0 overflow-y-auto transform -translate-x-full transition-transform duration-300 ease-in-out z-20",
    id: "chapter-sidebar",
  });

  const closeButton = createElement("button", {
    className: "absolute top-2 right-2 text-gray-500 hover:text-gray-700",
    innerHTML: `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    `,
  });
  closeButton.addEventListener("click", toggleSidebar);
  chapterListContainer.appendChild(closeButton);

  const chapterListTitle = createElement("h2", {
    className: "text-xl font-bold mb-4 p-4",
    innerText: "Chapters",
  });
  chapterListContainer.appendChild(chapterListTitle);

  chapters.forEach((chapter) => {
    const chapterLink = createElement("a", {
      href: `/library/${bookId}/chapter/${chapter.id}`,
      innerText: chapter.title || `Chapter ${chapter.id}`,
      className: `block py-2 px-4 text-gray-700 hover:bg-gray-200 cursor-pointer ${
        chapter.id === currentChapterId ? "bg-gray-300" : ""
      }`,
    });

    chapterLink.addEventListener("click", async (event) => {
      event.preventDefault();
      setCurrentChapterId(bookId, chapter.id);
      window.history.pushState(null, "", chapterLink.getAttribute("href"));
      const chapterContent = await fetchChapterContent(bookId, chapter.id);
      renderChapterContent(chapterContent.chapter);
      updateNavigationButtons(bookId, chapters, chapter.id);
      if (window.innerWidth < 768) {
        toggleSidebar();
      }
    });

    chapterListContainer.appendChild(chapterLink);
  });

  return chapterListContainer;
};

const renderChapterContent = (chapter: {
  id: string;
  title: string;
  content: string;
}) => {
  {
    const contentContainer = document.getElementById("chapter-content");
    if (contentContainer) {
      contentContainer.innerHTML = `
      <h2 class="text-2xl font-bold mb-4">${chapter.title}</h2>
      <div class="prose max-w-none">${chapter.content}</div>
    `;
    }
  }
};

const toggleSidebar = () => {
  const sidebar = document.getElementById("chapter-sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  sidebar?.classList.toggle("-translate-x-full");
  overlay?.classList.toggle("hidden");
};

const updateNavigationButtons = (
  bookId: number,
  chapters: { id: string; title: string }[],
  currentChapterId: string
) => {
  const currentIndex = chapters.findIndex((ch) => ch.id === currentChapterId);
  const prevButton = document.getElementById("prev-chapter");
  const nextButton = document.getElementById("next-chapter");

  if (currentIndex > 0) {
    prevButton?.classList.remove("hidden");
    prevButton?.setAttribute("data-chapter-id", chapters[currentIndex - 1].id);
  } else {
    prevButton?.classList.add("hidden");
  }

  if (currentIndex < chapters.length - 1) {
    nextButton?.classList.remove("hidden");
    nextButton?.setAttribute("data-chapter-id", chapters[currentIndex + 1].id);
  } else {
    nextButton?.classList.add("hidden");
  }
};

export const render = async (bookId: number, chapterId: string) => {
  const mainContainer = createElement("div", {
    className:
      "book-reading-container min-h-screen bg-gray-50 relative dark:bg-black dark:text-white",
  });

  // Start session when the book is opened
  await startSession(bookId);

  const topBar = createElement("div", {
    className:
      "bg-white shadow-md py-4 px-20 flex justify-between dark:bg-stone-900",
  });

  const toggleButton = createElement("button", {
    className: "text-gray-700 hover:text-gray-900 focus:outline-none",
    innerHTML: `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    `,
  });

  const library = createElement(
    "button",
    {
      className: "text-gray-700 hover:text-gray-900",
      onclick: async () => {
        await endSession(bookId); // End session when navigating to the library
        window.location.href = "/library";
      },
    },
    "Library"
  );

  toggleButton.addEventListener("click", toggleSidebar);

  // Add overlay for closing sidebar when clicking outside
  const overlay = createElement("div", {
    id: "sidebar-overlay",
    className: "fixed inset-0 bg-black bg-opacity-50 z-10 hidden",
  });
  overlay.addEventListener("click", toggleSidebar);
  mainContainer.appendChild(overlay);

  // Add chapter content container early
  const contentContainer = createElement("div", {
    id: "chapter-content",
    className: "chapter-content p-6 md:ml-64 w-[1000px]",
  });

  const darkMode = darkModeToggle();
  topBar.appendChild(toggleButton);
  topBar.appendChild(darkMode);
  topBar.appendChild(library);
  mainContainer.appendChild(topBar);
  mainContainer.appendChild(contentContainer);

  // Add beforeunload event listener to end session on tab close
  window.addEventListener("beforeunload", async (event) => {
    await endSession(bookId);
    // Optionally, prevent the default unload behavior
    // event.preventDefault();
    // event.returnValue = '';
  });

  try {
    const { chapters } = await fetchBookChapters(bookId);

    const initialChapterId = chapterId || chapters[0].id;

    mainContainer.appendChild(
      renderChapterList(bookId, chapters, initialChapterId)
    );

    const initialChapterContent = await fetchChapterContent(
      bookId,
      initialChapterId
    );
    console.log(contentContainer);

    // Render the initial chapter content
    setTimeout(() => {
      renderChapterContent(initialChapterContent.chapter);
      updateNavigationButtons(bookId, chapters, initialChapterId);
    }, 0);

    // Add Previous and Next buttons
    const navButtonsContainer = createElement("div", {
      className: "flex justify-between mt-4",
    });

    const prevButton = createElement("button", {
      id: "prev-chapter",
      className:
        "bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 hidden",
      innerText: "Previous",
    });

    const nextButton = createElement("button", {
      id: "next-chapter",
      className:
        "bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 hidden",
      innerText: "Next",
    });

    prevButton.addEventListener("click", async () => {
      const prevChapterId = prevButton.getAttribute("data-chapter-id");
      if (prevChapterId) {
        const prevChapterContent = await fetchChapterContent(
          bookId,
          prevChapterId
        );
        setCurrentChapterId(bookId, prevChapterId);
        renderChapterContent(prevChapterContent.chapter);
        updateNavigationButtons(bookId, chapters, prevChapterId);
        window.history.pushState(
          null,
          "",
          `/library/${bookId}/chapter/${prevChapterId}`
        );
      }
    });

    nextButton.addEventListener("click", async () => {
      const nextChapterId = nextButton.getAttribute("data-chapter-id");
      if (nextChapterId) {
        const nextChapterContent = await fetchChapterContent(
          bookId,
          nextChapterId
        );
        setCurrentChapterId(bookId, nextChapterId);
        renderChapterContent(nextChapterContent.chapter);
        updateNavigationButtons(bookId, chapters, nextChapterId);
        window.history.pushState(
          null,
          "",
          `/library/${bookId}/chapter/${nextChapterId}`
        );
      }
    });

    navButtonsContainer.appendChild(prevButton);
    navButtonsContainer.appendChild(nextButton);
    mainContainer.appendChild(navButtonsContainer);
  } catch (error) {
    console.error(error);
    mainContainer.appendChild(
      createElement("p", {
        innerText: "Failed to load book chapters.",
        className: "text-red-600 p-4",
      })
    );
  }

  return mainContainer;
};
