import { isAuthenticated } from "./services/authServices";

// router.ts
const routes: { [key: string]: () => Promise<any> } = {
  "/": () => import("./pages/login"),
  "/login": () => import("./pages/login"),
  "/register": () => import("./pages/register"),

  "/dashboard": async () => {
    if (!isAuthenticated()) {
      window.history.pushState(null, "", "/login");
      return import("./pages/login"); // Redirect to login page
    }
    return import("./pages/dashboard");
  },
};

export const initRouter = () => {
  const container = document.getElementById("app") as HTMLElement;

  const navigateTo = async (path: string) => {
    try {
      const route = routes[path];
      if (!route) {
        // If route is not found, load the NotFound page
        const notFoundModule = await import("./pages/notFound");
        container.innerHTML = "";
        container.appendChild(notFoundModule.render());
        return;
      }

      const module = await route();
      container.innerHTML = "";
      container.appendChild(module.render());
    } catch (error) {
      console.error(`Failed to navigate to ${path}:`, error);
    }
  };

  window.addEventListener("popstate", () => {
    const path = window.location.pathname;
    navigateTo(path);
  });

  document.addEventListener("click", (e) => {
    const target = e.target as HTMLAnchorElement;
    if (target.matches("[data-link]")) {
      e.preventDefault();
      console.log("Navigating to", target.getAttribute("href"));
      window.history.pushState(null, "", target.getAttribute("href"));
      navigateTo(target.getAttribute("href")!);
    }
  });

  // Handle initial page load
  navigateTo(window.location.pathname);
};
