import { updateUser } from "../services/userServices";
import { removeToken } from "../services/authServices";
import { createElement } from "../utils/createElement";
import { Navbar } from "../components/userNavigation";

export const render = () => {
  const main = createElement("main");
  const navigation = Navbar();
  const container = createElement("div", {
    className: "p-6 flex flex-col items-center justify-center gap-10",
  });

  const form = createElement("form", {
    className: "bg-white p-6 rounded shadow-md",
  });
  form.innerHTML = `
    <h2 class="text-2xl mb-4">Update</h2>
    <input type="text" placeholder="Name" id="name" class="mb-2 p-2 border rounded w-full">
    <input type="email" placeholder="Email" id="email" class="mb-2 p-2 border rounded w-full">
    <input type="password" placeholder="Password" id="password" class="mb-2 p-2 border rounded w-full">
    <div class="text-red-500 mt-2 hidden error"></div>
    <button type="submit" class="bg-blue-500 text-white p-2 rounded w-full">Update</button>
  `;

  const logoutButton = createElement(
    "button",
    { className: "bg-red-500 text-white p-2 rounded" },
    "Logout"
  );

  const name = form.querySelector("#name") as HTMLInputElement;
  const email = form.querySelector("#email") as HTMLInputElement;
  const password = form.querySelector("#password") as HTMLInputElement;

  const inputs = [name, email, password];

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await updateUser(name.value, email.value, password.value);
      window.history.pushState(null, "", "/dashboard");
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

  logoutButton.addEventListener("click", () => {
    removeToken();
    window.history.pushState(null, "", "/login");
    const event = new PopStateEvent("popstate");
    dispatchEvent(event);
  });

  container.appendChild(form);
  container.appendChild(logoutButton);
  main.appendChild(navigation);
  main.appendChild(container);

  return main;
};
