import axios from "axios";
import API_ROUTES from "./apiRoutes";
import { ControlRoomResponse } from "./types";
import api from "./axios";
import { authClient } from "./auth-client";
import { AuthError } from "./apiCalls";

export async function getControlRoomData(): Promise<ControlRoomResponse> {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/get-control-room-data`);
    return response.data;
  } catch (error) {
    console.error("Error fetching control room:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function adminLogin(payload: {
  email: string;
  password: string;
  rememberMe?: boolean;
}) {
  try {
    const response = await authClient?.signIn.email({
      email: payload.email,
      password: payload.password,
      rememberMe: payload.rememberMe,
    });

    if (response?.error) {
      throw new AuthError(
        response.error.code ?? "LOGIN_FAILED",
        response.error.message ?? "Login failed",
      );
    }
    return { success: true, data: response };
  } catch (error) {
    console.error("Error admin login via better-auth:", error);
    throw error;
  }
}

export async function getSubmittedApps(status?: string) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/get-submitted-apps`, {
      params: { status },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching submitted apps:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function getSubmittedAppsCount() {
  try {
    const response = await api.get(
      API_ROUTES.ADMIN + `/get-submitted-apps-count`,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching submitted apps count:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function acceptApp(id: number) {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/accept-app`, { id });
    return response?.data?.data;
  } catch (error) {
    console.error("Error accepting app:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}

export async function rejectApp(payload: {
  id: number;
  title: string;
  description: string;
  image?: string;
  video?: string;
}) {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/reject-app`, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error rejecting app:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);

      throw new Error(
        responseData?.message || error.message || "Unknown Axios error",
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(JSON.stringify(error));
    }
  }
}
