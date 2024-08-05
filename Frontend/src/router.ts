import { getUser, isAuthenticated } from "./services/authServices";
import { match, MatchFunction } from "path-to-regexp";

// create a type for Route
type Route = {
  match: MatchFunction<object>;
  load: (params?: { [key: string]: string }) => Promise<any>;
};

// Defining routes with path-to-regexp match functions
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
        return import("./pages/login");
      }
      return import("./pages/UserView/settings");
    },
  },
  {
    match: match("/buyBooks"),
    load: async () => {
      if (!isAuthenticated()) {
        window.history.pushState(null, "", "/login");
        return import("./pages/login");
      }
      return import("./pages/UserView/buyBooks");
    },
  },
  {
    match: match("/book/:id"),
    load: async (params) => {
      const module = await import("./pages/UserView/bookPage");
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
        return import("./pages/login");
      }
      return import("./pages/AdminView/manageUsers");
    },
  },
  {
    match: match("/manageStaff"),
    load: async () => {
      if (!isAuthenticated() || !(getUser()?.role === "super")) {
        window.history.pushState(null, "", "/login");
        return import("./pages/login");
      }
      return import("./pages/AdminView/manageStaff");
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
        return import("./pages/login");
      }
      return import("./pages/AdminView/manageBooks");
    },
  },
  {
    match: match("/checkout"),
    load: async () => {
      if (!isAuthenticated()) {
        window.history.pushState(null, "", "/login");
        return import("./pages/login");
      }
      return import("./pages/UserView/checkout");
    },
  },
  {
    match: match("/library"),
    load: async () => {
      if (!isAuthenticated()) {
        window.history.pushState(null, "", "/login");
        return import("./pages/login");
      }
      return import("./pages/UserView/library");
    },
  },
  {
    match: match("/library/:id/chapter/:chapterId"),
    load: async (params) => {
      const module = await import("./pages/UserView/bookReading");
      return {
        render: () => module.render(parseInt(params!.id), params!.chapterId),
      };
    },
  },
  {
    match: match("/stats"),
    load: async () => {
      if (!isAuthenticated()) {
        window.history.pushState(null, "", "/login");
        return import("./pages/login");
      }
      return import("./pages/UserView/stats");
    },
  },
  {
    match: match("/404"),
    load: () => import("./pages/notFound"),
  },
];

// Initialize the router
export const initRouter = () => {
  const container = document.getElementById("app") as HTMLElement;

  // Function to navigate to a path
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

  // Handle back/forward navigation
  window.addEventListener("popstate", () => {
    const path = window.location.pathname;
    navigateTo(path);
  });

  // Handle link clicks
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
