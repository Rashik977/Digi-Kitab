import * as BookModel from "../Model/book.model";
import { BadRequestError, NotFoundError } from "../Error/Error";
import { Book, getBookQuery } from "../Interfaces/Book.interface";
import config from "../config";
import path from "path";
import fs from "fs";
import EPub from "epub";

// Get all Books with pagination
export const getBooks = async (query: getBookQuery) => {
  const data = await BookModel.BookModel.getBooks(query);

  for (const book of data) {
    book.coverPath = encodeURI(
      `http://localhost:${config.port}${book.coverPath}`
    );
  }

  if (!data) throw new NotFoundError("No users found");

  const count = await BookModel.BookModel.count(query);
  const meta = {
    page: query.page,
    size: data.length,
    total: +count.count,
  };
  return { data, meta };
};

// Get books by ID
export const getBookById = async (id: number) => {
  const data = await BookModel.BookModel.getBookById(id);

  if (!data) throw new NotFoundError("Book not found");

  data.coverPath = encodeURI(
    `http://localhost:${config.port}${data.coverPath}`
  );
  return data;
};

// Create a new book
export async function createBook(
  file: Express.Multer.File,
  bookDetails: Partial<Book>
) {
  if (!file) {
    throw new BadRequestError("No file uploaded");
  }

  const filePath = path.join(config.book.bookFilePath!, file.originalname);

  fs.writeFileSync(filePath, file.buffer);

  const bookMetadata = await extractMetadata(filePath);

  const book: Book = {
    ...(bookMetadata as Book),
    ...bookDetails,
  };

  await BookModel.BookModel.create(book);
  return { message: "Book created" };
}

async function extractMetadata(filePath: string) {
  return new Promise((resolve, reject) => {
    const epub = new EPub(filePath);
    epub.on("end", async () => {
      let totalChapters = 0;
      const chapters = Object.values(epub.flow);
      for (const chapter of chapters) {
        totalChapters += 1;
      }

      let publicationYear = null;
      if (epub.metadata.date) {
        const dateParts = epub.metadata.date.split("-");
        if (dateParts.length > 0) {
          publicationYear = parseInt(dateParts[0], 10);
        }
      }

      let coverPath = "";
      const coverItem = Object.values(epub.manifest).find((item: any) =>
        item["media-type"]?.startsWith("image")
      );
      if (coverItem) {
        const coverFileName = `${path.basename(
          filePath,
          path.extname(filePath)
        )}_cover.${coverItem["media-type"].split("/")[1]}`;
        coverPath = `/covers/${coverFileName}`;

        await new Promise<void>((resolve, reject) => {
          epub.getImage(coverItem.id, (error, data, mimeType) => {
            if (error) {
              console.error(
                `Failed to extract cover image for ${filePath}:`,
                error
              );
              reject(error);
            } else {
              fs.writeFileSync(
                path.join(config.book.coverPath!, coverFileName),
                data
              );
              resolve();
            }
          });
        });
      }

      resolve({
        title: epub.metadata.title,
        author: epub.metadata.creator,
        genre: "",
        category: "",
        desc: epub.metadata.description,
        epubFilePath: `/Uploads/${path.basename(filePath)}`,
        totalChapters,
        year: isNaN(publicationYear!) ? null : publicationYear,
        price: 1,
        rating: 1,
        cover_path: coverPath,
      });
    });
    epub.on("error", reject);
    epub.parse();
  });
}

// Update a book
export const updateBook = async (id: number, book: Partial<Book>) => {
  const data = await BookModel.BookModel.getBookById(id);

  if (!data) throw new NotFoundError("Book not found");

  await BookModel.BookModel.update(id, book);
  return { message: "Book updated" };
};

// Delete a book
export const deleteBook = async (id: number) => {
  const data = await BookModel.BookModel.getBookById(id);

  if (!data) throw new NotFoundError("Book not found");

  await BookModel.BookModel.delete(id);
  return { message: "Book deleted" };
};

// Rate a book
export async function rateBook(bookId: number, userId: number, rating: number) {
  if (rating < 1 || rating > 5) {
    throw new BadRequestError("Rating must be between 1 and 5");
  }

  const ratingExists = await BookModel.BookModel.checkRatingExists(
    bookId,
    userId
  );

  if (ratingExists) {
    await BookModel.BookModel.updateRating(bookId, userId, rating);
  } else {
    await BookModel.BookModel.createRating(bookId, userId, rating);
  }

  const averageRating = await BookModel.BookModel.calculateAverageRating(
    bookId
  );

  await BookModel.BookModel.updateBookRating(bookId, averageRating);
}

// Get the rating of a book
export async function getRating(
  bookId: number,
  userId: number
): Promise<number | null> {
  const rating = await BookModel.BookModel.getRating(bookId, userId);

  if (!rating) return 0;

  return rating;
}
