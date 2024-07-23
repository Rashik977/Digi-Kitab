export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  desc: string;
  price: number;
  rating: number;
  totalChapters: number;
  category: string;
  year: number;
  epubFilePath: string;
}

export interface getBookQuery {
  q?: string;
  page?: number;
  size?: number;
}
