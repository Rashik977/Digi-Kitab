import { createElement } from "../../utils/createElement";
import {
  getCartItems,
  removeCartItem,
  placeOrder,
} from "../../services/cartServices";
import { showAlert } from "../../components/alert";
import { Navbar } from "../../components/userNavigation";

export const render = async () => {
  const cartItems = await getCartItems();

  const main = createElement("main", {
    className: "min-h-screen dark:bg-zinc-900 dark:text-white",
  });
  const navigation = Navbar();

  const removeItem = async (bookId: number) => {
    await removeCartItem(bookId);
    window.location.reload(); // Reload the page to reflect changes
  };

  const handleCheckout = async () => {
    await placeOrder();
    showAlert("Order placed successfully", () => {
      window.location.href = "/library"; // Redirect to user's library
    });
  };

  const totalAmount = cartItems.reduce((total, item) => total + item.price, 0);

  const section = createElement(
    "div",
    { className: "container mx-auto p-4" },
    createElement("h1", { className: "text-2xl font-bold mb-4" }, "Checkout"),
    createElement(
      "div",
      { className: "grid grid-cols-1 lg:grid-cols-2 gap-8" },
      // Left column: Cart items
      createElement(
        "div",
        { className: "space-y-4" },
        ...cartItems.map((item) =>
          createElement(
            "div",
            {
              className:
                "flex justify-between items-center border p-2 rounded-md shadow-sm",
            },
            createElement(
              "span",
              { className: "text-lg font-semibold" },
              item.title
            ),
            createElement(
              "span",
              { className: "text-lg font-semibold" },
              `$${item.price.toFixed(2)}`
            ),
            createElement(
              "button",
              {
                className: "bg-red-500 text-white px-3 py-1 rounded-md",
                onclick: () => removeItem(parseInt(item.id)),
              },
              "Remove"
            )
          )
        )
      ),
      // Right column: Order details
      createElement(
        "div",
        {
          className: "p-4 border rounded-md shadow-md flex flex-col space-y-4",
        },
        createElement(
          "h2",
          { className: "text-xl font-semibold border-b pb-2" },
          "Order Summary"
        ),
        createElement(
          "div",
          { className: "flex justify-between items-center" },
          createElement(
            "span",
            { className: "text-lg font-semibold" },
            "Total:"
          ),
          createElement(
            "span",
            { className: "text-lg font-semibold" },
            `$${totalAmount.toFixed(2)}`
          )
        ),
        createElement(
          "button",
          {
            className: "bg-green-500 text-white px-4 py-2 rounded-md",
            onclick: handleCheckout,
          },
          "Place Order"
        )
      )
    )
  );

  main.append(navigation);
  main.append(section);

  return main;
};
