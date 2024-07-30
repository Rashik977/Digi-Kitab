import { updateUser } from "../services/userServices";
import { getUser } from "../services/authServices";
import { createElement } from "../utils/createElement";
import { Navbar } from "../components/userNavigation";

export const render = () => {
  const main = createElement("main", {
    className: "bg-gray-100 min-h-screen flex flex-col",
  });
  const navigation = Navbar();
  const container = createElement("div", {
    className: "flex flex-col items-center justify-center flex-grow p-6",
  });

  const form = createElement("form", {
    className: "bg-white p-8 rounded-lg shadow-lg w-full md:w-1/3",
  });
  form.innerHTML = `
    <h2 class="text-2xl font-bold mb-4 text-center">Update</h2>
    <div class="mb-4">
      <input type="text" placeholder="Name" id="name" class="mt-1 p-2 border rounded w-full">
    </div>
    <div class="mb-4">
      <input type="email" placeholder="Email" id="email" class="mt-1 p-2 border rounded w-full">
    </div>
    <div class="mb-4">
      <input type="password" placeholder="Password (leave it empty to keep the password same)" id="password" class="mt-1 p-2 border rounded w-full">
    </div>
    <div class="text-red-500 mt-2 hidden error"></div>
    <button type="submit" class="bg-blue-600 text-white py-2 rounded w-full hover:bg-blue-700 transition duration-300">Update</button>
  `;

  const name = form.querySelector("#name") as HTMLInputElement;
  const email = form.querySelector("#email") as HTMLInputElement;
  const password = form.querySelector("#password") as HTMLInputElement;

  const inputs = [name, email, password];

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = getUser();
    try {
      if (user) {
        await updateUser(user.id, name.value, email.value, password.value);
      } else {
        throw new Error("User not authenticated");
      }
      window.history.pushState(null, "", "/settings");
      const event = new PopStateEvent("popstate");
      dispatchEvent(event);
    } catch (error) {
      const errorElement = form.querySelector(".error") as HTMLElement;
      errorElement.textContent = `${error}`;
      errorElement.classList.remove("hidden");
    }
  });

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const errorElement = form.querySelector(".error") as HTMLElement;
      errorElement.classList.add("hidden");
    });
  });

  container.appendChild(form);
  main.appendChild(navigation);
  main.appendChild(container);

  return main;
};
