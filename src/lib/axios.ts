import axios from "axios";
import { decryptData, encryptData } from "./encryptDecryptPayload";
import { ROUTES } from "./routes";
import { authClient } from "./auth-client";

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
    if (error.response?.data?.data) {
      try {
        error.response.data.data = await decryptData(error.response.data.data);
      } catch (e) {
        console.error("Failed to decrypt error data:", e);
      }
    }

    if (error.response?.status === 403 && error.response?.data?.code === "ACCOUNT_BANNED") {
      if (typeof window !== "undefined") {
        try {
          await authClient.signOut();
        } catch (signOutError) {
          console.error("Sign-out failed:", signOutError);
        }
        const message = error.response.data.message || "Your account has been suspended. Please contact support.";
        window.location.href = `/banned?error_description=${encodeURIComponent(message)}`;
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const pathname = window.location.pathname;

        // Public SEO marketing pages must remain accessible to logged-out visitors.
        // Some components on /seo/* (e.g. pricing cards) call useUserData() to decide
        // CTAs, which legitimately returns 401 for anonymous users. Bouncing them to
        // /auth/login or signing them out is wrong ,  let the query see "no user" and move on.
        if (pathname.startsWith("/seo/")) {
          return Promise.reject(error);
        }

        // Avoid infinite redirect loops if we're already on a login page
        const isAlreadyOnLogin =
          pathname.includes(ROUTES.AUTH.LOGIN) ||
          pathname.includes(ROUTES.ADMIN.AUTH.LOGIN) ||
          pathname.includes(ROUTES.TESTER.AUTH.LOGIN);

        if (!isAlreadyOnLogin) {
          // Sign out using better-auth client to clear cookies
          try {
            await authClient.signOut();
          } catch (signOutError) {
            // Continue even if sign-out fails
            console.error("Sign-out failed:", signOutError);
          }

          // Redirect to respective login page based on the current path
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
