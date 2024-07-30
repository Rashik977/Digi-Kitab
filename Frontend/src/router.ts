import { getUser, isAuthenticated } from "./services/authServices";
import { match, MatchFunction } from "path-to-regexp";

// Define route types
type Route = {
  match: MatchFunction<object>;
  load: (params?: { [key: string]: string }) => Promise<any>;
};

// Define your routes with path-to-regexp match functions
const routes: Route[] = [
  {
    match: match("/"),
    load: () => import("./pages/login"),
  },
  {
    match: match("/login"),
    load: () => import("./pages/login"),
  },
  {
    match: match("/register"),
    load: () => import("./pages/register"),
  },
  {
    match: match("/settings"),
    load: async () => {
      if (!isAuthenticated()) {
        window.history.pushState(null, "", "/login");
        return import("./pages/login"); // Redirect to login page
      }
      return import("./pages/settings");
    },
  },
  {
    match: match("/buyBooks"),
    load: async () => {
      if (!isAuthenticated()) {
        window.history.pushState(null, "", "/login");
        return import("./pages/login"); // Redirect to login page
      }
      return import("./pages/buyBooks");
    },
  },
  {
    match: match("/book/:id"),
    load: async (params) => {
      const module = await import("./pages/bookPage");
      return {
        render: () => module.default.render(params!.id),
      };
    },
  },
  {
    match: match("/manageUsers"),
    load: async () => {
      if (!isAuthenticated() || !(getUser()?.role === "super")) {
        window.history.pushState(null, "", "/login");
        return import("./pages/login"); // Redirect to login page
      }
      return import("./pages/manageUsers");
    },
  },
  {
    match: match("/manageStaff"),
    load: async () => {
      if (!isAuthenticated() || !(getUser()?.role === "super")) {
        window.history.pushState(null, "", "/login");
        return import("./pages/login"); // Redirect to login page
      }
      return import("./pages/manageStaff");
    },
  },
  {
    match: match("/manageBooks"),
    load: async () => {
      if (
        !isAuthenticated() ||
        !(getUser()?.role === "super" || getUser()?.role === "staff")
      ) {
        window.history.pushState(null, "", "/login");
        return import("./pages/login"); // Redirect to login page
      }
      return import("./pages/manageBooks");
    },
  },
  {
    match: match("/checkout"),
    load: async () => {
      if (!isAuthenticated()) {
        window.history.pushState(null, "", "/login");
        return import("./pages/login"); // Redirect to login page
      }
      return import("./pages/checkout");
    },
  },
  {
    match: match("/library"),
    load: async () => {
      if (!isAuthenticated()) {
        window.history.pushState(null, "", "/login");
        return import("./pages/login"); // Redirect to login page
      }
      return import("./pages/library");
    },
  },
];

export const initRouter = () => {
  const container = document.getElementById("app") as HTMLElement;

  const navigateTo = async (path: string) => {
    try {
      let foundRoute: Route | undefined;
      let params: object | undefined;

      for (const route of routes) {
        const result = route.match(path);
        if (result) {
          foundRoute = route;
          params = result.params;
          break;
        }
      }

      if (!foundRoute) {
        // If route is not found, load the NotFound page
        const notFoundModule = await import("./pages/notFound");
        container.innerHTML = "";
        container.appendChild(notFoundModule.render());
        return;
      }

      const module = await foundRoute.load(params as { [key: string]: string });
      const content = await module.render();

      if (!(content instanceof Node)) {
        throw new Error("Render function did not return a DOM Node");
      }

      container.innerHTML = "";
      container.appendChild(content);
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
