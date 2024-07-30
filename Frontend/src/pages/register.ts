import { register } from "../services/userServices";
import { createElement } from "../utils/createElement";

export const render = () => {
  const container = createElement("div", {
    className: "flex flex-col justify-center items-center h-screen bg-gray-100",
  });

  const registerDiv = createElement("div", {
    className: "bg-white p-8 rounded-lg shadow-lg w-full md:w-1/3",
  });

  const logo = createElement(
    "h1",
    {
      className: "text-4xl font-bold text-center pb-6",
    },
    createElement(
      "span",
      {
        className:
          "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-orange-400",
        style: "text-shadow: 2px 2px 4px rgba(0,0,0,0.1);",
      },
      "Digi-Kitab"
    )
  );

  const form = createElement("form");
  form.innerHTML = `
    <div class="mb-4">
      <input type="text" id="name" placeholder="Name" class="mt-1 p-2 border rounded w-full">
    </div>
    <div class="mb-4">
      <input type="email" id="email" placeholder="Email" class="mt-1 p-2 border rounded w-full">
    </div>
    <div class="mb-4">
      <input type="password" id="password" placeholder="Password" class="mt-1 p-2 border rounded w-full">
    </div>
    <div class="mb-4">
      <input type="password" id="confirmPassword" placeholder="Confirm Password" class="mt-1 p-2 border rounded w-full">
    </div>
    <div class="text-red-500 mt-2 hidden error"></div>
    <button type="submit" class="bg-blue-600 text-white py-2 rounded w-full hover:bg-blue-700 transition duration-300">Register</button>
    <p class="mt-4 text-center">Already have an account? <a href="/login" data-link class="text-blue-600 hover:text-blue-800 transition duration-300">Login</a></p>
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

  container.appendChild(registerDiv);
  registerDiv.appendChild(logo);
  registerDiv.appendChild(form);
  return container;
};
