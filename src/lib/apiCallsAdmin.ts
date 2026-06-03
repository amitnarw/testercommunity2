import axios from "axios";
import API_ROUTES from "./apiRoutes";
import { ControlRoomResponse } from "./types";
import api from "./axios";
import { authClient } from "./auth-client";
import { AuthError } from "./apiCalls";

export async function getControlRoomData(): Promise<ControlRoomResponse> {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/get-control-room-data`);
    return response?.data?.data;
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

export async function updateControlRoomData(payload: Partial<ControlRoomResponse>): Promise<ControlRoomResponse> {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/control-room`, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating control room:", error);
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

    await authClient.getSession();
    return { success: true, data: response };
  } catch (error) {
    console.error("Error admin login via better-auth:", error);
    throw error;
  }
}

export async function getSubmittedApps(status?: string, includeDrafts?: boolean) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/get-submitted-apps`, {
      params: { status, includeDrafts },
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

export async function getSubmittedAppsCount(appType?: string, includeDrafts?: boolean) {
  try {
    const response = await api.get(
      API_ROUTES.ADMIN + `/get-submitted-apps-count`,
      { params: { appType, includeDrafts } },
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

export async function acceptApp(payload: {
  id: number;
  totalTester?: number;
  totalDay?: number;
  minimumAndroidVersion?: number;
  rewardPoints?: number;
}) {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/accept-app`, {
      ...payload,
      appId: payload.id,
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
  priority?: string | null;
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

export async function updateUserWallet(payload: {
  id: string;
  totalPoints: number;
  totalPackages: number;
}) {
  try {
    const response = await api.post(
      API_ROUTES.ADMIN + `/users/update-wallet`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating user wallet:", error);
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

export async function updateUserProfile(payload: { id: string; data: any }) {
  try {
    const response = await api.post(
      API_ROUTES.ADMIN + `/users/update-profile`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
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

export async function convertUserAuthType(payload: {
  userId: string;
  newAuthType: string;
  newPassword?: string;
}) {
  try {
    const response = await api.post(
      API_ROUTES.ADMIN + `/users/convert-auth-type`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error converting user auth type:", error);
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

export async function deleteUser(id: string) {
  try {
    const response = await api.delete(API_ROUTES.ADMIN + `/users/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error deleting user:", error);
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

export async function createUser(payload: any) {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/users`, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error creating user:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.error("Axios error:", status, responseData);
      throw new Error(
        responseData?.message || error.message || "Unknown error",
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

export async function getUserNotifications(userId: string) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/users/notifications/${userId}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;

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

export async function getNotificationTypes() {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/notification-types`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching notification types:", error);
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
  discountType?: string;
  discountValue?: number;
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
  discountType?: string;
  discountValue?: number;
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

export async function getPromoCodeApps(promoCodeId: number) {
  try {
    const response = await api.get(
      API_ROUTES.ADMIN + `/promo-codes/${promoCodeId}/apps`,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching promo code apps:", error);
    throw error;
  }
}

// ==================== BLOGS ====================

export async function getAllBlogs() {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/blogs`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
}

export async function getBlogById(id: number) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/blogs/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
}

export async function createBlog(payload: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorAvatarUrl?: string;
  authorDataAiHint?: string;
  imageUrl?: string;
  dataAiHint?: string;
  tags?: string[];
  isActive?: boolean;
  date?: string;
}) {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/blogs`, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
}

export async function updateBlog(payload: {
  id: number;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  authorName?: string;
  authorAvatarUrl?: string;
  authorDataAiHint?: string;
  imageUrl?: string;
  dataAiHint?: string;
  tags?: string[];
  isActive?: boolean;
  date?: string;
}) {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/blogs/update`, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
}

export async function deleteBlog(id: number) {
  try {
    const response = await api.delete(API_ROUTES.ADMIN + `/blogs/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
}

// ==================== TESTIMONIALS ====================

export async function getAllTestimonials() {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/testimonials`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    throw error;
  }
}

export async function getTestimonialById(id: number) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/testimonials/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    throw error;
  }
}

export async function createTestimonial(payload: {
  name: string;
  role: string;
  avatar: string;
  dataAiHint?: string;
  comment: string;
  image?: string;
  appLink?: string;
  tags?: string[];
  rating?: number;
  isActive?: boolean;
}) {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/testimonials`, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error creating testimonial:", error);
    throw error;
  }
}

export async function updateTestimonial(payload: {
  id: number;
  name?: string;
  role?: string;
  avatar?: string;
  dataAiHint?: string;
  comment?: string;
  image?: string;
  appLink?: string;
  tags?: string[];
  rating?: number;
  isActive?: boolean;
}) {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/testimonials/update`, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating testimonial:", error);
    throw error;
  }
}

export async function deleteTestimonial(id: number) {
  try {
    const response = await api.delete(API_ROUTES.ADMIN + `/testimonials/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    throw error;
  }
}

export async function getPublicTestimonials() {
  try {
    const response = await api.get(API_ROUTES.BLOG + `/testimonials`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching public testimonials:", error);
    throw error;
  }
}

// ==================== ACT AS ROLE ====================

export async function actAsRole(role: "tester" | "user" | null) {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/act-as`, { role });
    return response?.data;
  } catch (error) {
    console.error("Error in actAsRole:", error);
    throw error;
  }
}

// ==================== USER REVIEWS (Admin) ====================

export async function getAllUserReviews(params?: {
  status?: string;
  search?: string;
}) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/user-reviews`, { params });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    throw error;
  }
}

export async function getUserReviewById(id: number) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/user-reviews/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching user review:", error);
    throw error;
  }
}

export async function updateUserReviewStatus(payload: {
  id: number;
  status?: string;
  isPublished?: boolean;
  adminNote?: string;
}) {
  try {
    const response = await api.post(
      API_ROUTES.ADMIN + `/user-reviews/update-status`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating user review status:", error);
    throw error;
  }
}

export async function deleteUserReview(id: number) {
  try {
    const response = await api.delete(API_ROUTES.ADMIN + `/user-reviews/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error deleting user review:", error);
    throw error;
  }
}

// ==================== FINANCE (Super Admin) ====================

export async function getFinanceDashboard() {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/finance/dashboard`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching finance dashboard:", error);
    throw error;
  }
}

export async function getFinanceOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/finance/orders`, { params });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching finance orders:", error);
    throw error;
  }
}

export async function getFinancePayments(params?: {
  page?: number;
  limit?: number;
  status?: string;
  method?: string;
  search?: string;
}) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/finance/payments`, { params });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching finance payments:", error);
    throw error;
  }
}

export async function getFinanceInvoices(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/finance/invoices`, { params });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching finance invoices:", error);
    throw error;
  }
}

export async function getUserInvoices(userId: string, params?: {
  page?: number;
  limit?: number;
}) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/finance/invoices/user/${userId}`, { params });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching user invoices:", error);
    throw error;
  }
}

export async function updateInvoice(payload: {
  id: number;
  service_name?: string;
  period?: string;
  quantity?: number;
  unit_price?: number;
  tax_rate?: number;
  cgst_amount?: number;
  sgst_amount?: number;
  igst_amount?: number;
  due_date?: string;
  place_of_supply?: string;
  supply_type?: string;
  amount_in_words?: string;
  lut_number?: string;
  sac_code?: string;
}) {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/finance/invoices/update`, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
}

export async function getInvoicePreview(userId: string, type?: "IND" | "EXP") {
  try {
    const params: any = {};
    if (type) params.type = type;
    const response = await api.get(API_ROUTES.ADMIN + `/finance/invoices/preview/${userId}`, { params });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching invoice preview:", error);
    throw error;
  }
}

export async function generateDemoPayment(payload: {
  userId: string;
  amount: number;
  currency?: string;
  quantity?: number;
}) {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/finance/invoices/demo-payment`, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error generating demo payment:", error);
    throw error;
  }
}

export async function createInvoice(payload: {
  paymentId: number;
  userId: string;
  invoice_number?: string;
  invoice_type?: string;
  service_name?: string;
  sac_code?: string;
  period?: string;
  quantity?: number;
  unit_price?: number;
  tax_rate?: number;
  cgst_amount?: number;
  sgst_amount?: number;
  igst_amount?: number;
  due_date?: string;
  place_of_supply?: string;
  supply_type?: string;
  amount_in_words?: string;
  lut_number?: string;
}) {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/finance/invoices/create`, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
}

export async function getFinanceRefunds(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/finance/refunds`, { params });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching finance refunds:", error);
    throw error;
  }
}

export async function getFinanceWithdrawals(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/finance/withdrawals`, { params });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching finance withdrawals:", error);
    throw error;
  }
}

export async function approveWithdrawal(id: number) {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/finance/withdrawals/${id}/approve`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error approving withdrawal:", error);
    throw error;
  }
}

export async function rejectWithdrawal(id: number, note?: string) {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/finance/withdrawals/${id}/reject`, { note });
    return response?.data?.data;
  } catch (error) {
    console.error("Error rejecting withdrawal:", error);
    throw error;
  }
}

export async function getFinancePricing() {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/finance/pricing`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching finance pricing:", error);
    throw error;
  }
}

export async function updateFinancePricing(id: number, payload: {
  amount?: number;
  is_active?: boolean;
  country_name?: string;
  currency_code?: string;
  currency_symbol?: string;
}) {
  try {
    const response = await api.put(API_ROUTES.ADMIN + `/finance/pricing/${id}`, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating finance pricing:", error);
    throw error;
  }
}

export async function getUserWalletDetail(userId: string) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/finance/user/${userId}/wallet`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching user wallet detail:", error);
    throw error;
  }
}

export async function getFinancePlans() {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/finance/plans`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching finance plans:", error);
    throw error;
  }
}

export async function getFinancePaymentMethods() {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/finance/payment-methods`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching finance payment methods:", error);
    throw error;
  }
}

// ==================== AUTHORS ====================

export async function getAllAuthors() {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/authors`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching authors:", error);
    throw error;
  }
}

export async function getAuthorById(id: number) {
  try {
    const response = await api.get(API_ROUTES.ADMIN + `/authors/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching author:", error);
    throw error;
  }
}

export async function createAuthor(payload: {
  name: string;
  avatarUrl?: string;
  bio?: string;
  dataAiHint?: string;
}) {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/authors`, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error creating author:", error);
    throw error;
  }
}

export async function updateAuthor(payload: {
  id: number;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  dataAiHint?: string;
}) {
  try {
    const response = await api.post(API_ROUTES.ADMIN + `/authors/update`, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating author:", error);
    throw error;
  }
}

export async function deleteAuthor(id: number) {
  try {
    const response = await api.delete(API_ROUTES.ADMIN + `/authors/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error deleting author:", error);
    throw error;
  }
}

// ==================== PERMISSION MATRIX ====================

export async function getAllPermissions() {
  try {
    const response = await api.get(API_ROUTES.ADMIN + "/permissions");
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching permissions:", error);
    throw error;
  }
}

export async function updatePermission(
  roleId: number,
  moduleId: number,
  payload: {
    canReadList?: boolean;
    canReadSingle?: boolean;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
  },
) {
  try {
    const response = await api.put(
      API_ROUTES.ADMIN + `/permissions/${roleId}/${moduleId}`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating permission:", error);
    throw error;
  }
}
