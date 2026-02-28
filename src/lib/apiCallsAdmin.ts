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

export async function getSubmittedAppsCount(appType?: string) {
  try {
    const response = await api.get(
      API_ROUTES.ADMIN + `/get-submitted-apps-count`,
      { params: { appType } },
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
    const response = await api.post(API_ROUTES.ADMIN + `/accept-app`, {
      id,
      appId: id,
    });
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
    const response = await api.post(API_ROUTES.ADMIN + `/reject-app`, {
      ...payload,
      appId: payload.id,
    });
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

export async function updateProjectStatus(payload: {
  id: number;
  status: string;
}) {
  try {
    const response = await api.post(
      API_ROUTES.ADMIN + `/update-project-status`,
      {
        ...payload,
        id: payload.id,
      },
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating project status:", error);
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

// ==================== DASHBOARD STATS ====================

export async function getDashboardStats() {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/get-dashboard-stats`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
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

// ==================== FEEDBACK ====================

export async function getAllFeedback(params?: {
  status?: string;
  appType?: string;
}) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/feedback`, { params });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching feedback:", error);
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

export async function getFeedbackById(id: number) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/feedback/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching feedback:", error);
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

export async function getFeedbackCounts() {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/feedback/counts`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching feedback counts:", error);
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

export async function updateFeedbackStatus(payload: {
  id: number;
  priority?: string;
}) {
  try {
    const response = await api.post(
      API_ROUTES.ADMIN + `/feedback/update`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating feedback:", error);
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

export async function deleteFeedback(id: number) {
  try {
    const response = await api.delete(API_ROUTES.ADMIN + `/feedback/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error deleting feedback:", error);
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

// ==================== USERS ====================

export async function getAllUsers(params?: {
  role?: string;
  status?: string;
  search?: string;
}) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/users`, { params });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching users:", error);
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

export async function getUserById(id: string) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/users/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching user:", error);
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

export async function getUserCounts() {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/users/counts`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching user counts:", error);
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

export async function updateUserStatus(payload: {
  id: string;
  status: string;
  banReason?: string;
}) {
  try {
    const response = await api.post(
      API_ROUTES.ADMIN + `/users/update-status`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating user status:", error);
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

export async function updateUserRole(payload: { id: string; role: string }) {
  try {
    const response = await api.post(
      API_ROUTES.ADMIN + `/users/update-role`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating user role:", error);
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

// ==================== SUGGESTIONS ====================

export async function getAllSuggestions(params?: { status?: string }) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/suggestions`, {
      params,
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
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

export async function getSuggestionById(id: number) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/suggestions/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching suggestion:", error);
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

export async function getSuggestionCounts() {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/suggestions/counts`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching suggestion counts:", error);
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

export async function createSuggestion(payload: {
  title?: string;
  message: string;
  type?: string;
  priority?: string;
  userId?: string;
}) {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/suggestions`, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error creating suggestion:", error);
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

export async function updateSuggestionStatus(payload: {
  id: number;
  status: string;
  reason?: string;
}) {
  try {
    const response = await api.post(
      API_ROUTES.ADMIN + `/suggestions/update`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating suggestion:", error);
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

export async function deleteSuggestion(id: number) {
  try {
    const response = await api.delete(API_ROUTES.ADMIN + `/suggestions/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error deleting suggestion:", error);
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

// ==================== NOTIFICATIONS ====================

export async function getAllNotifications(params?: { type?: string }) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/notifications`, {
      params,
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
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

export async function getNotificationCounts() {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/notifications/counts`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching notification counts:", error);
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

export async function createNotification(payload: {
  title: string;
  description: string;
  type?: string;
  url?: string;
  userId?: string;
  isActive?: boolean;
}) {
  try {
    const response = await api.post(
      API_ROUTES.ADMIN + `/notifications`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error creating notification:", error);
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

export async function updateNotification(payload: {
  id: number;
  title?: string;
  description?: string;
  type?: string;
  url?: string;
  isActive?: boolean;
}) {
  try {
    const response = await api.post(
      API_ROUTES.ADMIN + `/notifications/update`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating notification:", error);
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

export async function deleteNotification(id: number) {
  try {
    const response = await api.delete(
      API_ROUTES.ADMIN + `/notifications/${id}`,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
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

export async function broadcastNotification(payload: {
  title: string;
  description: string;
  type?: string;
  url?: string;
}) {
  try {
    const response = await api.post(
      API_ROUTES.ADMIN + `/notifications/broadcast`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error broadcasting notification:", error);
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

// ==================== TESTER APPLICATIONS ====================

export async function getTesterApplications(params?: {
  status?: string;
  search?: string;
}) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/tester-applications`, {
      params,
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching tester applications:", error);
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

export async function getTesterApplicationCounts() {
  try {
    const response = await api.get(
      API_ROUTES.ADMIN + `/tester-applications/counts`,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching tester application counts:", error);
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

export async function getTesterApplicationById(id: string) {
  try {
    const response = await api.get(
      API_ROUTES.ADMIN + `/tester-applications/${id}`,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching tester application:", error);
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

export async function updateTesterApplicationStatus(payload: {
  id: string;
  status: string;
  reason?: string;
}) {
  try {
    const response = await api.post(
      API_ROUTES.ADMIN + `/tester-applications/update-status`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating tester application status:", error);
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

// ==================== PROMO CODES ====================

export async function getAllPromoCodes() {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/promo-codes`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching promo codes:", error);
    throw error;
  }
}

export async function createPromoCode(payload: {
  code: string;
  fixedPoints: number;
  isActive?: boolean;
  maxUses?: number | null;
  maxPerUser?: number | null;
}) {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/promo-codes`, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error creating promo code:", error);
    throw error;
  }
}

export async function updatePromoCode(payload: {
  id: number;
  code?: string;
  fixedPoints?: number;
  isActive?: boolean;
  maxUses?: number | null;
  maxPerUser?: number | null;
}) {
  try {
    const response = await api.post(
      API_ROUTES.ADMIN + `/promo-codes/update`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating promo code:", error);
    throw error;
  }
}

export async function deletePromoCode(id: number) {
  try {
    const response = await api.delete(API_ROUTES.ADMIN + `/promo-codes/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error deleting promo code:", error);
    throw error;
  }
}
