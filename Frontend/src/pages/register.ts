import { register } from "../utils/api";
import { createElement } from "../utils/createElement";

export const render = () => {
  const container = createElement("div", {
    className: "flex justify-center items-center h-screen",
  });

  const form = createElement("form", {
    className: "bg-white p-6 rounded shadow-md",
  });
  form.innerHTML = `
    <h2 class="text-2xl mb-4">Register</h2>
    <input type="text" placeholder="Name" id="name" class="mb-2 p-2 border rounded w-full">
    <input type="email" placeholder="Email" id="email" class="mb-2 p-2 border rounded w-full">
    <input type="password" placeholder="Password" id="password" class="mb-2 p-2 border rounded w-full">
    <input type="password" placeholder="Confirm Password" id="confirmPassword" class="mb-4 p-2 border rounded w-full">
    <div class="text-red-500 mt-2 hidden error"></div>
    <button type="submit" class="bg-blue-500 text-white p-2 rounded w-full">Register</button>
    <p class="mt-4">Already have an account? <a href="/login" data-link class="text-blue-500">Login</a></p>
  `;

  const name = form.querySelector("#name") as HTMLInputElement;
  const email = form.querySelector("#email") as HTMLInputElement;
  const password = form.querySelector("#password") as HTMLInputElement;
  const confirmPassword = form.querySelector(
    "#confirmPassword"
  ) as HTMLInputElement;

  const inputs = [name, email, password, confirmPassword];

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      if (password.value !== confirmPassword.value) {
        throw new Error("Passwords do not match");
      }
      await register(name.value, email.value, password.value);
      window.history.pushState(null, "", "/login");
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
  return container;
};
