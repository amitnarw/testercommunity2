const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

const routes = {
  AUTH: "/api/auth",
  USER: "/api/user",
  PRODUCTS: "/api/products",
  ORDERS: "/api/orders",
  ADMIN: "/api/admin",
  DASHBOARD: "/api/dashboard",
  HUB: "/api/hub",
  R2: "/api/R2",
  BILLING: "/api/billing",
  TESTER: "/api/tester",
  BLOG: "/api/blog",
  REVIEW: "/api/review",
  SUPPORT: "/api/support",
  DECLARATION: "/api/declaration",
  FAQ: "/api/faq",
  APP_CHAT: "/api/app-chat",
  HANDSHAKE_REQUESTS: "/api/handshake-requests",
  ELITE_BADGE: "/api/elite-badge",
  PENALTY: "/api/penalty",
  ADDONS: "/api/addons",
  LEVEL: "/api/level",
  ADMIN_HANDSHAKE_MONITORING: "/api/admin/handshake-monitoring",
};

const API_ROUTES = new Proxy(routes, {
  get(target, prop: string) {
    try {
      if (prop in target) {
        return `${BASE_URL}${target[prop as keyof typeof target]}`;
      }
      return undefined;
    } catch (err) {
      console.error("Error accessing API route", prop, err);
      return undefined;
    }
  },
});

export default API_ROUTES;
