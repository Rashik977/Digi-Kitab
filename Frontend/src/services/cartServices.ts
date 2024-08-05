import { Book } from "../interfaces/Book.interface";
import { fetchWithAuth } from "./authServices";
import { fetchBookChapters, setCurrentChapterId } from "./libraryServices";

const CART_STORAGE_KEY = "cart";

// Save cart to local storage
const saveCart = (cart: Book[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

// Load cart from local storage
const loadCart = (): Book[] => {
  const cartData = localStorage.getItem(CART_STORAGE_KEY);
  return cartData ? JSON.parse(cartData) : [];
};

// Add book to cart
export const addToCart = async (book: Book) => {
  const cart = loadCart();
  cart.push(book);
  saveCart(cart);
};

// Get cart items
export const getCartItems = async (): Promise<Book[]> => {
  return loadCart();
};

// Remove book from cart
export const removeCartItem = async (bookId: number) => {
  const cart = loadCart();
  const updatedCart = cart.filter((item) => item.id !== bookId.toString());
  saveCart(updatedCart);
};

// Place order
export const placeOrder = async () => {
  const cart = loadCart();
  const orderDetails = {};

  const orderItems = cart.map((item) => ({
    bookId: item.id,
    price: item.price,
  }));

  const response = await fetchWithAuth(
    `${import.meta.env.VITE_BACKEND_URL}/orders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderDetails, orderItems }),
    }
  );

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

// Check if book is in cart
export const isBookInCart = (bookId: number) => {
  const cart = loadCart();
  return cart.some((item) => item.id === bookId.toString());
};
