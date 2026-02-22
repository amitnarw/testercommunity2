import axios from "axios";
import { decryptData, encryptData } from "./encryptDecryptPayload";
import { ROUTES } from "./routes";

// Create an Axios instance
// const api = axios.create({
//   baseURL: API_ROUTES.USER, // or your base API URL
// });
const api = axios.create({
  withCredentials: true,
});

// Request interceptor: encrypt data before sending
api.interceptors.request.use(
  async (config) => {
    if (config.data) {
      config.data = { payload: await encryptData(config.data) };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor: decrypt data when received
api.interceptors.response.use(
  async (response) => {
    if (response.data?.data) {
      response.data.data = await decryptData(response.data.data);
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const pathname = window.location.pathname;

        // Avoid infinite redirect loops if we're already on a login page
        const isAlreadyOnLogin =
          pathname.includes(ROUTES.AUTH.LOGIN) ||
          pathname.includes(ROUTES.ADMIN.AUTH.LOGIN) ||
          pathname.includes(ROUTES.TESTER.AUTH.LOGIN);

        if (!isAlreadyOnLogin) {
          let loginUrl: string = ROUTES.AUTH.LOGIN;

          if (pathname.startsWith("/admin")) {
            loginUrl = ROUTES.ADMIN.AUTH.LOGIN;
          } else if (pathname.startsWith("/tester")) {
            loginUrl = ROUTES.TESTER.AUTH.LOGIN;
          }

          window.location.href = `${loginUrl}?redirect=${encodeURIComponent(pathname)}`;
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
