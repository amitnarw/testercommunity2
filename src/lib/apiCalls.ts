import axios from "axios";
import API_ROUTES from "./apiRoutes";
import { authClient } from "./auth-client";
import { ROUTES } from "./routes";
import {
  AppCategoriesResponse,
  AppData,
  DashboardDataResponse,
  HubDataResponse,
  HubSubmittedAppResponse,
  NotificationResponse,
  PricingResponse,
  SessionResponse,
  SubmittedAppsCount,
  UserDataAttributes,
  UserProfileDataAttributes,
  UserWallerResponse,
  PaymentConfigResponse,
  BillingHistoryItem,
  CreateOrderResponse,
  PaymentVerificationPayload,
  PaymentVerificationResponse,
  TesterProjectResponse,
} from "./types";
import api from "./axios";

export class AuthError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "AuthError";
  }
}

export const register = async ({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  try {
    if (!email || !password || !firstName || !lastName) {
      throw new Error(
        "Please add email address, password, first and last name to register.",
      );
    }
    const response = await authClient?.signUp.email({
      email,
      password,
      name: firstName + " " + lastName,
      // callbackURL: "/",
      ...{
        first_name: firstName,
        last_name: lastName,
        role: "user",
        auth_type: "EMAIL_PASSWORD",
      },
    });
    if (response?.error) {
      throw new Error(response?.error?.message);
    }
    return { success: true, data: "User registered successfully" };
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error(
      error instanceof Error ? error?.message : JSON.stringify(error),
    );
  }
};

export const login = async ({
  email,
  password,
  rememberMe,
}: {
  email: string;
  password: string;
  rememberMe: boolean;
}) => {
  try {
    const response = await authClient?.signIn.email({
      email,
      password,
      rememberMe,
    });

    if (response?.error) {
      throw new AuthError(
        response.error.code ?? "LOGIN_FAILED",
        response.error.message ?? "Login failed",
      );
    }
    return { success: true, data: response };
  } catch (error) {
    console.error("Error logging in user: ", error);
    throw error;
  }
};

export const googleLogin = async () => {
  try {
    const response = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}${ROUTES.AUTH.LOGIN}`,
    });

    if (response?.error) {
      throw new AuthError(
        response.error.code ?? "LOGIN_FAILED",
        response.error.message ?? "Login failed",
      );
    }
    return { success: true, data: response };
  } catch (error) {
    console.error("Error logging in user: ", error);
    throw error;
  }
};

export const testerLogin = async ({
  email,
  password,
  rememberMe,
}: {
  email: string;
  password: string;
  rememberMe: boolean;
}) => {
  try {
    const response = await authClient?.signIn.email({
      email,
      password,
      rememberMe,
    });

    if (response?.error) {
      throw new AuthError(
        response.error.code ?? "LOGIN_FAILED",
        response.error.message ?? "Login failed",
      );
    }
    return { success: true, data: response };
  } catch (error) {
    console.error("Error logging in tester: ", error);
    throw error;
  }
};

export const googleTesterLogin = async () => {
  try {
    const response = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}${ROUTES.TESTER.AUTH.LOGIN}`,
    });

    if (response?.error) {
      throw new AuthError(
        response.error.code ?? "LOGIN_FAILED",
        response.error.message ?? "Login failed",
      );
    }
    return { success: true, data: response };
  } catch (error) {
    console.error("Error logging in tester via Google: ", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await authClient?.signOut({
      fetchOptions: {
        onSuccess: () => {
          console.log("logout done");
        },
      },
    });
    return response;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const resendEmailVerification = async ({ email }: { email: string }) => {
  try {
    if (!email) {
      return new Error("Email is required to send verification");
    }
    const response = await authClient.sendVerificationEmail({
      email,
    });
    return response;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const emailVerification = async ({ token }: { token: string }) => {
  try {
    if (!token) {
      throw new Error("Please send token to verify email address.");
    }

    const response = await authClient.verifyEmail({
      query: {
        token,
      },
    });

    if (response?.error) {
      throw new Error(response?.error?.message);
    }
    return { success: true, data: "Email address verified successfully" };
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error(
      error instanceof Error ? error?.message : JSON.stringify(error),
    );
  }
};

export const getUserData = async (): Promise<UserDataAttributes> => {
  try {
    const response = await api.get(API_ROUTES.USER + `/get-user-data`);
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
};

export const saveUserData = async (payload: UserDataAttributes) => {
  try {
    if (!payload) {
      throw new Error("Payload is undefined");
    }
    const response = await api.post(
      API_ROUTES.USER + "/save-user-data",
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error registering user:", error);
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
};

export const getUserProfileData =
  async (): Promise<UserProfileDataAttributes> => {
    try {
      const response = await api.get(
        API_ROUTES.USER + "/get-user-profile-data",
      );
      return response?.data?.data;
    } catch (error) {
      console.error("Error getting user profile:", error);
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
  };

export const saveInitialProfileData = async () => {
  try {
    await api.get(API_ROUTES.USER + "/initial-user-profile");
    return true;
  } catch (error) {
    console.error("Error saving intial value of user-detail:", error);
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
};

// export async function fetchUser(id: string) {
//   try {
//     const response = await api.get(API_ROUTES.USER + `/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     if (axios.isAxiosError(error)) {
//       const status = error.response?.status;
//       const responseData = error.response?.data;
//       console.error("Axios error:", status, responseData);

//       throw new Error(
//         responseData?.message || error.message || "Unknown Axios error"
//       );
//     } else if (error instanceof Error) {
//       throw new Error(error.message);
//     } else {
//       throw new Error(JSON.stringify(error));
//     }
//   }
// }

export const saveProfileData = async (payload: UserProfileDataAttributes) => {
  try {
    if (!payload) {
      throw new Error("Payload is undefined");
    }
    const response = await api.post(
      API_ROUTES.USER + "/save-profile-data",
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error registering user:", error);
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
};

// Dashboard
export async function getDasboardData(): Promise<DashboardDataResponse> {
  try {
    const response = await api.get(
      API_ROUTES.DASHBOARD + `/get-dashboard-stats`,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
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

export async function addDashboardAppSubmit(
  payload: AppData,
): Promise<DashboardDataResponse> {
  try {
    const response = await api.post(
      API_ROUTES.DASHBOARD + `/add-dashboard-app-submit`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
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

export async function addDashboardAppDraft(
  payload: AppData,
): Promise<AppData | null> {
  try {
    const response = await api.post(
      API_ROUTES.DASHBOARD + `/add-dashboard-app-draft`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error saving dashboard app draft:", error);
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

export async function getDashboardAppsCount(): Promise<SubmittedAppsCount> {
  try {
    const response = await api.get(API_ROUTES.DASHBOARD + `/get-apps-count`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching dashboard apps count:", error);
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

export async function getDashboardApps(
  type: string,
): Promise<HubSubmittedAppResponse[]> {
  try {
    const response = await api.get(
      API_ROUTES.DASHBOARD + `/get-dashboard-apps/${type}`,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching dashboard apps:", error);
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

// Hub
export async function getHubData(): Promise<HubDataResponse> {
  try {
    const response = await api.get(API_ROUTES.HUB + `/get-hub-stats`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching hub data:", error);
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

export async function getAppCategories(): Promise<AppCategoriesResponse[]> {
  try {
    const response = await api.get(API_ROUTES.HUB + `/get-app-categories`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching app categories:", error);
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

export async function addHubApp(payload: AppData) {
  try {
    const response = await api.post(API_ROUTES.HUB + `/add-hub-app`, payload);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching app categories:", error);
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

export async function getHubSubmittedApp(
  type: string,
): Promise<HubSubmittedAppResponse[]> {
  try {
    const response = await api.get(
      API_ROUTES.HUB + `/submitted/get-hub-apps/${type}`,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching submitted hub apps:", error);
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

export async function getSubmittedAppsCount(): Promise<SubmittedAppsCount> {
  try {
    const response = await api.get(
      API_ROUTES.HUB + "/submitted/get-apps-count",
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching app categories:", error);
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

export async function getHubApps(
  type: string,
): Promise<HubSubmittedAppResponse[]> {
  try {
    const response = await api.get(API_ROUTES.HUB + `/get-hub-apps/${type}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching hub apps:", error);
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

export async function getTesterProjects(
  status?: string,
): Promise<TesterProjectResponse[]> {
  try {
    const params = status ? `?status=${status}` : "";
    const response = await api.get(
      API_ROUTES.TESTER + `/get-projects${params}`,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching tester projects:", error);
    if (axios.isAxiosError(error)) {
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

export async function updateTesterAvailability(availability: string) {
  try {
    const response = await api.put(API_ROUTES.TESTER + `/availability`, {
      availability,
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating tester availability:", error);
    if (axios.isAxiosError(error)) {
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

export async function getHubAppsCount(): Promise<SubmittedAppsCount> {
  try {
    const response = await api.get(API_ROUTES.HUB + "/get-apps-count");
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching hub apps count:", error);
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

export async function getSingleHubAppDetails(
  id: string,
  view?: string,
): Promise<HubSubmittedAppResponse> {
  try {
    const url = view
      ? API_ROUTES.HUB + `/get-app-details/${id}?view=${view}`
      : API_ROUTES.HUB + `/get-app-details/${id}`;
    const response = await api.get(url);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching single hub app details:", error);
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

export async function addHubAppTestingRequest(payload: { hub_id: string }) {
  try {
    const response = await api.post(
      API_ROUTES.HUB + `/add-hub-testing-request`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error adding hub app testing request:", error);
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

export async function acceptHubAppTestingRequest(payload: {
  hub_id: string;
  tester_id: string;
}) {
  try {
    if (!payload.hub_id || !payload.tester_id) {
      throw new Error("Invalid payload");
    }
    const response = await api.post(
      API_ROUTES.HUB + `/accept-hub-testing-request`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error accepting hub app testing request:", error);
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

export async function rejectHubAppTestingRequest(payload: {
  hub_id: string;
  tester_id: string;
  title: string;
  description: string;
  image?: string;
  video?: string;
}) {
  try {
    const response = await api.post(
      API_ROUTES.HUB + `/reject-hub-testing-request`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error rejecting hub app testing request:", error);
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

export async function addHubAppFeedback(payload: {
  hub_id: string;
  message: string;
  type: string;
  priority?: string | null;
  image?: string;
  video?: string;
}) {
  try {
    const response = await api.post(
      API_ROUTES.HUB + `/add-hub-feedback`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error adding hub app feedback:", error);
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

export async function updateHubAppFeedback(payload: {
  id: number;
  message: string;
  type: string;
  priority?: string | null;
  image?: string | null;
  video?: string | null;
}) {
  try {
    const response = await api.post(
      API_ROUTES.HUB + `/update-hub-feedback`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating hub app feedback:", error);
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

export async function deleteHubAppFeedback(id: number) {
  try {
    const response = await api.delete(
      API_ROUTES.HUB + `/delete-feedback/${id}`,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error deleting hub app feedback:", error);
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

export async function completeHostedApp(payload: { appId: number | string }) {
  try {
    const response = await api.post(
      API_ROUTES.HUB + `/complete-hosted-app`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error completing hosted app:", error);
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

// Notifications
export async function getUserNotifications(): Promise<{
  result: NotificationResponse[];
  totalNotifications: number;
}> {
  try {
    const response = await api.get(API_ROUTES.USER + `/get-notifications`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching user notifications data:", error);
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

// Wallet
export async function getUserWallet(): Promise<UserWallerResponse> {
  try {
    const response = await api.get(API_ROUTES.USER + `/get-user-wallet`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching user wallet data:", error);
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

// User Transactions
export interface UserTransaction {
  id: string;
  date: string;
  type: string;
  description: string;
  amount: string;
  change: string;
  status: string;
  changeType: "positive" | "negative";
  transactionType: string;
  action: string | null;
  points: number | null;
  package: number | null;
}

export interface UserTransactionsResponse {
  transactions: UserTransaction[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export async function getUserTransactions(params?: {
  type?: string;
  limit?: number;
  offset?: number;
}): Promise<UserTransactionsResponse> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append("type", params.type);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());

    const queryString = queryParams.toString();
    const url =
      API_ROUTES.USER +
      `/get-user-transactions${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(url);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching user transactions:", error);
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

// R2
export async function createUploadUrl(payload: {
  filename: string;
  contentType: string;
  size: number;
  type: string;
}) {
  try {
    const response = await api.post(
      API_ROUTES.R2 + `/create-upload-url`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error creating upload URL:", error);
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

export async function uploadFileToR2(
  file: File,
  uploadUrl: string,
  onProgress?: (percent: number) => void,
) {
  try {
    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      // Track progress
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentCompleted);
        }
      },
    });
  } catch (error) {
    console.error("Error uploading file to R2:", error);
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

// Misc
export async function getAllPricingPlans(): Promise<PricingResponse[]> {
  try {
    const response = await api.get(API_ROUTES.USER + `/get-all-pricing-plans`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching all plans data:", error);
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

export async function getAllSessions(): Promise<SessionResponse[]> {
  try {
    const response = await api.get(API_ROUTES.USER + `/get-all-sessions`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching all sessions:", error);
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

export async function doSessionLogoutSingle(payload: { session_id: string }) {
  try {
    if (!payload) {
      throw new Error("Payload is undefined");
    }
    const response = await api.post(
      API_ROUTES.USER + `/logout-single-session`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error while logging out single session:", error);
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

export async function doSessionLogoutAll() {
  try {
    const response = await api.post(API_ROUTES.USER + `/logout-all-sessions`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error while logging out all sessions:", error);
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

export async function getEarnPoints(): Promise<{
  surveyPoints: number;
  surveyDone: boolean;
}> {
  try {
    const response = await api.get(API_ROUTES.USER + `/get-earn-points`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching all sessions:", error);
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

export async function submitDailyVerification(payload: {
  hubId: number | string;
  proofImage: string;
  metaData?: any;
}) {
  try {
    const response = await api.post(
      API_ROUTES.HUB + `/submit-daily-verification`,
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error submitting daily verification:", error);
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

// Billing
export async function getPaymentConfig(): Promise<PaymentConfigResponse> {
  try {
    const response = await api.get(API_ROUTES.BILLING + `/config`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching payment config:", error);
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

export async function getBillingHistory(): Promise<BillingHistoryItem[]> {
  try {
    const response = await api.get(API_ROUTES.BILLING + `/history`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching billing history:", error);
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

export async function createOrder(
  planId: string,
): Promise<CreateOrderResponse> {
  try {
    const response = await api.post(API_ROUTES.BILLING + `/create-order`, {
      payload: { planId },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error creating order:", error);
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

export async function verifyPayment(
  payload: PaymentVerificationPayload,
): Promise<PaymentVerificationResponse> {
  try {
    const response = await api.post(API_ROUTES.BILLING + `/verify-payment`, {
      payload,
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error verifying payment:", error);
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

export async function getPendingOrders(): Promise<CreateOrderResponse[]> {
  try {
    const response = await api.get(API_ROUTES.BILLING + `/pending-orders`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching pending orders:", error);
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

export async function assignTestersToApp(payload: {
  id: string; // DashboardAndHub ID
  testerIds: string[];
}) {
  try {
    const response = await api.post(
      API_ROUTES.ADMIN + "/tester-applications/assign",
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error assigning testers to app:", error);
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

export async function unassignTesterFromApp(payload: {
  id: string; // DashboardAndHub ID
  testerId: string;
}) {
  try {
    const response = await api.post(
      API_ROUTES.ADMIN + "/tester-applications/unassign",
      payload,
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error unassigning tester from app:", error);
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
