const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

const routes = {
  AUTH: "/api/auth",
  USER: "/api/user",
  PRODUCTS: "/api/products",
  ORDERS: "/api/orders",
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
