import { Knex } from "knex";
import fs from "fs";
import path from "path";
import EPub from "epub";

const TABLE_NAME = "books";
const EBOOKS_DIR = `C:/Users/rasik/Documents/web projects/ebooks/Non-Fiction`;

// Example genre and category mapping
const genreMapping: {
  [key: string]: { genre: string };
} = {
  "Killers of the Flower Moon": { genre: "History" },
  "Sapiens: A Brief History of Humankind": { genre: "History" },
  "The Soul of America": { genre: "History" },
  "How to Change Your Mind": { genre: "Science" },
  "I'll Be Gone in the Dark": { genre: "True Crime" },
  "Facts and Fears": { genre: "Politics" },
};

/**
 * Read metadata from an EPUB file.
 * @param filePath - The path to the EPUB file.
 */
const readEpubMetadata = (filePath: string) =>
  new Promise((resolve, reject) => {
    const epub = new EPub(filePath);
    epub.on("end", async () => {
      let totalChapters = 0;

      // Calculate total words in the book
      const chapters = Object.values(epub.flow);
      for (const chapter of chapters) {
        totalChapters += 1;
      }

      // Extract year from date if available
      let publicationYear = null;
      if (epub.metadata.date) {
        const dateParts = epub.metadata.date.split("-");
        if (dateParts.length > 0) {
          publicationYear = parseInt(dateParts[0], 10);
        }
      }

      // Determine genre and category based on the mapping
      const genreCategory = genreMapping[epub.metadata.title] || {
        genre: "Unknown",
      };

      resolve({
        title: epub.metadata.title,
        author: epub.metadata.creator,
        genre: genreCategory.genre,
        category: "Non-Fiction",
        desc: epub.metadata.description,
        epubFilePath: filePath,
        totalChapters: totalChapters,
        year: isNaN(publicationYear!) ? null : publicationYear, // Handle cases where the year is not a number
        price: Math.floor(Math.random() * 5) + 1,
        rating: Math.floor(Math.random() * 5) + 1,
      });
    });
    epub.on("error", reject);
    epub.parse();
  });

export async function seed(knex: Knex): Promise<void> {
  // Read all EPUB files from the directory
  const files = fs
    .readdirSync(EBOOKS_DIR)
    .filter((file) => file.endsWith(".epub"));

  // Read metadata from all EPUB files
  const books = await Promise.all(
    files.map((file) => readEpubMetadata(path.join(EBOOKS_DIR, file)))
  );

  // Insert book metadata into the database
  await knex(TABLE_NAME).insert(books);
}
