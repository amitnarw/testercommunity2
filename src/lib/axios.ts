import axios from "axios";
import { decryptData, encryptData } from "./encryptDecryptPayload";

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
  }
);

// Response interceptor: decrypt data when received
api.interceptors.response.use(
  async (response) => {
    if (response.data?.data) {
      response.data.data = await decryptData(response.data.data);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
