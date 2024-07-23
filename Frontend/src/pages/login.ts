import { login } from "../services/apiServices";
import { createElement } from "../utils/createElement";

export const render = () => {
  const container = createElement("div", {
    className: "flex flex-col justify-center items-center h-screen",
    style:
      "background-image: url('/images/bookBG.jpg'); background-size: cover;",
  });

  const alpha = createElement("div", {
    className: "bg-black bg-opacity-50 w-full h-full absolute",
  });

  const loginDiv = createElement("div", {
    className: "z-10 bg-white p-10 rounded shadow-md",
  });

  const logo = createElement("h1", {
    className: "text-4xl text-teal-700 text-center pb-10 ",
  });

  logo.textContent = "Digi-Kitab";

  const form = createElement("form");
  form.innerHTML = `
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

  container.appendChild(alpha);
  container.appendChild(loginDiv);
  loginDiv.appendChild(logo);
  loginDiv.appendChild(form);
  return container;
};
