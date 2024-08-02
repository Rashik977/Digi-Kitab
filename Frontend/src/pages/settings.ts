import { updateUser } from "../services/userServices";
import { getUser } from "../services/authServices";
import { createElement } from "../utils/createElement";
import { Navbar } from "../components/userNavigation";
import { getDarkMode, setDarkMode } from "../utils/darkMode";

export const render = () => {
  const main = createElement("main", {
    className: `min-h-screen flex flex-col`,
  });
  const navigation = Navbar();
  const container = createElement("div", {
    className:
      "flex flex-col items-center justify-center flex-grow p-6 dark:bg-zinc-950",
  });

  const form = createElement("form", {
    className:
      "bg-white p-8 rounded-lg shadow-lg w-full md:w-1/3 dark:bg-slate-900",
  });
  form.innerHTML = `
    <h2 class="text-2xl font-bold mb-4 text-center dark:text-white">Update</h2>
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

  const toggleContainer = createElement("div", {
    className: "mt-8 flex items-center",
  });
  const toggleLabel = createElement("span", {
    className: "text-lg mr-4 dark:text-white",
  });
  toggleLabel.textContent = "Dark Mode";

  const toggleSwitch = createElement("div", {
    className:
      "relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in",
  });

  const toggleInput = createElement("input", {
    type: "checkbox",
    name: "toggle",
    id: "toggle",
    className:
      "toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer",
    checked: getDarkMode(),
    onchange: (e: Event) => {
      setDarkMode((e.target as HTMLInputElement).checked);
    },
  });

  const toggleLabelFor = createElement("label", {
    for: "toggle",
    className:
      "toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer",
  });

  toggleSwitch.appendChild(toggleInput);
  toggleSwitch.appendChild(toggleLabelFor);
  toggleContainer.appendChild(toggleLabel);
  toggleContainer.appendChild(toggleSwitch);

  container.appendChild(form);
  container.appendChild(toggleContainer);
  main.appendChild(navigation);
  main.appendChild(container);

  return main;
};
