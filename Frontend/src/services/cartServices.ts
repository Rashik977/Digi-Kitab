import { Book } from "../interfaces/Book.interface";
import { fetchWithAuth } from "./authServices";
import { fetchBookChapters, setCurrentChapterId } from "./libraryServices";

const CART_STORAGE_KEY = "cart";

const saveCart = (cart: Book[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

const loadCart = (): Book[] => {
  const cartData = localStorage.getItem(CART_STORAGE_KEY);
  return cartData ? JSON.parse(cartData) : [];
};

export const addToCart = async (book: Book) => {
  const cart = loadCart();
  cart.push(book);
  saveCart(cart);
};

export const getCartItems = async (): Promise<Book[]> => {
  return loadCart();
};

export const removeCartItem = async (bookId: number) => {
  const cart = loadCart();
  const updatedCart = cart.filter((item) => item.id !== bookId.toString());
  saveCart(updatedCart);
};

export const placeOrder = async () => {
  const cart = loadCart();
  const orderDetails = {};

  const orderItems = cart.map((item) => ({
    bookId: item.id,
    price: item.price,
  }));

  const response = await fetchWithAuth("http://localhost:3000/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderDetails, orderItems }),
  });

  if (!response.ok) {
    throw new Error("Failed to place order");
  }

  orderItems.forEach(async (item) => {
    const firstChapter = await fetchBookChapters(+item.bookId);
    await setCurrentChapterId(+item.bookId, firstChapter.chapters[0].id);
  });

  // Clear the cart after successful order
  localStorage.removeItem(CART_STORAGE_KEY);

  return response.json();
};

export const isBookInCart = (bookId: number) => {
  const cart = loadCart();
  return cart.some((item) => item.id === bookId.toString());
};
