import { getUser, removeToken } from "../services/authServices";
import { login } from "../services/userServices";
import { createElement } from "../utils/createElement";

export const render = () => {
  // Function to initialize the logout logic
  const initializeLogout = () => {
    removeToken();
  };

  initializeLogout();

  const container = createElement("div", {
    className: "flex flex-col justify-center items-center h-screen bg-gray-100",
  });

  const loginDiv = createElement("div", {
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
      <input type="email" id="email" placeholder="Email" class="mt-1 p-2 border rounded w-full">
    </div>
    <div class="mb-4">
      <input type="password" id="password" placeholder="Password" class="mt-1 p-2 border rounded w-full">
    </div>
    <button type="submit" class="bg-blue-600 text-white py-2 rounded w-full hover:bg-blue-700 transition duration-300">Login</button>
    <div class="text-red-500 mt-2 hidden error"></div>
    <p class="mt-4 text-center">Don't have an account? <a href="/register" data-link class="text-blue-600 hover:text-blue-800 transition duration-300">Register</a></p>
  `;

  const email = form.querySelector("#email") as HTMLInputElement;
  const password = form.querySelector("#password") as HTMLInputElement;

  const inputs = [email, password];

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await login(email.value, password.value); // Perform login

      // Redirect to dashboard or another route upon successful login
      if (getUser()?.role === "super") {
        window.history.pushState(null, "", "/manageUsers");
        window.dispatchEvent(new Event("popstate")); // Trigger routing
      } else if (getUser()?.role === "user") {
        window.history.pushState(null, "", "/buyBooks");
        window.dispatchEvent(new Event("popstate")); // Trigger routing
      } else if (getUser()?.role === "staff") {
        window.history.pushState(null, "", "/manageBooks");
        window.dispatchEvent(new Event("popstate")); // Trigger routing
      } else {
        window.history.pushState(null, "", "/404");
        window.dispatchEvent(new Event("popstate")); // Trigger routing
      }
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

  container.appendChild(loginDiv);
  loginDiv.appendChild(logo);
  loginDiv.appendChild(form);
  return container;
};
