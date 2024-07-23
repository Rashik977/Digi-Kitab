import { login } from "../utils/api";
import { createElement } from "../utils/createElement";

export const render = () => {
  const container = createElement("div", {
    className: "flex justify-center items-center h-screen",
  });

  const form = createElement("form", {
    className: "bg-white p-6 rounded shadow-md",
  });
  form.innerHTML = `
    <h2 class="text-2xl mb-4">Login</h2>
    <input type="email" id="email" placeholder="Email" class="mb-2 p-2 border rounded w-full">
    <input type="password" id="password" placeholder="Password" class="mb-4 p-2 border rounded w-full">
    <button type="submit" class="bg-blue-500 text-white p-2 rounded w-full">Login</button>
    <div class="text-red-500 mt-2 hidden error"></div>
    <p class="mt-4">Don't have an account? <a href="/register" data-link class="text-blue-500">Register</a></p>
  `;

  const email = form.querySelector("#email") as HTMLInputElement;
  const password = form.querySelector("#password") as HTMLInputElement;

  const inputs = [email, password];

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await login(email.value, password.value); // Perform login

      // Redirect to dashboard or another route upon successful login
      window.history.pushState(null, "", "/dashboard");
      window.dispatchEvent(new Event("popstate")); // Trigger routing
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
